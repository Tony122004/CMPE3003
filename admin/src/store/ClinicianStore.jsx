import axios from "axios"
import { createContext, useCallback, useState } from "react"
import { toast } from "react-toastify"

export const ClinicianStore = createContext()

const clinicianHeaders = (token) => ({ headers: { dToken: token } })

export function ClinicianStoreProvider({ children }) {
  const apiRoot = import.meta.env.VITE_BACKEND_URL

  const [dToken, setDToken] = useState(() => localStorage.getItem("dToken") || "")
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)
  const [profileData, setProfileData] = useState(false)

  const loadSchedule = useCallback(async () => {
    try {
      const { data } = await axios.get(`${apiRoot}/api/clinicians/bookings`, clinicianHeaders(dToken))
      if (data.success) {
        setAppointments([...data.appointments].reverse())
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }, [apiRoot, dToken])

  const loadSelfProfile = useCallback(async () => {
    try {
      const { data } = await axios.get(`${apiRoot}/api/clinicians/me`, clinicianHeaders(dToken))
      console.log(data.profileData)
      setProfileData(data.profileData)
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }, [apiRoot, dToken])

  const fetchOverview = useCallback(async () => {
    try {
      const { data } = await axios.get(`${apiRoot}/api/clinicians/overview`, clinicianHeaders(dToken))
      if (data.success) {
        setDashData(data.dashData)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }, [apiRoot, dToken])

  const revokeBooking = useCallback(
    async (appointmentId) => {
      try {
        const { data } = await axios.post(
          `${apiRoot}/api/clinicians/bookings/cancel`,
          { appointmentId },
          clinicianHeaders(dToken),
        )
        if (data.success) {
          toast.success(data.message)
          loadSchedule()
          fetchOverview()
        } else {
          toast.error(data.message)
        }
      } catch (err) {
        toast.error(err.message)
        console.log(err)
      }
    },
    [apiRoot, dToken, loadSchedule, fetchOverview],
  )

  const finalizeBooking = useCallback(
    async (appointmentId) => {
      try {
        const { data } = await axios.post(
          `${apiRoot}/api/clinicians/bookings/complete`,
          { appointmentId },
          clinicianHeaders(dToken),
        )
        if (data.success) {
          toast.success(data.message)
          loadSchedule()
          fetchOverview()
        } else {
          toast.error(data.message)
        }
      } catch (err) {
        toast.error(err.message)
        console.log(err)
      }
    },
    [apiRoot, dToken, loadSchedule, fetchOverview],
  )

  const storeValue = {
    dToken,
    setDToken,
    backendUrl: apiRoot,
    appointments,
    dashData,
    profileData,
    setProfileData,
    getAppointments: loadSchedule,
    getProfileData: loadSelfProfile,
    cancelAppointment: revokeBooking,
    completeAppointment: finalizeBooking,
    getDashData: fetchOverview,
  }

  return <ClinicianStore.Provider value={storeValue}>{children}</ClinicianStore.Provider>
}
