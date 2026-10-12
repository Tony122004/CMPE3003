import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MyAppointments = () => {
  const { backendUrl, token, currencySymbol } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [payment, setPayment] = useState('')
  const [loading, setLoading] = useState(true)

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      setAppointments(data.appointments.reverse())
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const appointmentStripe = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
      if (data.success) {
        window.location.replace(data.session_url)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    } else {
      setLoading(false)
    }
  }, [token])

  if (!token) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-semibold text-ink">Log in to see your appointments.</p>
        <Link to="/login" className="btn-primary mt-6">Go to login</Link>
      </div>
    )
  }

  return (
    <div className="pt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Visits</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">My appointments</h1>

      {loading && <p className="mt-10 text-sm text-slate-500">Loading appointments…</p>}

      {!loading && appointments.length === 0 && (
        <div className="mt-10 border-2 border-dashed border-ink bg-paper px-6 py-16 text-center">
          <p className="text-lg font-semibold text-ink">No appointments yet</p>
          <p className="mt-2 text-sm text-ink/60">When you book a doctor, the visit will show up here.</p>
          <Link to="/doctors" className="btn-primary mt-6">Browse doctors</Link>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {appointments.map((item) => (
          <article key={item._id} className="grid gap-4 border-2 border-ink bg-paper p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center sm:p-5">
            <img className="h-28 w-full bg-[#E7D3B5] object-cover object-top sm:h-32 sm:w-28" src={item.docData.image} alt="" />
            <div className="text-sm text-ink/70">
              <p className="text-lg font-semibold text-ink">{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className="mt-2 text-ink/60">{item.docData.address?.line1}{item.docData.address?.line2 ? `, ${item.docData.address.line2}` : ''}</p>
              <p className="mt-1 font-medium text-ink">{slotDateFormat(item.slotDate)} · {item.slotTime}</p>
              {item.amount ? <p className="mt-1 text-ink/60">Fee {currencySymbol}{item.amount}</p> : null}
            </div>
            <div className="flex flex-col gap-2 sm:min-w-48">
              {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                <button type="button" onClick={() => setPayment(item._id)} className="btn-primary">Pay online</button>
              )}
              {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                <>
                  <button type="button" onClick={() => appointmentStripe(item._id)} className="btn-outline">
                    <img className="max-h-5 max-w-20" src={assets.stripe_logo} alt="Stripe" />
                  </button>
                  <button type="button" onClick={() => setPayment('')} className="text-xs text-slate-400">Not now</button>
                </>
              )}
              {!item.cancelled && item.payment && !item.isCompleted && <span className="bg-moss/10 px-4 py-2 text-center text-sm font-semibold uppercase tracking-[0.08em] text-moss">Paid</span>}
              {item.isCompleted && <span className="bg-moss/10 px-4 py-2 text-center text-sm font-semibold uppercase tracking-[0.08em] text-moss">Completed</span>}
              {!item.cancelled && !item.isCompleted && (
                <button type="button" onClick={() => cancelAppointment(item._id)} className="border-2 border-primary px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-primary transition hover:bg-primary hover:text-paper">
                  Cancel appointment
                </button>
              )}
              {item.cancelled && !item.isCompleted && <span className="bg-primary/10 px-4 py-2 text-center text-sm font-semibold uppercase tracking-[0.08em] text-primary">Cancelled</span>}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
