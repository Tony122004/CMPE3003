import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClinicStore } from '../store/ClinicStore'
import ClinicianTile from './ClinicianTile'
import BlockTitle from './BlockTitle'

export default function FeaturedClinicians() {
  const navigate = useNavigate()
  const { doctors } = useContext(ClinicStore)
  const preview = doctors.slice(0, 8)

  return (
    <section className="py-6">
      <BlockTitle
        eyebrow="Doctors"
        title="Available to book"
        text="A few of the doctors currently listed on HealthLink."
      />
      {!preview.length ? (
        <p className="mt-10 text-sm text-ink/60">Doctors will appear here once the list loads.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {preview.map((clinician) => (
            <ClinicianTile
              key={clinician._id}
              doctor={clinician}
              onClick={() => navigate(`/appointment/${clinician._id}`)}
            />
          ))}
        </div>
      )}
      <div className="mt-10 text-left">
        <button type="button" onClick={() => navigate('/doctors')} className="btn-outline px-8">
          View all doctors
        </button>
      </div>
    </section>
  )
}
