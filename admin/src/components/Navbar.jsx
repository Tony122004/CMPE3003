import React, { useContext } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)
  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
    <div className='flex justify-between items-center bg-ink px-4 py-3 text-paper sm:px-8'>
      <div className='flex items-center gap-3 text-xs'>
        <button type="button" onClick={() => navigate('/')} className='cursor-pointer font-display text-2xl text-paper'>Health<span className='text-primary'>Link</span></button>
        <p className='border border-paper/40 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper'>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <button onClick={() => logout()} className='bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-paper'>Log out</button>
    </div>
  )
}

export default Navbar
