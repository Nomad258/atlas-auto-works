import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, ArrowRight, Palette, Car, Settings, Sparkles,
  Star, ChevronRight, Shield, Award, Clock, Play
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

    // Allow short model names (e.g., "GT3 RS", "M4") or full VINs (17 chars)
    if (vin.trim().length < 2) {
      setError(t('errors.validation'))
      return
    }

    setLoading(true)
    try {
      // Check if input looks like a car model name (not a VIN)
      // VINs are exactly 17 alphanumeric chars, model names have car-related keywords
      const isModelName = vin.length < 17 ||
        /M[34]|GT[23]|911|G63|AMG|HURACAN|AVENTADOR|488|F8|R8|RS[0-9]|CAYMAN|PANAMERA/i.test(vin)

      if (isModelName && vin.length < 17) {
        // Parse model name like "GT3 RS", "M4 COMPETITION", "G63 AMG"
        let make = 'Porsche'
        let model = vin.trim()

        // Detect make from input
        if (/M[34]/i.test(vin)) {
          make = 'BMW'
          model = vin.trim()
        } else if (/G63|AMG/i.test(vin)) {
          make = 'Mercedes-Benz'
          model = /G63/i.test(vin) ? 'G63 AMG' : vin.trim()
        } else if (/GT[23]|911|CAYMAN|PANAMERA/i.test(vin)) {
          make = 'Porsche'
          model = vin.trim()
        } else if (/HURACAN|AVENTADOR/i.test(vin)) {
          make = 'Lamborghini'
          model = vin.trim()
        } else if (/488|F8/i.test(vin)) {
          make = 'Ferrari'
          model = vin.trim()
        } else if (/R8|RS[0-9]/i.test(vin)) {
          make = 'Audi'
          model = vin.trim()
        }

        setVehicle({ make, model, year: 2024, vin: `MANUAL-${vin}` })
        setCurrentStep(1)
        navigate('/configure')
      } else {
        // Full VIN - decode it
        const vehicle = await decodeVIN(vin)
        setVehicle(vehicle)
        setCurrentStep(1)
        navigate('/configure')
      }
    } catch (err) {
      setError(err.message || t('errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: Palette, title: t('features.paint.title'), desc: t('features.paint.description'), img: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&q=80' },
    { icon: Car, title: t('features.bodykit.title'), desc: t('features.bodykit.description'), img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80' },
    { icon: Settings, title: t('features.wheels.title'), desc: t('features.wheels.description'), img: 'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=800&q=80' },
    { icon: Sparkles, title: t('features.starlight.title'), desc: t('features.starlight.description'), img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80' },
  ]

  return (
    <div className="min-h-screen bg-atlas-black text-white selection:bg-atlas-gold selection:text-black overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-cinematic z-10" />
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Car Background"
            className="w-full h-full object-cover animate-scale-in opacity-60"
          />
        </div>

        <div className="relative z-20 container mx-auto px-6 text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-atlas-gold/10 border border-atlas-gold/20 text-atlas-gold text-xs font-bold tracking-widest uppercase mb-8 animate-fade-in">
            <Star className="w-3 h-3" /> {t('home.hero.badge')}
          </div>

          <h1 className="font-display text-5xl md:text-8xl font-bold mb-6 leading-[1.1] tracking-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {t('home.hero.title')} <span className="text-transparent bg-clip-text bg-gradient-gold">{t('home.hero.highlight')}</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {t('home.hero.subtitle')}
          </p>

          {/* Premium VIN Input */}
          <div className="max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <form onSubmit={handleVinSubmit} className="relative group p-[1px] rounded-2xl bg-gradient-gold">
              <div className="relative bg-black rounded-2xl flex items-center p-2">
                <Search className="w-6 h-6 text-gray-500 ml-4" />
                <input
                  id="vin-input"
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  placeholder={t('home.vin.placeholder')}
                  className="flex-1 bg-transparent px-4 py-4 text-white placeholder:text-gray-600 outline-none font-mono text-lg tracking-wider"
                  maxLength={17}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-atlas-gold hover:bg-atlas-gold-light text-black px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </form>

            {/* Quick Select */}
            <div className="mt-8 flex justify-center gap-6 text-sm text-gray-500 font-medium">
              <button onClick={() => setVin('M4 COMPETITION')} className="hover:text-atlas-gold transition-colors">{t('home.vin.quickSelect.m4')}</button>
              <span className="opacity-30">•</span>
              <button onClick={() => setVin('GT3 RS')} className="hover:text-atlas-gold transition-colors">{t('home.vin.quickSelect.gt3')}</button>
              <span className="opacity-30">•</span>
              <button onClick={() => setVin('G63 AMG')} className="hover:text-atlas-gold transition-colors">{t('home.vin.quickSelect.g63')}</button>
            </div>

            {error && <p className="mt-4 text-red-400 bg-red-900/20 py-2 px-4 rounded-lg inline-block">{error}</p>}
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest">{t('home.hero.scroll')}</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-atlas-gold to-transparent" />
        </div>
      </section>

      {/* Stats Ticker */}
      <div className="border-y border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: t('home.stats.vehicles'), value: '2,500+' },
            { label: t('home.stats.options'), value: '1,000+' },
            { label: t('home.stats.studios'), value: '3' },
            { label: t('home.stats.satisfaction'), value: '100%' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-display font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid ("Services") */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">{t('home.features.title')} <span className="text-atlas-gold">{t('home.features.highlight')}</span></h2>
              <p className="text-gray-400 text-lg">{t('home.features.subtitle')}</p>
            </div>
            <button className="flex items-center gap-2 text-atlas-gold hover:text-white transition-colors text-sm font-bold tracking-widest uppercase">
              {t('home.features.cta')} <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer">
                <img src={f.img} alt={f.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-0 left-0 p-8">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 group-hover:bg-atlas-gold transition-colors">
                    <f.icon className="w-6 h-6 text-white group-hover:text-black" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us (Split Layout) */}
      <section id="why-us" className="py-32 bg-atlas-surface relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-atlas-gold/5 rounded-full blur-[128px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="font-display text-4xl font-bold mb-6">{t('home.whyUs.title')}</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {t('home.whyUs.subtitle')}
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: Shield, title: t('home.whyUs.quality.title'), desc: t('home.whyUs.quality.desc') },
                  { icon: Award, title: t('home.whyUs.craftsmanship.title'), desc: t('home.whyUs.craftsmanship.desc') },
                  { icon: Clock, title: t('home.whyUs.timeline.title'), desc: t('home.whyUs.timeline.desc') }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full border border-atlas-gold/30 flex items-center justify-center flex-shrink-0 text-atlas-gold mt-1">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 relative">
                <img
                  src="https://images.unsplash.com/photo-1603584173870-7b299f589279?q=80&w=1200&auto=format&fit=crop"
                  alt="Workshop"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                  <div className="text-2xl font-display font-bold text-atlas-gold">{t('home.whyUs.quote')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-atlas-black via-atlas-burgundy/10 to-atlas-black" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-8">{t('home.cta.title')}</h2>
          <p className="text-xl text-gray-400 mb-12">{t('home.cta.subtitle')}</p>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              setTimeout(() => document.getElementById('vin-input')?.focus(), 800)
            }}
            className="bg-white text-black hover:bg-atlas-gold transition-colors px-12 py-5 rounded-full font-bold text-lg tracking-wide shadow-2xl shadow-white/10 hover:shadow-atlas-gold/20"
          >
            {t('home.cta.button')}
          </button>
        </div>
      </section>

    </div>
  )
}

export default HomePage
