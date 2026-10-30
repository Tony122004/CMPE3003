import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import { ClinicStore } from '../store/ClinicStore'
import SimilarClinicians from '../components/SimilarClinicians'

const WEEK_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function buildSlotGrid(clinician) {
  const grid = []
  const anchor = new Date()

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const dayStart = new Date(anchor)
    dayStart.setDate(anchor.getDate() + dayOffset)

    const dayEnd = new Date(anchor)
    dayEnd.setDate(anchor.getDate() + dayOffset)
    dayEnd.setHours(21, 0, 0, 0)

    const cursor = new Date(dayStart)
    if (anchor.getDate() === dayStart.getDate()) {
      cursor.setHours(cursor.getHours() > 10 ? cursor.getHours() + 1 : 10)
      cursor.setMinutes(cursor.getMinutes() > 30 ? 30 : 0)
    } else {
      cursor.setHours(10, 0, 0, 0)
    }

    const slotsForDay = []
    while (cursor < dayEnd) {
      const timeLabel = cursor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const slotDate = `${cursor.getDate()}_${cursor.getMonth() + 1}_${cursor.getFullYear()}`
      const taken = clinician.slots_booked?.[slotDate]?.includes(timeLabel)
      if (!taken) {
        slotsForDay.push({ datetime: new Date(cursor), time: timeLabel })
      }
      cursor.setMinutes(cursor.getMinutes() + 30)
    }
    grid.push(slotsForDay)
  }
  return grid
}

export default function BookVisit() {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { doctors, currencySymbol, backendUrl, token, refreshClinicianDirectory } = useContext(ClinicStore)

  const [profile, setProfile] = useState(false)
  const [daySlots, setDaySlots] = useState([])
  const [activeDay, setActiveDay] = useState(0)
  const [pickedTime, setPickedTime] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!doctors.length) return
    setProfile(doctors.find((d) => d._id === docId) || null)
  }, [doctors, docId])

  useEffect(() => {
    if (!profile) return
    setDaySlots(buildSlotGrid(profile))
    setActiveDay(0)
    setPickedTime('')
  }, [profile])

  if (profile === false) {
    return <p className="py-24 text-center text-sm text-slate-500">Loading doctor…</p>
  }

  if (!profile) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-semibold text-ink">We could not find that doctor.</p>
        <button type="button" onClick={() => navigate('/doctors')} className="btn-primary mt-6">
          Back to doctors
        </button>
      </div>
    )
  }

  const timesToday = daySlots[activeDay] || []

  const confirmBooking = async () => {
    if (!token) {
      toast.warning('Login to book appointment')
      navigate('/login')
      return
    }
    if (!pickedTime || !timesToday.length) {
      toast.warning('Please select a time slot')
      return
    }

    const slotAnchor = timesToday[0].datetime
    const slotDate = `${slotAnchor.getDate()}_${slotAnchor.getMonth() + 1}_${slotAnchor.getFullYear()}`

    try {
      setSubmitting(true)
      const { data } = await axios.post(
        `${backendUrl}/api/patients/bookings`,
        { docId, slotDate, slotTime: pickedTime },
        { headers: { token } },
      )
      if (data.success) {
        toast.success(data.message)
        refreshClinicianDirectory()
        navigate('/my-appointments')
      } else toast.error(data.message)
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const addr = profile.address

  return (
    <div className="pt-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="overflow-hidden border-2 border-ink bg-[#E7D3B5]">
          <img className="h-full w-full object-cover object-top" src={profile.image} alt={profile.name} />
        </div>

        <div className="border-2 border-ink bg-paper p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-3xl font-semibold text-ink">
                {profile.name}
                <img className="w-5" src={assets.verified_icon} alt="Verified" />
              </p>
              <p className="mt-1 text-sm text-ink/60">
                {profile.degree} · {profile.speciality}
              </p>
            </div>
            <span className="bg-canvas px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink">
              {profile.experience}
            </span>
          </div>

          <div className="mt-6">
            <p className="flex items-center gap-1 text-sm font-semibold text-ink">
              About <img className="w-3" src={assets.info_icon} alt="" />
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">{profile.about}</p>
          </div>

          <p className="mt-6 text-sm text-ink/70">
            Appointment fee{' '}
            <span className="ml-1 text-lg font-semibold text-ink">
              {currencySymbol}
              {profile.fees}
            </span>
          </p>
          {addr && (
            <p className="mt-2 text-sm text-ink/60">
              {addr.line1}
              {addr.line2 ? `, ${addr.line2}` : ''}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 border-2 border-ink bg-paper p-6">
        <h2 className="text-lg font-semibold text-ink">Choose a time</h2>
        <p className="mt-1 text-sm text-ink/60">Slots run from 10:00 to 21:00, every 30 minutes.</p>

        <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
          {daySlots.map((bucket, index) => (
            <button
              type="button"
              onClick={() => {
                setActiveDay(index)
                setPickedTime('')
              }}
              key={index}
              className={`min-w-16 border-2 px-3 py-4 text-center text-sm font-semibold ${activeDay === index ? 'border-ink bg-primary text-paper' : 'border-ink/20 bg-canvas text-ink'}`}
            >
              <p>{bucket[0] ? WEEK_LABELS[bucket[0].datetime.getDay()] : '—'}</p>
              <p className="text-lg">{bucket[0] ? bucket[0].datetime.getDate() : ''}</p>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {timesToday.length === 0 && <p className="text-sm text-ink/50">No open slots on this day.</p>}
          {timesToday.map((slot, index) => (
            <button
              type="button"
              onClick={() => setPickedTime(slot.time)}
              key={index}
              className={`border-2 px-4 py-2 text-sm ${slot.time === pickedTime ? 'border-ink bg-ink text-paper' : 'border-ink/20 bg-paper text-ink'}`}
            >
              {slot.time.toLowerCase()}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={confirmBooking}
          disabled={submitting || !profile.available}
          className="btn-primary mt-6"
        >
          {submitting ? 'Booking…' : profile.available ? 'Book appointment' : 'Doctor is not available'}
        </button>
      </div>

      <SimilarClinicians speciality={profile.speciality} docId={docId} />
    </div>
  )
}
