import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import { v2 as cloudinary } from "cloudinary"
import Booking from "../schemas/booking.js"
import Clinician from "../schemas/clinician.js"
import Patient from "../schemas/patient.js"

const fail = (res, message) => res.json({ success: false, message })
const ok = (res, payload = {}) => res.json({ success: true, ...payload })

export const signinStaff = async (req, res) => {
  try {
    const { email, password } = req.body
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      return ok(res, { token })
    }
    return fail(res, "Invalid credentials")
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const listAllBookings = async (req, res) => {
  try {
    const appointments = await Booking.find({})
    return ok(res, { appointments })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const cancelStaffBooking = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.body.appointmentId, { cancelled: true })
    return ok(res, { message: "Appointment Cancelled" })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const createClinician = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    const imageFile = req.file

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return fail(res, "Missing Details")
    }
    if (!validator.isEmail(email)) return fail(res, "Please enter a valid email")
    if (password.length < 8) return fail(res, "Please enter a strong password")

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    const uploaded = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })

    await new Clinician({
      name,
      email,
      image: uploaded.secure_url,
      password: passwordHash,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    }).save()

    return ok(res, { message: "Doctor Added" })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const listAllClinicians = async (req, res) => {
  try {
    const doctors = await Clinician.find({}).select("-password")
    return ok(res, { doctors })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const staffOverview = async (req, res) => {
  try {
    const doctors = await Clinician.find({})
    const users = await Patient.find({})
    const appointments = await Booking.find({})

    return ok(res, {
      dashData: {
        doctors: doctors.length,
        appointments: appointments.length,
        patients: users.length,
        latestAppointments: [...appointments].reverse(),
      },
    })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}
