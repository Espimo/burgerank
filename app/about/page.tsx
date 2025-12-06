import { Metadata } from 'next'
import HeroSection from '@/components/about/hero-section'
import AboutUsSection from '@/components/about/about-us-section'
import HowItWorksSection from '@/components/about/how-it-works-section'
import RankingMethodologySection from '@/components/about/ranking-methodology-section'
import ForRestaurantsSection from '@/components/about/for-restaurants-section'
import ContactSection from '@/components/about/contact-section'
import FAQsSection from '@/components/about/faqs-section'
import PressSection from '@/components/about/press-section'
import SocialLinks from '@/components/about/social-links'

export const metadata: Metadata = {
  title: 'Sobre BurgeRank | La comunidad definitiva de amantes de las hamburguesas',
  description:
    'Descubre cómo BurgeRank está revolucionando la forma en que compartimos opiniones sobre las mejores hamburguesas. Transparencia, comunidad y pasión por el burger perfecto.',
  keywords: [
    'hamburguesas',
    'ranking de burgers',
    'opiniones de comida',
    'comunidad foodie',
    'calificaciones de restaurantes',
    'best burgers',
  ],
  openGraph: {
    title: 'Sobre BurgeRank - La plataforma definitiva de hamburguesas',
    description: 'Descubre cómo funcionamos y únete a nuestra comunidad',
    type: 'website',
    url: 'https://burgerank.com/about',
    images: [
      {
        url: 'https://burgerank.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BurgeRank - Rating hamburguesas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre BurgeRank',
    description: 'La comunidad definitiva de amantes de las hamburguesas',
  },
}

export default function AboutPage() {
  return (
    <main className="w-full bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Sobre Nosotros */}
      <section id="about-us">
        <AboutUsSection />
      </section>

      {/* Cómo Funciona */}
      <section id="how-it-works">
        <HowItWorksSection />
      </section>

      {/* Metodología de Ranking */}
      <section id="ranking-methodology">
        <RankingMethodologySection />
      </section>

      {/* Para Restaurantes */}
      <section id="for-restaurants">
        <ForRestaurantsSection />
      </section>

      {/* Contacto */}
      <section id="contact">
        <ContactSection />
      </section>

      {/* FAQs */}
      <section id="faqs">
        <FAQsSection />
      </section>

      {/* Prensa */}
      <section id="press">
        <PressSection />
      </section>

      {/* Redes Sociales */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">BurgeRank</h3>
              <p className="text-gray-400">
                La comunidad definitiva de amantes de las hamburguesas
              </p>
            </div>
            <SocialLinks />
          </div>

          {/* Links Legales */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400 mb-8">
              <a href="/legal/terms" className="hover:text-amber-500 transition">
                Términos y Condiciones
              </a>
              <a href="/legal/privacy" className="hover:text-amber-500 transition">
                Política de Privacidad
              </a>
              <a href="/legal/cookies" className="hover:text-amber-500 transition">
                Política de Cookies
              </a>
              <a href="mailto:contacto@burgerank.com" className="hover:text-amber-500 transition">
                contacto@burgerank.com
              </a>
            </div>

            <div className="text-center text-gray-500 text-sm">
              <p>© 2024 BurgeRank. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
