import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StatsSection from './components/StatusSection'
import HowItWorksSection from './components/HowItWorksSection'
import CategoriesSection from './components/CategoriesSection'
import AiFeaturesSection from './components/AiFeaturesSection'
import CtaSection from './components/CtaSection'
import Faqsection from './components/Faqsection'
import Footersection from './components/Footersection'
function LandingPage() {
  return (
    <main>
        <Navbar/>
        <HeroSection/>
        <StatsSection/>
        <HowItWorksSection />
        <CategoriesSection/>
        <AiFeaturesSection/>
        <Faqsection/>
        <CtaSection/>
        <Footersection/>

    </main>
  )
}

export default LandingPage
