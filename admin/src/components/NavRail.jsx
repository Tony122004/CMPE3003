import { useContext } from "react"
import { NavLink } from "react-router-dom"
import { assets } from "../assets/assets"
import { ClinicianStore } from "../store/ClinicianStore"
import { StaffStore } from "../store/StaffStore"

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 border-b border-ink/10 py-4 px-3 md:px-8 md:min-w-64 cursor-pointer ${
    isActive ? "bg-[#F6E7D4] border-l-4 border-l-primary text-ink" : "text-ink/70 hover:bg-canvas"
  }`

function RailItem({ to, icon, label }) {
  return (
    <NavLink to={to} className={linkClass}>
      <img className="min-w-5" src={icon} alt="" />
      <p className="hidden md:block text-sm font-semibold uppercase tracking-[0.12em]">{label}</p>
    </NavLink>
  )
}

export default function NavRail() {
  const { dToken } = useContext(ClinicianStore)
  const { aToken } = useContext(StaffStore)

  const staffLinks = [
    { to: "/admin-dashboard", icon: assets.home_icon, label: "Dashboard" },
    { to: "/all-appointments", icon: assets.appointment_icon, label: "Appointments" },
    { to: "/add-doctor", icon: assets.add_icon, label: "Add Doctor" },
    { to: "/doctor-list", icon: assets.people_icon, label: "Doctors List" },
  ]

  const clinicianLinks = [
    { to: "/doctor-dashboard", icon: assets.home_icon, label: "Dashboard" },
    { to: "/doctor-appointments", icon: assets.appointment_icon, label: "Appointments" },
    { to: "/doctor-profile", icon: assets.people_icon, label: "Profile" },
  ]

  return (
    <div className="min-h-screen border-r-2 border-ink bg-paper">
      {aToken && (
        <ul className="mt-2">
          {staffLinks.map((item) => (
            <RailItem key={item.to} {...item} />
          ))}
        </ul>
      )}
      {dToken && (
        <ul className="mt-2">
          {clinicianLinks.map((item) => (
            <RailItem key={item.to} {...item} />
          ))}
        </ul>
      )}
    </div>
  )
}
