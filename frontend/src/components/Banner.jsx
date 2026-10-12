import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <section className="mt-16 border-2 border-ink bg-primary px-6 py-12 text-paper sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.22em]">Start an account</p>
      <h2 className="mt-3 max-w-xl text-4xl leading-tight">Bookings live with you, not in a paper diary.</h2>
      <p className="mt-4 max-w-lg text-sm leading-6 text-paper/85">
        Create an account to hold upcoming visits and pay with Stripe when the appointment is confirmed.
      </p>
      <button type="button" onClick={() => navigate('/login')} className="mt-8 rounded-sm bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-paper">
        Create account
      </button>
    </section>
  )
}

export default Banner
