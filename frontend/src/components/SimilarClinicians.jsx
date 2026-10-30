import { useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClinicStore } from '../store/ClinicStore'
import ClinicianTile from './ClinicianTile'
import BlockTitle from './BlockTitle'

export default function SimilarClinicians({ speciality, docId }) {
  const navigate = useNavigate()
  const { doctors } = useContext(ClinicStore)

  const peers = useMemo(() => {
    if (!speciality || !doctors.length) return []
    return doctors.filter((d) => d.speciality === speciality && d._id !== docId).slice(0, 4)
  }, [doctors, speciality, docId])

  if (!peers.length) return null

  return (
    <section className="mt-16">
      <BlockTitle
        eyebrow="Similar care"
        title="Other doctors in this speciality"
        text="If this time does not work, another doctor in the same field may have an opening."
      />
      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {peers.map((clinician) => (
          <ClinicianTile
            key={clinician._id}
            doctor={clinician}
            onClick={() => navigate(`/appointment/${clinician._id}`)}
          />
        ))}
      </div>
    </section>
  )
}
