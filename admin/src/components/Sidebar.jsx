import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'

const itemClass = ({ isActive }) =>
  `flex items-center gap-3 border-b border-ink/10 py-4 px-3 md:px-8 md:min-w-64 cursor-pointer ${isActive ? 'bg-[#F6E7D4] border-l-4 border-l-primary text-ink' : 'text-ink/70 hover:bg-canvas'}`

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  return (
    <div className='min-h-screen border-r-2 border-ink bg-paper'>
      {aToken && <ul className='mt-2'>
        <NavLink to={'/admin-dashboard'} className={itemClass}>
          <img className='min-w-5' src={assets.home_icon} alt='' />
          <p className='hidden md:block text-sm font-semibold uppercase tracking-[0.12em]'>Dashboard</p>
        </NavLink>
        <NavLink to={'/all-appointments'} className={itemClass}>
          <img className='min-w-5' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block text-sm font-semibold uppercase tracking-[0.12em]'>Appointments</p>
        </NavLink>
        <NavLink to={'/add-doctor'} className={itemClass}>
          <img className='min-w-5' src={assets.add_icon} alt='' />
          <p className='hidden md:block text-sm font-semibold uppercase tracking-[0.12em]'>Add Doctor</p>
        </NavLink>
        <NavLink to={'/doctor-list'} className={itemClass}>
          <img className='min-w-5' src={assets.people_icon} alt='' />
          <p className='hidden md:block text-sm font-semibold uppercase tracking-[0.12em]'>Doctors List</p>
        </NavLink>
      </ul>}

      {dToken && <ul className='mt-2'>
        <NavLink to={'/doctor-dashboard'} className={itemClass}>
          <img className='min-w-5' src={assets.home_icon} alt='' />
          <p className='hidden md:block text-sm font-semibold uppercase tracking-[0.12em]'>Dashboard</p>
        </NavLink>
        <NavLink to={'/doctor-appointments'} className={itemClass}>
          <img className='min-w-5' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block text-sm font-semibold uppercase tracking-[0.12em]'>Appointments</p>
        </NavLink>
        <NavLink to={'/doctor-profile'} className={itemClass}>
          <img className='min-w-5' src={assets.people_icon} alt='' />
          <p className='hidden md:block text-sm font-semibold uppercase tracking-[0.12em]'>Profile</p>
        </NavLink>
      </ul>}
    </div>
  )
}

export default Sidebar
