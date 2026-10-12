import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Brand from '../components/Brand'

const Login = () => {
  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <div className="grid min-h-[70vh] items-center gap-8 py-10 lg:grid-cols-2">
      <div className="hidden overflow-hidden border-2 border-ink bg-moss p-10 text-paper lg:block">
        <Brand light />
        <h1 className="mt-10 text-4xl font-semibold leading-tight">Your next visit starts with an account.</h1>
        <p className="mt-4 max-w-sm text-sm leading-6 text-white/85">
          Sign in to book a doctor, pay for a visit, and keep your appointment history together.
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className="mx-auto w-full max-w-md border-2 border-ink bg-paper p-8 shadow-card">
        <p className="text-2xl font-semibold text-ink">{state === 'Sign Up' ? 'Create account' : 'Welcome back'}</p>
        <p className="mt-1 text-sm text-ink/60">
          {state === 'Sign Up' ? 'Sign up to book an appointment.' : 'Log in to continue to your appointments.'}
        </p>

        {state === 'Sign Up' && (
          <label className="mt-6 block text-sm font-medium text-ink">
            Full name
            <input onChange={(e) => setName(e.target.value)} value={name} className="field mt-1.5" type="text" required />
          </label>
        )}

        <label className="mt-4 block text-sm font-medium text-ink">
          Email
          <input onChange={(e) => setEmail(e.target.value)} value={email} className="field mt-1.5" type="email" required />
        </label>

        <label className="mt-4 block text-sm font-medium text-ink">
          Password
          <input onChange={(e) => setPassword(e.target.value)} value={password} className="field mt-1.5" type="password" required minLength={state === 'Sign Up' ? 8 : undefined} />
        </label>
        {state === 'Sign Up' && <p className="mt-2 text-xs text-ink/50">Use at least 8 characters.</p>}

        <button disabled={submitting} className="btn-primary mt-6 w-full">
          {submitting ? 'Please wait…' : state === 'Sign Up' ? 'Create account' : 'Log in'}
        </button>

        {state === 'Sign Up' ? (
          <p className="mt-4 text-sm text-ink/70">
            Already have an account?{' '}
            <button type="button" onClick={() => setState('Login')} className="font-medium text-primary">Log in</button>
          </p>
        ) : (
          <p className="mt-4 text-sm text-ink/70">
            New to HealthLink?{' '}
            <button type="button" onClick={() => setState('Sign Up')} className="font-medium text-primary">Create an account</button>
          </p>
        )}
      </form>
    </div>
  )
}

export default Login
