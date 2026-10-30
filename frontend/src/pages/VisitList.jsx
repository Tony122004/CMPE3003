import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { ClinicStore } from '../store/ClinicStore'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatSlotDate(raw) {
  const [day, month, year] = raw.split('_')
  return `${day} ${MONTH_NAMES[Number(month) - 1]} ${year}`
}

export default function VisitList() {
  const { backendUrl, token, currencySymbol } = useContext(ClinicStore)
  const [appointments, setAppointments] = useState([])
  const [checkoutFor, setCheckoutFor] = useState('')
  const [loading, setLoading] = useState(true)

  const reloadVisits = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/patients/bookings`, { headers: { token } })
      setAppointments(data.appointments.reverse())
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelVisit = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/patients/bookings/cancel`,
        { appointmentId },
        { headers: { token } },
      )
      if (data.success) {
        toast.success(data.message)
        reloadVisits()
      } else toast.error(data.message)
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }

  const startStripeCheckout = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/patients/payments/checkout`,
        { appointmentId },
        { headers: { token } },
      )
      if (data.success) window.location.replace(data.session_url)
      else toast.error(data.message)
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }

  useEffect(() => {
    if (token) reloadVisits()
    else setLoading(false)
  }, [token])

  if (!token) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-semibold text-ink">Log in to see your appointments.</p>
        <Link to="/login" className="btn-primary mt-6">
          Go to login
        </Link>
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
          <Link to="/doctors" className="btn-primary mt-6">
            Browse doctors
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {appointments.map((visit) => (
          <article
            key={visit._id}
            className="grid gap-4 border-2 border-ink bg-paper p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center sm:p-5"
          >
            <img className="h-28 w-full bg-[#E7D3B5] object-cover object-top sm:h-32 sm:w-28" src={visit.docData.image} alt="" />
            <div className="text-sm text-ink/70">
              <p className="text-lg font-semibold text-ink">{visit.docData.name}</p>
              <p>{visit.docData.speciality}</p>
              <p className="mt-2 text-ink/60">
                {visit.docData.address?.line1}
                {visit.docData.address?.line2 ? `, ${visit.docData.address.line2}` : ''}
              </p>
              <p className="mt-1 font-medium text-ink">
                {formatSlotDate(visit.slotDate)} · {visit.slotTime}
              </p>
              {visit.amount ? (
                <p className="mt-1 text-ink/60">
                  Fee {currencySymbol}
                  {visit.amount}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 sm:min-w-48">
              {!visit.cancelled && !visit.payment && !visit.isCompleted && checkoutFor !== visit._id && (
                <button type="button" onClick={() => setCheckoutFor(visit._id)} className="btn-primary">
                  Pay online
                </button>
              )}
              {!visit.cancelled && !visit.payment && !visit.isCompleted && checkoutFor === visit._id && (
                <>
                  <button type="button" onClick={() => startStripeCheckout(visit._id)} className="btn-outline">
                    <img className="max-h-5 max-w-20" src={assets.stripe_logo} alt="Stripe" />
                  </button>
                  <button type="button" onClick={() => setCheckoutFor('')} className="text-xs text-slate-400">
                    Not now
                  </button>
                </>
              )}
              {!visit.cancelled && visit.payment && !visit.isCompleted && (
                <span className="bg-moss/10 px-4 py-2 text-center text-sm font-semibold uppercase tracking-[0.08em] text-moss">
                  Paid
                </span>
              )}
              {visit.isCompleted && (
                <span className="bg-moss/10 px-4 py-2 text-center text-sm font-semibold uppercase tracking-[0.08em] text-moss">
                  Completed
                </span>
              )}
              {!visit.cancelled && !visit.isCompleted && (
                <button
                  type="button"
                  onClick={() => cancelVisit(visit._id)}
                  className="border-2 border-primary px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-primary transition hover:bg-primary hover:text-paper"
                >
                  Cancel appointment
                </button>
              )}
              {visit.cancelled && !visit.isCompleted && (
                <span className="bg-primary/10 px-4 py-2 text-center text-sm font-semibold uppercase tracking-[0.08em] text-primary">
                  Cancelled
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
