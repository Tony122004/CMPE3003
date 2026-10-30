import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const ClinicStore = createContext(null)

export function ClinicStoreProvider({ children }) {
  const currencySymbol = '$'
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [doctors, setDoctors] = useState([])
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [userData, setUserData] = useState(false)

  const refreshClinicianDirectory = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/clinicians/directory`)
      if (!data.success) {
        toast.error(data.message)
        return
      }
      setDoctors(data.doctors)
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }, [backendUrl])

  const fetchPatientAccount = useCallback(async () => {
    if (!token) return
    try {
      const { data } = await axios.get(`${backendUrl}/api/patients/me`, { headers: { token } })
      if (!data.success) {
        toast.error(data.message)
        return
      }
      setUserData(data.userData)
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }, [backendUrl, token])

  useEffect(() => {
    refreshClinicianDirectory()
  }, [refreshClinicianDirectory])

  useEffect(() => {
    if (token) fetchPatientAccount()
  }, [token, fetchPatientAccount])

  const storeValue = useMemo(
    () => ({
      doctors,
      refreshClinicianDirectory,
      currencySymbol,
      backendUrl,
      token,
      setToken,
      userData,
      setUserData,
      fetchPatientAccount,
    }),
    [doctors, refreshClinicianDirectory, currencySymbol, backendUrl, token, userData, fetchPatientAccount],
  )

  return <ClinicStore.Provider value={storeValue}>{children}</ClinicStore.Provider>
}
