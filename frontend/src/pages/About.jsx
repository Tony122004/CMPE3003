import { assets } from '../assets/assets'

const reasons = [
  { title: 'Efficiency', text: 'Appointment scheduling that fits a busy day, from browsing doctors to confirming a time.' },
  { title: 'Convenience', text: 'A single place to see specialists, upcoming visits, and payments.' },
  { title: 'Personal care', text: 'Doctor profiles with experience, fees, and availability so you can choose with confidence.' },
]

const About = () => {
  return (
    <div className="pt-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">About us</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Healthcare booking, without the waiting room paperwork</h1>
      </div>

      <div className="mt-10 grid items-center gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <img className="w-full border-2 border-ink object-cover" src={assets.about_image} alt="HealthLink clinic" />
        <div className="space-y-4 text-sm leading-7 text-ink/75">
          <p>HealthLink is a place to find a doctor and book a visit without calling around. You can browse by speciality, read a short profile, and reserve an open time.</p>
          <p>The platform keeps your appointments together, so upcoming visits, payments, and cancellations stay in one account.</p>
          <p className="font-semibold text-ink">Our vision</p>
          <p>Make the path from “I need a doctor” to “I have a time” short, clear, and easy to trust.</p>
        </div>
      </div>

      <h2 className="mt-16 text-2xl font-semibold text-ink">Why people use HealthLink</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {reasons.map((item) => (
          <article key={item.title} className="border-2 border-ink bg-paper p-6">
            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/70">{item.text}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default About
