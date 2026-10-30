import HeroBanner from '../components/HeroBanner'
import StepsSection from '../components/StepsSection'
import SpecialityGrid from '../components/SpecialityGrid'
import FeaturedClinicians from '../components/FeaturedClinicians'
import CtaStrip from '../components/CtaStrip'

export default function Landing() {
  return (
    <div>
      <HeroBanner />
      <StepsSection />
      <SpecialityGrid />
      <FeaturedClinicians />
      <CtaStrip />
    </div>
  )
}
