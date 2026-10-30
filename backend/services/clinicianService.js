import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import Clinician from "../schemas/clinician.js"
import Booking from "../schemas/booking.js"

const fail = (res, message) => res.json({ success: false, message })
const ok = (res, payload = {}) => res.json({ success: true, ...payload })

export const signinClinician = async (req, res) => {
  try {
    const { email, password } = req.body
    const account = await Clinician.findOne({ email })
    if (!account) return fail(res, "Invalid credentials")

    const matched = await bcrypt.compare(password, account.password)
    if (!matched) return fail(res, "Invalid credentials")

    const token = jwt.sign({ id: account._id }, process.env.JWT_SECRET)
    return ok(res, { token })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const listClinicianBookings = async (req, res) => {
  try {
    const appointments = await Booking.find({ docId: req.body.docId })
    return ok(res, { appointments })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const cancelClinicianBooking = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body
    const visit = await Booking.findById(appointmentId)
    if (visit && visit.docId === docId) {
      await Booking.findByIdAndUpdate(appointmentId, { cancelled: true })
      return ok(res, { message: "Appointment Cancelled" })
    }
    return fail(res, "Appointment Cancelled")
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const completeClinicianBooking = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body
    const visit = await Booking.findById(appointmentId)
    if (visit && visit.docId === docId) {
      await Booking.findByIdAndUpdate(appointmentId, { isCompleted: true })
      return ok(res, { message: "Appointment Completed" })
    }
    return fail(res, "Appointment Cancelled")
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const listPublicClinicians = async (req, res) => {
  try {
    const doctors = await Clinician.find({}).select(["-password", "-email"])
    return ok(res, { doctors })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const toggleClinicianAvailability = async (req, res) => {
  try {
    const { docId } = req.body
    const current = await Clinician.findById(docId)
    await Clinician.findByIdAndUpdate(docId, { available: !current.available })
    return ok(res, { message: "Availablity Changed" })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const readClinicianProfile = async (req, res) => {
  try {
    const profileData = await Clinician.findById(req.body.docId).select("-password")
    return ok(res, { profileData })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const writeClinicianProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body
    await Clinician.findByIdAndUpdate(docId, { fees, address, available })
    return ok(res, { message: "Profile Updated" })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}

export const clinicianOverview = async (req, res) => {
  try {
    const appointments = await Booking.find({ docId: req.body.docId })
    const earnings = appointments.reduce((sum, item) => {
      return item.isCompleted || item.payment ? sum + item.amount : sum
    }, 0)

    const uniquePatients = [...new Set(appointments.map((item) => item.userId))]

    return ok(res, {
      dashData: {
        earnings,
        appointments: appointments.length,
        patients: uniquePatients.length,
        latestAppointments: [...appointments].reverse(),
      },
    })
  } catch (err) {
    console.log(err)
    return fail(res, err.message)
  }
}
