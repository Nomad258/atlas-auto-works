import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Palette, Layers, Car as CarIcon, CircleDot, Sofa, Sparkles,
  Package, Eye, Calculator, CalendarCheck, ChevronLeft, ChevronRight,
  Check, Search, ArrowRight, Info, RotateCcw, ZoomIn, ChevronDown, User
} from 'lucide-react'
import useStore from '../store/useStore'
import { getProducts, decodeVIN } from '../utils/api'
import { useTranslation } from '../i18n/useTranslation'
import Car3DViewer from '../components/Car3DViewer'
import ProductSelector from '../components/ProductSelector'
import LocationVisualizer from '../components/LocationVisualizer'
import QuoteBuilder from '../components/QuoteBuilder'
import BookingForm from '../components/BookingForm'
import { getAvailableModels } from '../utils/carModelMapping'

// Step definitions
const STEP_IDS = {
  VEHICLE: 0,
  EXTERIOR: 1,
  BODY: 2,
  WHEELS: 3,
  INTERIOR: 4,
  STARLIGHT: 5,
  EXTRAS: 6,
  VISUALIZE: 7,
  QUOTE: 8,
  BOOK: 9
}

function ConfiguratorPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { currentStep, setCurrentStep, vehicle, setVehicle, products, setProducts, setCarColor } = useStore()
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [loading, setLoading] = useState(false)

  // define steps with icons
  const steps = [
    { id: STEP_IDS.VEHICLE, name: t('configurator.steps.vehicle'), icon: CarIcon },
    { id: STEP_IDS.EXTERIOR, name: t('features.paint.title'), icon: Palette },
    { id: STEP_IDS.BODY, name: t('features.bodykit.title'), icon: Layers },
    { id: STEP_IDS.WHEELS, name: t('features.wheels.title'), icon: CircleDot },
    { id: STEP_IDS.INTERIOR, name: t('features.interior.title'), icon: Sofa },
    { id: STEP_IDS.STARLIGHT, name: t('features.starlight.title'), icon: Sparkles },
    { id: STEP_IDS.EXTRAS, name: t('features.accessories.title'), icon: Package },
    { id: STEP_IDS.VISUALIZE, name: t('configurator.steps.visualization'), icon: Eye },
    { id: STEP_IDS.QUOTE, name: t('configurator.steps.quote'), icon: Calculator },
    { id: STEP_IDS.BOOK, name: t('configurator.steps.booking'), icon: CalendarCheck },
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data.products)
      } catch (err) {
        console.error('Failed to fetch products:', err)
      }
    }
    fetchProducts()
  }, [])

  // Vehicle Selection Component (Embedded)
  const VehicleSelection = () => {
    return (
      <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-xl animate-fade-in">
        <div className="bg-atlas-surface border border-white/10 p-8 rounded-3xl max-w-4xl w-full shadow-2xl">
          <h2 className="font-display text-4xl font-bold mb-6 text-center">{t('configurator.selection.title')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto px-2 custom-scrollbar">
            {getAvailableModels().map((key) => {
              const parts = key.split('-')
              const display = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
              return (
                <button
                  key={key}
                  onClick={() => {
                    setVehicle({ make: parts[0], model: parts.slice(1).join(' '), year: 2024, vin: 'SELECT-' + key, baseColor: '#000' })
                    setCarColor('#000') // Default
                    setCurrentStep(1)
                  }}
                  className="group relative h-32 rounded-xl overflow-hidden border border-white/5 hover:border-atlas-gold transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-atlas-surface to-black group-hover:from-atlas-gold/20 group-hover:to-black transition-all" />
                  <div className="absolute bottom-4 left-4 font-bold text-lg group-hover:text-atlas-gold transition-colors">
                    {display}
                  </div>
                  <CarIcon className="absolute top-4 right-4 text-white/10 w-12 h-12 group-hover:text-atlas-gold/20 transition-all" />
                </button>
              )
            })}
          </div>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-gray-400 text-sm mb-4">{t('configurator.selection.or')}</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-atlas-gold" placeholder={t('configurator.selection.vinPlaceholder')} />
              <button className="btn-gold px-6 py-2 rounded-lg text-sm font-bold">{t('configurator.selection.decode')}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 pb-32 animate-fade-in">
            <ProductSelector category="paints" products={products?.paints || []} title={t('features.paint.title')} description={t('features.paint.description')} showSwatches />
            <div className="border-t border-white/10 pt-8">
              <ProductSelector category="wraps" products={products?.wraps || []} title={t('products.filters.wrap')} description={t('features.paint.description')} showSwatches />
            </div>
          </div>
        )
      case 2: return <ProductSelector category="bodykits" products={products?.bodykits || []} title={t('features.bodykit.title')} description={t('features.bodykit.description')} />
      case 3: return <ProductSelector category="wheels" products={products?.wheels || []} title={t('features.wheels.title')} description={t('features.wheels.description')} />
      case 4: return <ProductSelector category="interior" products={products?.interior || []} title={t('features.interior.title')} description={t('features.interior.description')} />
      case 5: return <ProductSelector category="starlight" products={products?.starlight || []} title={t('features.starlight.title')} description={t('features.starlight.description')} />
      case 6: return <ProductSelector category="accessories" products={products?.accessories || []} title={t('features.accessories.title')} description={t('features.accessories.description')} />
      case 7: return <LocationVisualizer />
      case 8: return <QuoteBuilder onProceedToBooking={() => setCurrentStep(9)} />
      case 9: return <BookingForm />
      default: return null
    }
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-atlas-black overflow-hidden flex flex-col md:flex-row font-body text-white">

      {/* 3D Background */}
      <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${currentStep === 0 ? 'scale-110 blur-xl opacity-40' : 'scale-100 opacity-100'}`}>
        <Car3DViewer />
      </div>

      {/* Top Bar (Floating) */}
      <div className="absolute top-0 left-0 w-full z-20 p-6 flex justify-between items-start pointer-events-none">
        <button onClick={() => navigate('/')} className="pointer-events-auto group flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:bg-black/60 transition-all hover:border-atlas-gold/50">
          <ChevronLeft className="w-4 h-4 text-white group-hover:text-atlas-gold transition-colors" />
          <span className="font-bold tracking-wide text-sm">{t('nav.exit')}</span>
        </button>

        {vehicle && (
          <div className="hidden md:flex flex-col items-end pointer-events-auto">
            <div className="bg-black/40 backdrop-blur-md px-8 py-3 rounded-full border border-white/5 flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] text-atlas-gold uppercase tracking-widest font-bold">{t('nav.currentBuild')}</div>
                <div className="font-display font-bold text-lg">{vehicle.make} {vehicle.model}</div>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div className="text-right">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{t('nav.year')}</div>
                <div className="font-mono text-sm">{vehicle.year}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Selection Modal */}
      {currentStep === 0 && <VehicleSelection />}

      {/* Right Configuration Panel */}
      {vehicle && currentStep > 0 && (
        <div className={`
              absolute top-0 right-0 h-full w-full md:w-[500px] z-20
              bg-black/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl
              transform transition-transform duration-500 ease-out flex flex-col
              ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}
          `}>

          {/* Steps Progress Bar (Top of panel) */}
          <div className="h-1 w-full bg-white/5 flex">
            {steps.slice(1).map((s, i) => (
              <div key={s.id} className={`h-full transition-all duration-500 ${s.id <= currentStep ? 'bg-atlas-gold flex-1' : 'bg-transparent flex-1'}`} />
            ))}
          </div>

          {/* Panel Header */}
          <div className="p-8 border-b border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-atlas-gold text-xs font-bold tracking-widest uppercase mb-1">{t('configurator.panel.step')} 0{currentStep} / 09</span>
              <button onClick={() => setIsPanelOpen(false)} className="md:hidden p-2 text-white/50"><ChevronRight /></button>
            </div>
            <h2 className="font-display text-4xl font-bold">{steps.find(s => s.id === currentStep)?.name}</h2>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
            {renderStepContent()}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-black/50 border-t border-white/10 flex justify-between items-center backdrop-blur-md">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              className={`flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              <ChevronLeft className="w-4 h-4" /> {t('configurator.panel.prev')}
            </button>

            {currentStep < 9 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-atlas-gold hover:bg-atlas-gold-light text-black px-8 py-3 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-atlas-gold/20"
              >
                {t('configurator.panel.next')} <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button (When panel closed) */}
      {!isPanelOpen && vehicle && (
        <button onClick={() => setIsPanelOpen(true)} className="absolute right-0 top-1/2 -translate-y-1/2 bg-atlas-gold p-4 rounded-l-2xl shadow-xl z-20 hover:pl-6 transition-all">
          <ChevronLeft className="text-black w-6 h-6" />
        </button>
      )}

    </div>
  )
}

export default ConfiguratorPage
