import Topbar from '../components/Topbar'
import Hero from '../components/Hero'
import ScrollSection from '../components/ScrollSection'
import FeaturesSection from '../components/FeaturesSection'
import PricingBar from '../components/PricingBar'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'
import FloatingBadge from '../components/FloatingBadge'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Topbar />
      <Hero />
      <section id="about">
        <ScrollSection />
      </section>
      <section id="features">
        <FeaturesSection />
      </section>
      <section id="pricing">
        <PricingBar />
      </section>
      <CTASection />
      <section id="contact">
        <Footer />
      </section>
      <FloatingBadge />
    </main>
  )
}