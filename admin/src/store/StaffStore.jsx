import axios from "axios"
import { createContext, useCallback, useState } from "react"
import { toast } from "react-toastify"

export const StaffStore = createContext()

const staffHeaders = (token) => ({ headers: { aToken: token } })

export function StaffStoreProvider({ children }) {
  const apiRoot = import.meta.env.VITE_BACKEND_URL

  const [aToken, setAToken] = useState(() => localStorage.getItem("aToken") || "")
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [dashData, setDashData] = useState(false)

  const fetchClinicianRoster = useCallback(async () => {
    try {
      const { data } = await axios.get(`${apiRoot}/api/staff/clinicians`, staffHeaders(aToken))
      if (data.success) {
        setDoctors(data.doctors)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }, [apiRoot, aToken])

  const toggleClinicianAvailability = useCallback(
    async (docId) => {
      try {
        const { data } = await axios.post(
          `${apiRoot}/api/staff/availability`,
          { docId },
          staffHeaders(aToken),
        )
        if (data.success) {
          toast.success(data.message)
          fetchClinicianRoster()
        } else {
          toast.error(data.message)
        }
      } catch (err) {
        console.log(err)
        toast.error(err.message)
      }
    },
    [apiRoot, aToken, fetchClinicianRoster],
  )

  const loadBookings = useCallback(async () => {
    try {
      const { data } = await axios.get(`${apiRoot}/api/staff/bookings`, staffHeaders(aToken))
      if (data.success) {
        setAppointments([...data.appointments].reverse())
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
      console.log(err)
    }
  }, [apiRoot, aToken])

  const revokeBooking = useCallback(
    async (appointmentId) => {
      try {
        const { data } = await axios.post(
          `${apiRoot}/api/staff/bookings/cancel`,
          { appointmentId },
          staffHeaders(aToken),
        )
        if (data.success) {
          toast.success(data.message)
          loadBookings()
        } else {
          toast.error(data.message)
        }
      } catch (err) {
        toast.error(err.message)
        console.log(err)
      }
    },
    [apiRoot, aToken, loadBookings],
  )

  const fetchOverview = useCallback(async () => {
    try {
      const { data } = await axios.get(`${apiRoot}/api/staff/overview`, staffHeaders(aToken))
      if (data.success) {
        setDashData(data.dashData)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }, [apiRoot, aToken])

  const storeValue = {
    aToken,
    setAToken,
    doctors,
    appointments,
    dashData,
    getAllDoctors: fetchClinicianRoster,
    changeAvailability: toggleClinicianAvailability,
    getAllAppointments: loadBookings,
    cancelAppointment: revokeBooking,
    getDashData: fetchOverview,
  }

  return <StaffStore.Provider value={storeValue}>{children}</StaffStore.Provider>
}
