
import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Car, Phone, MapPin, Instagram, Facebook } from 'lucide-react'
import { useTranslation } from '../i18n/useTranslation'

function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col bg-atlas-black">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome ? 'bg-gradient-to-b from-black/80 to-transparent' : 'bg-atlas-surface/90 backdrop-blur-md border-b border-white/5'
        }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-atlas-gold to-atlas-gold-light flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg shadow-atlas-gold/20">
                <Car className="w-7 h-7 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-white tracking-wide group-hover:text-atlas-gold transition-colors">
                  ATLAS AUTO WORKS
                </h1>
                <p className="text-[10px] text-atlas-gold tracking-[0.2em] font-medium uppercase">
                  {t('hero.subtitle') ? t('hero.subtitle').split(' ')[0] : 'PREMIUM'} CUSTOM
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors font-medium text-sm tracking-wide"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/configure"
                className="text-gray-300 hover:text-white transition-colors font-medium text-sm tracking-wide"
              >
                {t('nav.configurator')}
              </Link>
              <a
                href="#services"
                className="text-gray-300 hover:text-white transition-colors font-medium text-sm tracking-wide"
              >
                {t('features.title').split(' ')[0]} {/* "Nos" or "Services" fallback */}
              </a>
              <a
                href="#contact"
                className="text-gray-300 hover:text-white transition-colors font-medium text-sm tracking-wide"
              >
                {t('nav.contact')}
              </a>
            </nav>

            {/* CTA */}
            <Link
              to="/configure"
              className="hidden md:flex btn-gold px-6 py-2.5 rounded-full text-sm font-bold text-black shadow-lg shadow-atlas-gold/20 hover:shadow-atlas-gold/40 transition-all transform hover:-translate-y-0.5"
            >
              {t('hero.cta')}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-atlas-charcoal text-white pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-atlas-gold flex items-center justify-center shadow-lg shadow-atlas-gold/10">
                  <Car className="w-6 h-6 text-black" />
                </div>
                <span className="font-display text-lg font-bold">Atlas Auto Works</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {t('footer.about.description')}
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-atlas-gold hover:text-black transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-atlas-gold hover:text-black transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Locations */}
            <div>
              <h4 className="font-display font-bold text-lg mb-6 text-white">{t('footer.links.title')}</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-atlas-gold" />
                  <span>Casablanca<br /><span className="text-gray-500 text-xs">Boulevard Mohammed V</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-atlas-gold" />
                  <span>Marrakech<br /><span className="text-gray-500 text-xs">Quartier Guéliz</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-atlas-gold" />
                  <span>Tanger<br /><span className="text-gray-500 text-xs">Rue de Fès</span></span>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-display font-bold text-lg mb-6 text-white">Services</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="hover:text-atlas-gold transition-colors cursor-pointer">{t('features.paint.title')}</li>
                <li className="hover:text-atlas-gold transition-colors cursor-pointer">{t('features.bodykit.title')}</li>
                <li className="hover:text-atlas-gold transition-colors cursor-pointer">{t('features.wheels.title')}</li>
                <li className="hover:text-atlas-gold transition-colors cursor-pointer">{t('features.interior.title')}</li>
                <li className="hover:text-atlas-gold transition-colors cursor-pointer">{t('features.starlight.title')}</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-bold text-lg mb-6 text-white">{t('footer.contact.title')}</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-atlas-gold/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-atlas-gold" />
                  </div>
                  <span>{t('footer.contact.phone')}</span>
                </li>
                <li className="pl-11">{t('footer.contact.email')}</li>
                <li className="pt-4 border-t border-white/5">
                  <span className="text-gray-500 block mb-1 text-xs uppercase tracking-wider">{t('footer.hours.title')}</span>
                  {t('footer.hours.weekdays')}
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 text-center text-gray-600 text-sm">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
