import { Link } from 'react-router-dom'
import Brand from './Brand'

const Footer = () => {
  return (
    <footer className="mt-20 bg-moss text-paper">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <Brand light />
          <p className="mt-5 max-w-sm text-sm leading-6 text-paper/75">
            HealthLink helps you find a trusted doctor, reserve a time, and keep your appointments in one place.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Explore</p>
          <ul className="flex flex-col gap-2 text-sm text-paper/80">
            <li><Link className="hover:text-paper" to="/">Home</Link></li>
            <li><Link className="hover:text-paper" to="/doctors">All doctors</Link></li>
            <li><Link className="hover:text-paper" to="/about">About us</Link></li>
            <li><Link className="hover:text-paper" to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Get in touch</p>
          <ul className="flex flex-col gap-2 text-sm text-paper/80">
            <li>1 Kent St</li>
            <li>Bentley WA 6102</li>
            <li>(08) 9266 4182</li>
            <li>21963265@student.curtin.edu.au</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
