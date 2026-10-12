import { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import { specialityData } from '../assets/assets'
import DoctorCard from '../components/DoctorCard'

const Doctors = () => {
  const { speciality } = useParams()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const filterDoc = useMemo(() => {
    const bySpeciality = speciality ? doctors.filter((doc) => doc.speciality === speciality) : doctors
    const term = query.trim().toLowerCase()
    if (!term) return bySpeciality
    return bySpeciality.filter((doc) => doc.name.toLowerCase().includes(term))
  }, [doctors, speciality, query])

  useEffect(() => {
    setQuery('')
  }, [speciality])

  const selectSpeciality = (name) => {
    if (speciality === name) navigate('/doctors')
    else navigate(`/doctors/${name}`)
  }

  return (
    <div className="pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Directory</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
            {speciality || 'All doctors'}
          </h1>
          <p className="mt-2 text-sm text-ink/60">{filterDoc.length} doctor{filterDoc.length === 1 ? '' : 's'} shown</p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="field sm:max-w-xs"
          type="search"
          placeholder="Search by name"
        />
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => navigate('/doctors')}
          className={`shrink-0 border-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${!speciality ? 'border-ink bg-ink text-paper' : 'border-ink/20 bg-paper text-ink'}`}
        >
          All
        </button>
        {specialityData.map((item) => (
          <button
            type="button"
            key={item.speciality}
            onClick={() => selectSpeciality(item.speciality)}
            className={`shrink-0 border-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${speciality === item.speciality ? 'border-ink bg-primary text-paper' : 'border-ink/20 bg-paper text-ink'}`}
          >
            {item.speciality}
          </button>
        ))}
      </div>

      {filterDoc.length === 0 ? (
        <div className="mt-10 border-2 border-dashed border-ink bg-paper px-6 py-16 text-center">
          <p className="text-lg font-semibold text-ink">No doctors match this search</p>
          <p className="mt-2 text-sm text-ink/60">Try another name, or clear the speciality filter.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filterDoc.map((item) => (
            <DoctorCard key={item._id} doctor={item} onClick={() => navigate(`/appointment/${item._id}`)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Doctors
