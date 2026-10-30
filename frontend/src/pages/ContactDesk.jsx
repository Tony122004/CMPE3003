import { assets } from '../assets/assets'

export default function ContactDesk() {
  return (
    <div className="pt-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Contact</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">We are here if you need a hand</h1>
        <p className="mt-3 text-sm leading-6 text-ink/70">
          Questions about an appointment, your account, or working with HealthLink — start here.
        </p>
      </div>

      <div className="mt-10 grid items-stretch gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <img className="h-full w-full border-2 border-ink object-cover" src={assets.contact_image} alt="HealthLink office" />
        <div className="grid gap-4">
          <article className="border-2 border-ink bg-paper p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Office</p>
            <p className="mt-3 text-lg font-semibold text-ink">1 Kent St</p>
            <p className="text-sm text-ink/70">Bentley WA 6102</p>
          </article>
          <article className="border-2 border-ink bg-paper p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Talk to us</p>
            <p className="mt-3 text-sm text-ink/75">Tel: (08) 9266 4182</p>
            <a className="text-sm font-medium text-primary" href="mailto:21963265@student.curtin.edu.au">
              21963265@student.curtin.edu.au
            </a>
          </article>
          <article className="border-2 border-ink bg-paper p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Careers</p>
            <p className="mt-3 text-sm text-ink/75">Learn more about teams and openings at HealthLink.</p>
            <a
              href="mailto:21963265@student.curtin.edu.au?subject=Careers%20at%20HealthLink"
              className="btn-primary mt-5"
            >
              Explore jobs
            </a>
          </article>
        </div>
      </div>
    </div>
  )
}
