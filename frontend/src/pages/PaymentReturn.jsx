import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ClinicStore } from '../store/ClinicStore'

export default function PaymentReturn() {
  const [params] = useSearchParams()
  const success = params.get('success')
  const appointmentId = params.get('appointmentId')
  const { backendUrl, token } = useContext(ClinicStore)
  const navigate = useNavigate()
  const [statusText, setStatusText] = useState('Confirming your payment…')

  useEffect(() => {
    if (!token || !appointmentId || !success) return

    const confirmPayment = async () => {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/patients/payments/confirm`,
          { success, appointmentId },
          { headers: { token } },
        )
        if (data.success) toast.success(data.message)
        else toast.error(data.message)
        setStatusText(data.message)
        navigate('/my-appointments')
      } catch (err) {
        toast.error(err.message)
        setStatusText('We could not confirm the payment.')
        console.log(err)
      }
    }

    confirmPayment()
  }, [token, appointmentId, success, backendUrl, navigate])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
      <p className="text-sm text-ink/60">{statusText}</p>
    </div>
  )
}
