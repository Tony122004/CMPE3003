import { Link } from 'react-router-dom'
import Wordmark from './Wordmark'

const exploreLinks = [
  { to: '/', label: 'Home' },
  { to: '/doctors', label: 'All doctors' },
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact' },
]

export default function SiteFooter() {
  return (
    <footer className="mt-20 bg-moss text-paper">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <Wordmark light />
          <p className="mt-5 max-w-sm text-sm leading-6 text-paper/75">
            HealthLink helps you find a trusted doctor, reserve a time, and keep your appointments in one place.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Explore</p>
          <ul className="flex flex-col gap-2 text-sm text-paper/80">
            {exploreLinks.map((item) => (
              <li key={item.to}>
                <Link className="hover:text-paper" to={item.to}>
                  {item.label}
                </Link>
              </li>
            ))}
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
