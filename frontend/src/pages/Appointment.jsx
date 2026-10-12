import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(false)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [booking, setBooking] = useState(false)

  const navigate = useNavigate()

  const fetchDocInfo = async () => {
    const info = doctors.find((doc) => doc._id === docId)
    setDocInfo(info || null)
  }

  const getAvailableSolts = async () => {
    setDocSlots([])

    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const isSlotAvailable = docInfo.slots_booked?.[slotDate]?.includes(formattedTime) ? false : true

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Login to book appointment')
      return navigate('/login')
    }

    if (!slotTime || !docSlots[slotIndex]?.length) {
      toast.warning('Please select a time slot')
      return
    }

    const date = docSlots[slotIndex][0].datetime
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    const slotDate = day + "_" + month + "_" + year

    try {
      setBooking(true)
      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getDoctosData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setBooking(false)
    }
  }

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo()
    }
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) {
      getAvailableSolts()
    }
  }, [docInfo])

  if (docInfo === false) {
    return <p className="py-24 text-center text-sm text-slate-500">Loading doctor…</p>
  }

  if (!docInfo) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-semibold text-ink">We could not find that doctor.</p>
        <button type="button" onClick={() => navigate('/doctors')} className="btn-primary mt-6">Back to doctors</button>
      </div>
    )
  }

  const selectedDay = docSlots[slotIndex] || []

  return (
    <div className="pt-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="overflow-hidden border-2 border-ink bg-[#E7D3B5]">
          <img className="h-full w-full object-cover object-top" src={docInfo.image} alt={docInfo.name} />
        </div>

        <div className="border-2 border-ink bg-paper p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-3xl font-semibold text-ink">
                {docInfo.name}
                <img className="w-5" src={assets.verified_icon} alt="Verified" />
              </p>
              <p className="mt-1 text-sm text-ink/60">{docInfo.degree} · {docInfo.speciality}</p>
            </div>
            <span className="bg-canvas px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink">{docInfo.experience}</span>
          </div>

          <div className="mt-6">
            <p className="flex items-center gap-1 text-sm font-semibold text-ink">
              About <img className="w-3" src={assets.info_icon} alt="" />
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">{docInfo.about}</p>
          </div>

          <p className="mt-6 text-sm text-ink/70">
            Appointment fee <span className="ml-1 text-lg font-semibold text-ink">{currencySymbol}{docInfo.fees}</span>
          </p>
          {docInfo.address && (
            <p className="mt-2 text-sm text-ink/60">{docInfo.address.line1}{docInfo.address.line2 ? `, ${docInfo.address.line2}` : ''}</p>
          )}
        </div>
      </div>

      <div className="mt-8 border-2 border-ink bg-paper p-6">
        <h2 className="text-lg font-semibold text-ink">Choose a time</h2>
        <p className="mt-1 text-sm text-ink/60">Slots run from 10:00 to 21:00, every 30 minutes.</p>

        <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
          {docSlots.map((item, index) => (
            <button
              type="button"
              onClick={() => { setSlotIndex(index); setSlotTime('') }}
              key={index}
              className={`min-w-16 border-2 px-3 py-4 text-center text-sm font-semibold ${slotIndex === index ? 'border-ink bg-primary text-paper' : 'border-ink/20 bg-canvas text-ink'}`}
            >
              <p>{item[0] ? daysOfWeek[item[0].datetime.getDay()] : '—'}</p>
              <p className="text-lg">{item[0] ? item[0].datetime.getDate() : ''}</p>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {selectedDay.length === 0 && <p className="text-sm text-ink/50">No open slots on this day.</p>}
          {selectedDay.map((item, index) => (
            <button
              type="button"
              onClick={() => setSlotTime(item.time)}
              key={index}
              className={`border-2 px-4 py-2 text-sm ${item.time === slotTime ? 'border-ink bg-ink text-paper' : 'border-ink/20 bg-paper text-ink'}`}
            >
              {item.time.toLowerCase()}
            </button>
          ))}
        </div>

        <button type="button" onClick={bookAppointment} disabled={booking || !docInfo.available} className="btn-primary mt-6">
          {booking ? 'Booking…' : docInfo.available ? 'Book appointment' : 'Doctor is not available'}
        </button>
      </div>

      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  )
}

export default Appointment
