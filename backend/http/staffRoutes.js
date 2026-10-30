import { Router } from "express"
import staffGate from "../security/staffGate.js"
import upload from "../security/upload.js"
import { toggleClinicianAvailability } from "../services/clinicianService.js"
import {
  signinStaff,
  createClinician,
  listAllBookings,
  cancelStaffBooking,
  listAllClinicians,
  staffOverview,
} from "../services/staffService.js"

const staffRoutes = Router()

staffRoutes.post("/signin", signinStaff)
staffRoutes.post("/clinicians", staffGate, upload.single("image"), createClinician)
staffRoutes.get("/clinicians", staffGate, listAllClinicians)
staffRoutes.get("/bookings", staffGate, listAllBookings)
staffRoutes.post("/bookings/cancel", staffGate, cancelStaffBooking)
staffRoutes.post("/availability", staffGate, toggleClinicianAvailability)
staffRoutes.get("/overview", staffGate, staffOverview)

export default staffRoutes
