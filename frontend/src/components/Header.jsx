import { assets } from '../assets/assets'

const Header = () => {
  return (
    <section className="mt-8 grid overflow-hidden border-2 border-ink bg-paper md:grid-cols-[1.1fr_0.9fr]">
      <div className="bg-moss px-6 py-12 text-paper sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Bentley clinic booking</p>
        <h1 className="mt-4 text-4xl leading-tight sm:text-6xl">
          Care that starts with a time, not a waiting list.
        </h1>
        <p className="mt-5 max-w-md text-sm leading-6 text-paper/80">
          Pick a speciality, open a doctor’s day, and reserve a slot. HealthLink keeps the visit in your account.
        </p>
        <a href="#speciality" className="btn-primary mt-8">
          Browse specialities
          <img className="w-3 invert" src={assets.arrow_icon} alt="" />
        </a>
      </div>
      <div className="relative bg-[#E7D3B5]">
        <img className="h-full max-h-[520px] w-full object-cover object-top" src={assets.header_img} alt="Doctor ready for a consultation" />
      </div>
    </section>
  )
}

export default Header
