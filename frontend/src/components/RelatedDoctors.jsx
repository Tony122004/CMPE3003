import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorCard from './DoctorCard'
import SectionHeading from './SectionHeading'

const RelatedDoctors = ({ speciality, docId }) => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [relDoc, setRelDoc] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      setRelDoc(doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId))
    }
  }, [doctors, speciality, docId])

  if (!relDoc.length) return null

  return (
    <section className="mt-16">
      <SectionHeading
        eyebrow="Similar care"
        title="Other doctors in this speciality"
        text="If this time does not work, another doctor in the same field may have an opening."
      />
      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {relDoc.slice(0, 4).map((item) => (
          <DoctorCard key={item._id} doctor={item} onClick={() => navigate(`/appointment/${item._id}`)} />
        ))}
      </div>
    </section>
  )
}

export default RelatedDoctors
