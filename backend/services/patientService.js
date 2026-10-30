import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import { v2 as cloudinary } from "cloudinary"
import Stripe from "stripe"
import Patient from "../schemas/patient.js"
import Clinician from "../schemas/clinician.js"
import Booking from "../schemas/booking.js"

const payments = new Stripe(process.env.STRIPE_SECRET_KEY)

const fail = (res, message) => res.json({ success: false, message })
const ok = (res, payload = {}) => res.json({ success: true, ...payload })

export const signupPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return fail(res, "Missing Details")
    if (!validator.isEmail(email)) return fail(res, "Please enter a valid email")
    if (password.length < 8) return fail(res, "Please enter a strong password")

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    const created = await new Patient({ name, email, password: passwordHash }).save()
    const token = jwt.sign({ id: created._id }, process.env.JWT_SECRET)
    return ok(res, { token })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const signinPatient = async (req, res) => {
  try {
    const { email, password } = req.body
    const account = await Patient.findOne({ email })
    if (!account) return fail(res, "User does not exist")

    const matched = await bcrypt.compare(password, account.password)
    if (!matched) return fail(res, "Invalid credentials")

    const token = jwt.sign({ id: account._id }, process.env.JWT_SECRET)
    return ok(res, { token })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const readPatientProfile = async (req, res) => {
  try {
    const userData = await Patient.findById(req.body.userId).select("-password")
    return ok(res, { userData })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const writePatientProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body
    if (!name || !phone || !dob || !gender) return fail(res, "Data Missing")

    await Patient.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    })

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" })
      await Patient.findByIdAndUpdate(userId, { image: uploaded.secure_url })
    }

    return ok(res, { message: "Profile Updated" })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const createBooking = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body
    const clinician = await Clinician.findById(docId).select("-password")
    if (!clinician.available) return fail(res, "Doctor Not Available")

    const taken = { ...(clinician.slots_booked || {}) }
    const daySlots = taken[slotDate] ? [...taken[slotDate]] : []
    if (daySlots.includes(slotTime)) return fail(res, "Slot Not Available")
    daySlots.push(slotTime)
    taken[slotDate] = daySlots

    const patient = await Patient.findById(userId).select("-password")
    const clinicianCopy = clinician.toObject()
    delete clinicianCopy.slots_booked

    await new Booking({
      userId,
      docId,
      userData: patient,
      docData: clinicianCopy,
      amount: clinician.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    }).save()

    await Clinician.findByIdAndUpdate(docId, { slots_booked: taken })
    return ok(res, { message: "Appointment Booked" })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const cancelPatientBooking = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body
    const visit = await Booking.findById(appointmentId)
    if (visit.userId !== userId) return fail(res, "Unauthorized action")

    await Booking.findByIdAndUpdate(appointmentId, { cancelled: true })

    const { docId, slotDate, slotTime } = visit
    const clinician = await Clinician.findById(docId)
    const taken = { ...(clinician.slots_booked || {}) }
    taken[slotDate] = (taken[slotDate] || []).filter((time) => time !== slotTime)
    await Clinician.findByIdAndUpdate(docId, { slots_booked: taken })

    return ok(res, { message: "Appointment Cancelled" })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const listPatientBookings = async (req, res) => {
  try {
    const appointments = await Booking.find({ userId: req.body.userId })
    return ok(res, { appointments })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const openStripeCheckout = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const { origin } = req.headers
    const visit = await Booking.findById(appointmentId)

    if (!visit || visit.cancelled) {
      return fail(res, "Appointment Cancelled or not found")
    }

    const currency = process.env.CURRENCY.toLocaleLowerCase()
    const session = await payments.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&appointmentId=${visit._id}`,
      cancel_url: `${origin}/verify?success=false&appointmentId=${visit._id}`,
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: visit.amount * 100,
            product_data: { name: "Appointment Fees" },
          },
        },
      ],
    })

    return ok(res, { session_url: session.url })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const confirmStripePayment = async (req, res) => {
  try {
    const { appointmentId, success } = req.body
    if (success === "true") {
      await Booking.findByIdAndUpdate(appointmentId, { payment: true })
      return ok(res, { message: "Payment Successful" })
    }
    return fail(res, "Payment Failed")
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}
