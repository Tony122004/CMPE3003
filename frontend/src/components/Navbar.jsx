import { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import Brand from './Brand'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/doctors', label: 'Doctors' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setOpenProfile(false)
    setShowMenu(false)
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `border-b-2 px-1 py-1 text-sm font-semibold uppercase tracking-[0.12em] transition ${isActive ? 'border-primary text-primary' : 'border-transparent text-paper/80 hover:text-paper'}`

  const drawerLinkClass = ({ isActive }) =>
    `border-b-2 px-1 py-2 text-sm font-semibold uppercase tracking-[0.12em] ${isActive ? 'border-primary text-primary' : 'border-transparent text-ink hover:text-primary'}`

  return (
    <header className="sticky top-0 z-40 bg-ink text-paper">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <button type="button" onClick={() => navigate('/')} className="cursor-pointer" aria-label="HealthLink home">
          <Brand light />
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {token && userData ? (
            <div className="relative">
              <button type="button" onClick={() => setOpenProfile((open) => !open)} className="flex items-center gap-2 border border-paper/30 bg-moss py-1 pl-1 pr-3">
                <img className="h-8 w-8 object-cover" src={userData.image} alt="" />
                <span className="hidden max-w-28 truncate text-sm font-medium text-paper sm:block">{userData.name}</span>
                <img className="w-2.5 invert" src={assets.dropdown_icon} alt="" />
              </button>
              {openProfile && (
                <>
                  <button type="button" className="fixed inset-0 z-30 cursor-default" aria-label="Close account menu" onClick={() => setOpenProfile(false)} />
                  <div className="absolute right-0 z-40 mt-2 w-52 overflow-hidden border-2 border-ink bg-paper py-2 text-ink shadow-card">
                    <button type="button" onClick={() => { setOpenProfile(false); navigate('/my-profile') }} className="block w-full px-4 py-2.5 text-left text-sm hover:bg-canvas">My profile</button>
                    <button type="button" onClick={() => { setOpenProfile(false); navigate('/my-appointments') }} className="block w-full px-4 py-2.5 text-left text-sm hover:bg-canvas">My appointments</button>
                    <button type="button" onClick={logout} className="block w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50">Log out</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="btn-primary hidden px-5 py-2 md:inline-flex">Create account</button>
          )}

          <button type="button" onClick={() => setShowMenu(true)} className="p-2 md:hidden" aria-label="Open menu">
            <img className="w-6 invert" src={assets.menu_icon} alt="" />
          </button>
        </div>
      </div>

      {showMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close menu" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-paper p-6 text-ink shadow-card">
            <div className="flex items-center justify-between">
              <Brand />
              <button type="button" onClick={() => setShowMenu(false)} aria-label="Close menu">
                <img src={assets.cross_icon} className="w-6" alt="" />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-2">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setShowMenu(false)} className={drawerLinkClass}>
                  {link.label}
                </NavLink>
              ))}
              {token && userData ? (
                <>
                  <NavLink to="/my-profile" onClick={() => setShowMenu(false)} className={drawerLinkClass}>My profile</NavLink>
                  <NavLink to="/my-appointments" onClick={() => setShowMenu(false)} className={drawerLinkClass}>My appointments</NavLink>
                  <button type="button" onClick={logout} className="mt-4 px-1 py-2 text-left text-sm font-semibold uppercase tracking-[0.12em] text-primary">Log out</button>
                </>
              ) : (
                <button onClick={() => { setShowMenu(false); navigate('/login') }} className="btn-primary mt-4">Create account</button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
