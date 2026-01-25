
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, ArrowRight, Palette, Car, Settings, Sparkles,
  Star, ChevronRight, Shield, Award, Clock
} from 'lucide-react'
import useStore from '../store/useStore'
import { decodeVIN } from '../utils/api'
import { useTranslation } from '../i18n/useTranslation'

function HomePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [vin, setVin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setVehicle, setCurrentStep } = useStore()

  const handleVinSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (vin.length < 8) {
      setError(t('errors.validation'))
      return
    }

    setLoading(true)
    try {
      const vehicle = await decodeVIN(vin)
      setVehicle(vehicle)
      setCurrentStep(1)
      navigate('/configure')
    } catch (err) {
      setError(err.message || t('errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  const services = [
    {
      icon: Palette,
      title: t('features.paint.title'),
      description: t('features.paint.description'),
    },
    {
      icon: Car,
      title: t('features.bodykit.title'),
      description: t('features.bodykit.description'),
    },
    {
      icon: Settings,
      title: t('features.wheels.title'),
      description: t('features.wheels.description'),
    },
    {
      icon: Sparkles,
      title: t('features.starlight.title'),
      description: t('features.starlight.description'),
    },
  ]

  const stats = [
    { value: '2,500+', label: t('hero.stats.vehicles') },
    { value: '15+', label: t('hero.stats.experience') },
    { value: '3', label: t('booking.steps.location') + 's' }, // "Lieux" / "Locations"
    { value: '100%', label: t('hero.stats.clients') },
  ]

  return (
    <div className="min-h-screen bg-atlas-black text-white selection:bg-atlas-gold selection:text-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-atlas-black z-10" />
          {/* Background Image / Video Placeholder - using a subtle gradient for now */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 scale-105 animate-slow-zoom" />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center mt-[-5vh]">
          <div className="mb-8 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 animate-fade-in-up">
            <Star className="w-4 h-4 text-atlas-gold" />
            <span className="text-gray-300 text-sm tracking-wide uppercase font-medium">Morocco's Premier Studio</span>
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-bold text-white mb-8 leading-tight animate-fade-in-up delay-100">
            {t('hero.title').split(' ').map((word, i) => (
              i === t('hero.title').split(' ').length - 1 ? <span key={i} className="text-atlas-gold block md:inline">{word}</span> : word + ' '
            ))}
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-16 leading-relaxed animate-fade-in-up delay-200">
            {t('hero.description')}
          </p>

          {/* VIN Input Form */}
          <div className="max-w-2xl mx-auto animate-fade-in-up delay-300">
            <form onSubmit={handleVinSubmit} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-atlas-gold via-atlas-burgundy to-atlas-gold rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative flex p-2 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                <div className="flex-1 flex items-center gap-4 px-6">
                  <Search className="w-6 h-6 text-gray-500" />
                  <input
                    type="text"
                    value={vin}
                    onChange={(e) => setVin(e.target.value.toUpperCase())}
                    placeholder={t('vin.placeholder')}
                    className="flex-1 py-4 text-lg bg-transparent text-white placeholder:text-gray-600 outline-none font-mono tracking-wider"
                    maxLength={17}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold px-8 py-4 rounded-xl text-lg font-bold text-black flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      {t('hero.cta')}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <p className="mt-4 text-red-400 text-sm bg-red-500/10 inline-block px-4 py-2 rounded-lg border border-red-500/20">{error}</p>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span>Ex:</span>
              <button onClick={() => setVin('WBSWD9350PS')} className="hover:text-atlas-gold transition-colors border-b border-dashed border-gray-600 hover:border-atlas-gold">BMW M4</button>
              <button onClick={() => setVin('ZFF76ZFA')} className="hover:text-atlas-gold transition-colors border-b border-dashed border-gray-600 hover:border-atlas-gold">Ferrari 488</button>
              <button onClick={() => setVin('ZHWUC1ZF')} className="hover:text-atlas-gold transition-colors border-b border-dashed border-gray-600 hover:border-atlas-gold">Lamborghini</button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-atlas-gold to-transparent" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-atlas-surface/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2 group-hover:text-atlas-gold transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-gray-500 uppercase tracking-widest text-xs font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              {t('features.title')}
            </h2>
            <div className="w-24 h-1 bg-atlas-gold mx-auto mb-6" />
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-atlas-gold/30 transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mb-8 shadow-inner border border-white/5 group-hover:border-atlas-gold/50 transition-colors">
                  <service.icon className="w-8 h-8 text-atlas-gold" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-gradient-to-br from-atlas-surface to-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-atlas-gold/5 blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
                Why <span className="text-atlas-gold">Atlas</span>?
              </h2>
              <p className="text-gray-300 mb-12 text-lg leading-relaxed">
                {t('hero.description')}
              </p>

              <div className="space-y-8">
                {[
                  { icon: Shield, title: "Premium Quality", desc: "Certified materials & parts" },
                  { icon: Award, title: "Expert Craftsmen", desc: "Master technicians" },
                  { icon: Clock, title: "Timely Delivery", desc: "Respect for your schedule" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-14 h-14 rounded-xl bg-atlas-gold/10 border border-atlas-gold/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-atlas-gold" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-white mb-1">{item.title}</h4>
                      <p className="text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-atlas-gold/10 bg-black">
                <div className="aspect-square bg-[url('/car-placeholder.jpg')] bg-cover bg-center opacity-80" style={{ backgroundImage: 'linear-gradient(45deg, #111, transparent)' }} >
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-atlas-burgundy/20 to-black/80">
                    <Car className="w-32 h-32 text-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-atlas-gold/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-atlas-black via-transparent to-atlas-black" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-8">
            {t('hero.title')}
          </h2>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              document.querySelector('input')?.focus()
            }}
            className="btn-gold px-12 py-5 rounded-full text-xl font-bold text-black inline-flex items-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-atlas-gold/20"
          >
            {t('hero.cta')}
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage
