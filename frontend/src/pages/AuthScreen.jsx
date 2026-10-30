import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { ClinicStore } from '../store/ClinicStore'
import Wordmark from '../components/Wordmark'

export default function AuthScreen() {
  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(ClinicStore)

  const [mode, setMode] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const persistSession = (nextToken) => {
    localStorage.setItem('token', nextToken)
    setToken(nextToken)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    try {
      const isSignup = mode === 'Sign Up'
      const url = isSignup ? `${backendUrl}/api/patients/signup` : `${backendUrl}/api/patients/signin`
      const payload = isSignup ? { name, email, password } : { email, password }
      const { data } = await axios.post(url, payload)
      if (data.success) persistSession(data.token)
      else toast.error(data.message)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (token) navigate('/')
  }, [token, navigate])

  const signingUp = mode === 'Sign Up'

  return (
    <div className="grid min-h-[70vh] items-center gap-8 py-10 lg:grid-cols-2">
      <div className="hidden overflow-hidden border-2 border-ink bg-moss p-10 text-paper lg:block">
        <Wordmark light />
        <h1 className="mt-10 text-4xl font-semibold leading-tight">Your next visit starts with an account.</h1>
        <p className="mt-4 max-w-sm text-sm leading-6 text-white/85">
          Sign in to book a doctor, pay for a visit, and keep your appointment history together.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md border-2 border-ink bg-paper p-8 shadow-card">
        <p className="text-2xl font-semibold text-ink">{signingUp ? 'Create account' : 'Welcome back'}</p>
        <p className="mt-1 text-sm text-ink/60">
          {signingUp ? 'Sign up to book an appointment.' : 'Log in to continue to your appointments.'}
        </p>

        {signingUp && (
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
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="field mt-1.5"
            type="password"
            required
            minLength={signingUp ? 8 : undefined}
          />
        </label>
        {signingUp && <p className="mt-2 text-xs text-ink/50">Use at least 8 characters.</p>}

        <button disabled={busy} className="btn-primary mt-6 w-full">
          {busy ? 'Please wait…' : signingUp ? 'Create account' : 'Log in'}
        </button>

        {signingUp ? (
          <p className="mt-4 text-sm text-ink/70">
            Already have an account?{' '}
            <button type="button" onClick={() => setMode('Login')} className="font-medium text-primary">
              Log in
            </button>
          </p>
        ) : (
          <p className="mt-4 text-sm text-ink/70">
            New to HealthLink?{' '}
            <button type="button" onClick={() => setMode('Sign Up')} className="font-medium text-primary">
              Create an account
            </button>
          </p>
        )}
      </form>
    </div>
  )
}
