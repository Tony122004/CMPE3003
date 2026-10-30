import { Router } from "express"
import clinicianGate from "../security/clinicianGate.js"
import {
  signinClinician,
  listClinicianBookings,
  cancelClinicianBooking,
  completeClinicianBooking,
  listPublicClinicians,
  toggleClinicianAvailability,
  clinicianOverview,
  readClinicianProfile,
  writeClinicianProfile,
} from "../services/clinicianService.js"

const clinicianRoutes = Router()

clinicianRoutes.post("/signin", signinClinician)
clinicianRoutes.get("/directory", listPublicClinicians)
clinicianRoutes.get("/bookings", clinicianGate, listClinicianBookings)
clinicianRoutes.post("/bookings/cancel", clinicianGate, cancelClinicianBooking)
clinicianRoutes.post("/bookings/complete", clinicianGate, completeClinicianBooking)
clinicianRoutes.post("/availability", clinicianGate, toggleClinicianAvailability)
clinicianRoutes.get("/overview", clinicianGate, clinicianOverview)
clinicianRoutes.get("/me", clinicianGate, readClinicianProfile)
clinicianRoutes.put("/me", clinicianGate, writeClinicianProfile)

export default clinicianRoutes
