import { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { ClinicStore } from '../store/ClinicStore'
import Wordmark from './Wordmark'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/doctors', label: 'Doctors' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function desktopNavClass({ isActive }) {
  const base = 'border-b-2 px-1 py-1 text-sm font-semibold uppercase tracking-[0.12em] transition'
  return isActive
    ? `${base} border-primary text-primary`
    : `${base} border-transparent text-paper/80 hover:text-paper`
}

function mobileNavClass({ isActive }) {
  const base = 'border-b-2 px-1 py-2 text-sm font-semibold uppercase tracking-[0.12em]'
  return isActive
    ? `${base} border-primary text-primary`
    : `${base} border-transparent text-ink hover:text-primary`
}

export default function TopBar() {
  const navigate = useNavigate()
  const { token, setToken, userData } = useContext(ClinicStore)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const signOut = () => {
    localStorage.removeItem('token')
    setToken('')
    setAccountOpen(false)
    setDrawerOpen(false)
    navigate('/login')
  }

  const signedIn = Boolean(token && userData)

  return (
    <header className="sticky top-0 z-40 bg-ink text-paper">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <button type="button" onClick={() => navigate('/')} className="cursor-pointer" aria-label="HealthLink home">
          <Wordmark light />
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={desktopNavClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {signedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-2 border border-paper/30 bg-moss py-1 pl-1 pr-3"
              >
                <img className="h-8 w-8 object-cover" src={userData.image} alt="" />
                <span className="hidden max-w-28 truncate text-sm font-medium text-paper sm:block">{userData.name}</span>
                <img className="w-2.5 invert" src={assets.dropdown_icon} alt="" />
              </button>
              {accountOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-30 cursor-default"
                    aria-label="Close account menu"
                    onClick={() => setAccountOpen(false)}
                  />
                  <div className="absolute right-0 z-40 mt-2 w-52 overflow-hidden border-2 border-ink bg-paper py-2 text-ink shadow-card">
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false)
                        navigate('/my-profile')
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm hover:bg-canvas"
                    >
                      My profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false)
                        navigate('/my-appointments')
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm hover:bg-canvas"
                    >
                      My appointments
                    </button>
                    <button
                      type="button"
                      onClick={signOut}
                      className="block w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="btn-primary hidden px-5 py-2 md:inline-flex">
              Create account
            </button>
          )}

          <button type="button" onClick={() => setDrawerOpen(true)} className="p-2 md:hidden" aria-label="Open menu">
            <img className="w-6 invert" src={assets.menu_icon} alt="" />
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close menu" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-paper p-6 text-ink shadow-card">
            <div className="flex items-center justify-between">
              <Wordmark />
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                <img src={assets.cross_icon} className="w-6" alt="" />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setDrawerOpen(false)}
                  className={mobileNavClass}
                >
                  {item.label}
                </NavLink>
              ))}
              {signedIn ? (
                <>
                  <NavLink to="/my-profile" onClick={() => setDrawerOpen(false)} className={mobileNavClass}>
                    My profile
                  </NavLink>
                  <NavLink to="/my-appointments" onClick={() => setDrawerOpen(false)} className={mobileNavClass}>
                    My appointments
                  </NavLink>
                  <button
                    type="button"
                    onClick={signOut}
                    className="mt-4 px-1 py-2 text-left text-sm font-semibold uppercase tracking-[0.12em] text-primary"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setDrawerOpen(false)
                    navigate('/login')
                  }}
                  className="btn-primary mt-4"
                >
                  Create account
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
