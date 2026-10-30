import { useContext } from "react"
import { Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import PanelHeader from "./components/PanelHeader"
import NavRail from "./components/NavRail"
import Gate from "./pages/Gate"
import StaffOverview from "./pages/staff/Overview"
import BookingBoard from "./pages/staff/BookingBoard"
import ClinicianForm from "./pages/staff/ClinicianForm"
import ClinicianRoster from "./pages/staff/ClinicianRoster"
import ClinicianOverview from "./pages/clinician/Overview"
import Schedule from "./pages/clinician/Schedule"
import ProfileEditor from "./pages/clinician/ProfileEditor"
import { ClinicianStore } from "./store/ClinicianStore"
import { StaffStore } from "./store/StaffStore"

function AuthenticatedShell() {
  return (
    <div className="min-h-screen bg-canvas">
      <ToastContainer />
      <PanelHeader />
      <div className="flex items-start">
        <NavRail />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<StaffOverview />} />
          <Route path="/all-appointments" element={<BookingBoard />} />
          <Route path="/add-doctor" element={<ClinicianForm />} />
          <Route path="/doctor-list" element={<ClinicianRoster />} />
          <Route path="/doctor-dashboard" element={<ClinicianOverview />} />
          <Route path="/doctor-appointments" element={<Schedule />} />
          <Route path="/doctor-profile" element={<ProfileEditor />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  const { dToken } = useContext(ClinicianStore)
  const { aToken } = useContext(StaffStore)

  if (dToken || aToken) {
    return <AuthenticatedShell />
  }

  return (
    <>
      <ToastContainer />
      <Gate />
    </>
  )
}
