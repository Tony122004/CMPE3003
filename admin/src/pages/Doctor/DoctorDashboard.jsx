import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {

  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)


  useEffect(() => {

    if (dToken) {
      getDashData()
    }

  }, [dToken])

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-3 border-2 border-ink bg-paper p-4 min-w-52'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='font-display text-3xl text-ink'>{currency} {dashData.earnings}</p>
            <p className='text-xs font-semibold uppercase tracking-[0.12em] text-ink/50'>Earnings</p>
          </div>
        </div>
        <div className='flex items-center gap-3 border-2 border-ink bg-paper p-4 min-w-52'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='font-display text-3xl text-ink'>{dashData.appointments}</p>
            <p className='text-xs font-semibold uppercase tracking-[0.12em] text-ink/50'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-3 border-2 border-ink bg-paper p-4 min-w-52'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='font-display text-3xl text-ink'>{dashData.patients}</p>
            <p className='text-xs font-semibold uppercase tracking-[0.12em] text-ink/50'>Patients</p></div>
        </div>
      </div>

      <div className='mt-10 border-2 border-ink bg-paper'>
        <div className='flex items-center gap-2.5 border-b-2 border-ink bg-moss px-4 py-4 text-paper'>
          <img className='invert' src={assets.list_icon} alt="" />
          <p className='font-display text-xl'>Latest bookings</p>
        </div>

        <div>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center gap-3 border-b border-ink/10 px-6 py-3 last:border-b-0 hover:bg-[#F6E7D4]' key={index}>
              <img className='h-10 w-10 object-cover' src={item.userData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='font-medium text-ink'>{item.userData.name}</p>
                <p className='text-ink/60'>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled
                ? <p className='text-xs font-semibold uppercase tracking-[0.08em] text-primary'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-xs font-semibold uppercase tracking-[0.08em] text-moss'>Completed</p>
                  : <div className='flex'>
                    <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
              }
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default DoctorDashboard