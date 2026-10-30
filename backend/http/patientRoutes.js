import { Router } from "express"
import upload from "../security/upload.js"
import patientGate from "../security/patientGate.js"
import {
  signupPatient,
  signinPatient,
  readPatientProfile,
  writePatientProfile,
  createBooking,
  listPatientBookings,
  cancelPatientBooking,
  openStripeCheckout,
  confirmStripePayment,
} from "../services/patientService.js"

const patientRoutes = Router()

patientRoutes.post("/signup", signupPatient)
patientRoutes.post("/signin", signinPatient)
patientRoutes.get("/me", patientGate, readPatientProfile)
patientRoutes.put("/me", upload.single("image"), patientGate, writePatientProfile)
patientRoutes.post("/bookings", patientGate, createBooking)
patientRoutes.get("/bookings", patientGate, listPatientBookings)
patientRoutes.post("/bookings/cancel", patientGate, cancelPatientBooking)
patientRoutes.post("/payments/checkout", patientGate, openStripeCheckout)
patientRoutes.post("/payments/confirm", patientGate, confirmStripePayment)

export default patientRoutes
