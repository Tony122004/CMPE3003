import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Verify = () => {
  const [searchParams] = useSearchParams()
  const success = searchParams.get("success")
  const appointmentId = searchParams.get("appointmentId")
  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()
  const [message, setMessage] = useState('Confirming your payment…')

  const verifyStripe = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/user/verifyStripe", { success, appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        setMessage(data.message)
      } else {
        toast.error(data.message)
        setMessage(data.message)
      }
      navigate("/my-appointments")
    } catch (error) {
      toast.error(error.message)
      setMessage('We could not confirm the payment.')
      console.log(error)
    }
  }

  useEffect(() => {
    if (token && appointmentId && success) {
      verifyStripe()
    }
  }, [token])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
      <p className="text-sm text-ink/60">{message}</p>
    </div>
  )
}

export default Verify
