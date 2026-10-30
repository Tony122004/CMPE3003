import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ClinicianStore } from "../store/ClinicianStore"
import { StaffStore } from "../store/StaffStore"

export default function PanelHeader() {
  const navigate = useNavigate()
  const { dToken, setDToken } = useContext(ClinicianStore)
  const { aToken, setAToken } = useContext(StaffStore)

  const roleLabel = aToken ? "Admin" : "Doctor"

  const endSession = () => {
    navigate("/")
    if (dToken) {
      setDToken("")
      localStorage.removeItem("dToken")
    }
    if (aToken) {
      setAToken("")
      localStorage.removeItem("aToken")
    }
  }

  return (
    <div className="flex justify-between items-center bg-ink px-4 py-3 text-paper sm:px-8">
      <div className="flex items-center gap-3 text-xs">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="cursor-pointer font-display text-2xl text-paper"
        >
          Health<span className="text-primary">Link</span>
        </button>
        <p className="border border-paper/40 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper">
          {roleLabel}
        </p>
      </div>
      <button
        onClick={endSession}
        className="bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-paper"
      >
        Log out
      </button>
    </div>
  )
}
