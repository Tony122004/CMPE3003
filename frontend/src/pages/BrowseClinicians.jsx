import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { specialityData } from '../assets/assets'
import { ClinicStore } from '../store/ClinicStore'
import ClinicianTile from '../components/ClinicianTile'

export default function BrowseClinicians() {
  const { speciality } = useParams()
  const navigate = useNavigate()
  const { doctors } = useContext(ClinicStore)
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    setNameFilter('')
  }, [speciality])

  const visibleClinicians = useMemo(() => {
    let list = speciality ? doctors.filter((d) => d.speciality === speciality) : doctors
    const needle = nameFilter.trim().toLowerCase()
    if (needle) list = list.filter((d) => d.name.toLowerCase().includes(needle))
    return list
  }, [doctors, speciality, nameFilter])

  const toggleSpeciality = (label) => {
    navigate(speciality === label ? '/doctors' : `/doctors/${label}`)
  }

  const heading = speciality || 'All doctors'
  const countLabel = `${visibleClinicians.length} doctor${visibleClinicians.length === 1 ? '' : 's'} shown`

  return (
    <div className="pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Directory</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{heading}</h1>
          <p className="mt-2 text-sm text-ink/60">{countLabel}</p>
        </div>
        <input
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
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
        {specialityData.map((item) => {
          const active = speciality === item.speciality
          return (
            <button
              type="button"
              key={item.speciality}
              onClick={() => toggleSpeciality(item.speciality)}
              className={`shrink-0 border-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${active ? 'border-ink bg-primary text-paper' : 'border-ink/20 bg-paper text-ink'}`}
            >
              {item.speciality}
            </button>
          )
        })}
      </div>

      {visibleClinicians.length === 0 ? (
        <div className="mt-10 border-2 border-dashed border-ink bg-paper px-6 py-16 text-center">
          <p className="text-lg font-semibold text-ink">No doctors match this search</p>
          <p className="mt-2 text-sm text-ink/60">Try another name, or clear the speciality filter.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleClinicians.map((clinician) => (
            <ClinicianTile
              key={clinician._id}
              doctor={clinician}
              onClick={() => navigate(`/appointment/${clinician._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
