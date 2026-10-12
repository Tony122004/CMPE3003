import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorCard from './DoctorCard'
import SectionHeading from './SectionHeading'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  return (
    <section className="py-6">
      <SectionHeading
        eyebrow="Doctors"
        title="Available to book"
        text="A few of the doctors currently listed on HealthLink."
      />
      {doctors.length === 0 ? (
        <p className="mt-10 text-sm text-ink/60">Doctors will appear here once the list loads.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {doctors.slice(0, 8).map((item) => (
            <DoctorCard key={item._id} doctor={item} onClick={() => navigate(`/appointment/${item._id}`)} />
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

export default TopDoctors
