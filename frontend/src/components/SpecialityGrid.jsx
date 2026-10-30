import { Link } from 'react-router-dom'
import { specialityData } from '../assets/assets'
import BlockTitle from './BlockTitle'

const shortDescriptions = {
  'General physician': 'Everyday care and check-ups',
  'Gynecologist': 'Women’s health visits',
  'Dermatologist': 'Skin, hair, and nails',
  'Pediatricians': 'Care for children',
  'Neurologist': 'Brain and nerve health',
  'Gastroenterologist': 'Digestive care',
}

export default function SpecialityGrid() {
  return (
    <section id="speciality" className="scroll-mt-24 py-16">
      <BlockTitle
        eyebrow="Specialities"
        text="Choose a field. The doctor list updates to the people who take those visits."
      />
      <div className="mt-8 divide-y-2 divide-ink border-2 border-ink bg-paper">
        {specialityData.map((row, index) => (
          <Link
            key={row.speciality}
            to={`/doctors/${row.speciality}`}
            className="flex items-center gap-4 px-4 py-4 transition hover:bg-[#F6E7D4] sm:px-6"
          >
            <span className="w-8 font-display text-xl text-primary">{String(index + 1).padStart(2, '0')}</span>
            <img className="h-10 w-10 object-contain" src={row.image} alt="" />
            <span>
              <p className="font-display text-xl text-ink">{row.speciality}</p>
              <p className="text-sm text-ink/60">{shortDescriptions[row.speciality]}</p>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
