import axios from "axios"
import { useContext, useState } from "react"
import { toast } from "react-toastify"
import { ClinicianStore } from "../store/ClinicianStore"
import { StaffStore } from "../store/StaffStore"

const SIGNIN = {
  Admin: "/api/staff/signin",
  Doctor: "/api/clinicians/signin",
}

export default function Gate() {
  const [portal, setPortal] = useState("Admin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const apiRoot = import.meta.env.VITE_BACKEND_URL
  const { setDToken } = useContext(ClinicianStore)
  const { setAToken } = useContext(StaffStore)

  const handleSignIn = async (event) => {
    event.preventDefault()

    const endpoint = `${apiRoot}${SIGNIN[portal]}`
    const { data } = await axios.post(endpoint, { email, password })

    if (!data.success) {
      toast.error(data.message)
      return
    }

    if (portal === "Admin") {
      setAToken(data.token)
      localStorage.setItem("aToken", data.token)
    } else {
      setDToken(data.token)
      localStorage.setItem("dToken", data.token)
    }
  }

  const togglePortal = () => setPortal((p) => (p === "Admin" ? "Doctor" : "Admin"))

  return (
    <form onSubmit={handleSignIn} className="flex min-h-screen items-center bg-canvas px-4">
      <div className="m-auto flex w-full max-w-md flex-col gap-4 border-2 border-ink bg-paper p-8 text-sm text-ink shadow-[6px_6px_0_0_rgba(28,43,36,0.12)]">
        <p className="text-center font-display text-3xl">
          <span className="text-primary">{portal}</span> login
        </p>
        <div className="w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.12em]">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="mt-1 w-full border-2 border-ink/20 bg-paper p-2 outline-none focus:border-primary"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.12em]">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="mt-1 w-full border-2 border-ink/20 bg-paper p-2 outline-none focus:border-primary"
            type="password"
            required
          />
        </div>
        <button className="w-full bg-primary py-3 text-sm font-semibold uppercase tracking-[0.12em] text-paper">
          Log in
        </button>
        {portal === "Admin" ? (
          <p>
            Doctor login?{" "}
            <button type="button" onClick={togglePortal} className="font-semibold text-primary">
              Switch
            </button>
          </p>
        ) : (
          <p>
            Admin login?{" "}
            <button type="button" onClick={togglePortal} className="font-semibold text-primary">
              Switch
            </button>
          </p>
        )}
      </div>
    </form>
  )
}
