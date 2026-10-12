import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Admin') {

      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
      } else {
        toast.error(data.message)
      }

    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='flex min-h-screen items-center bg-canvas px-4'>
      <div className='m-auto flex w-full max-w-md flex-col gap-4 border-2 border-ink bg-paper p-8 text-sm text-ink shadow-[6px_6px_0_0_rgba(28,43,36,0.12)]'>
        <p className='text-center font-display text-3xl'><span className='text-primary'>{state}</span> login</p>
        <div className='w-full'>
          <p className='text-xs font-semibold uppercase tracking-[0.12em]'>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='mt-1 w-full border-2 border-ink/20 bg-paper p-2 outline-none focus:border-primary' type="email" required />
        </div>
        <div className='w-full'>
          <p className='text-xs font-semibold uppercase tracking-[0.12em]'>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='mt-1 w-full border-2 border-ink/20 bg-paper p-2 outline-none focus:border-primary' type="password" required />
        </div>
        <button className='w-full bg-primary py-3 text-sm font-semibold uppercase tracking-[0.12em] text-paper'>Log in</button>
        {
          state === 'Admin'
            ? <p>Doctor login? <button type="button" onClick={() => setState('Doctor')} className='font-semibold text-primary'>Switch</button></p>
            : <p>Admin login? <button type="button" onClick={() => setState('Admin')} className='font-semibold text-primary'>Switch</button></p>
        }
      </div>
    </form>
  )
}

export default Login