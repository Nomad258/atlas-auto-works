import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Palette, Layers, Car as CarIcon, CircleDot, Sofa, Sparkles,
  Package, Eye, Calculator, CalendarCheck, ChevronLeft, ChevronRight,
  Check, Search, ArrowRight, Info, RotateCcw, ZoomIn
} from 'lucide-react'
import useStore from '../store/useStore'
import { getProducts, decodeVIN } from '../utils/api'
import { useTranslation } from '../i18n/useTranslation'
import Car3DViewer from '../components/Car3DViewer'
import ProductSelector from '../components/ProductSelector'
import LocationVisualizer from '../components/LocationVisualizer'
import QuoteBuilder from '../components/QuoteBuilder'
import BookingForm from '../components/BookingForm'

// Step definitions with translation keys
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

function VehicleEntry({ onVehicleLoaded }) {
  const [vin, setVin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setVehicle, setCarColor } = useStore()
  const { t } = useTranslation()

  const handleSubmit = async (e) => {
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
      if (vehicle.baseColor) {
        setCarColor(vehicle.baseColor)
      }
      onVehicleLoaded()
    } catch (err) {
      setError(t('vin.error'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="max-w-md w-full bg-atlas-surface/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="w-16 h-16 bg-gradient-to-br from-atlas-burgundy to-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-atlas-burgundy/20">
          <CarIcon className="w-8 h-8 text-white" />
        </div>

        <h2 className="font-display text-3xl font-bold text-white mb-3">
          {t('vin.title')}
        </h2>
        <p className="text-atlas-silver mb-8">
          {t('vin.subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder={t('vin.placeholder')}
              maxLength={17}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-atlas-gold focus:ring-1 focus:ring-atlas-gold outline-none font-mono text-lg text-white placeholder-gray-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-atlas-charcoal/30 border-t-atlas-charcoal rounded-full animate-spin" />
            ) : (
              <>
                {t('vin.decode')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-start gap-2 text-xs text-gray-500 text-left">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            {t('vin.help')}
            <br />
            <span className="opacity-50">Ex: WBSWD9350PS (BMW), ZFF76ZFA (Ferrari)</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function QuoteSummaryWidget({ onViewQuote }) {
  const { getSelectedItems, getTotal } = useStore()
  const { t, formatCurrency } = useTranslation()
  const items = getSelectedItems()
  const total = getTotal()

  if (items.length === 0) return null

  return (
    <div className="absolute bottom-8 left-8 right-8 md:width-auto md:right-auto bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-6 animate-fade-in">
      <div>
        <div className="text-xs text-gray-400 mb-1">{t('quote.itemsSelected')} ({items.length})</div>
        <div className="text-xl font-display font-bold text-atlas-gold">
          {formatCurrency(total)}
        </div>
      </div>
      <button
        onClick={onViewQuote}
        className="btn-gold px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ml-auto"
      >
        <Calculator className="w-4 h-4" />
        {t('products.details')}
      </button>
    </div>
  )
}

export default function ConfiguratorPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { currentStep, setCurrentStep, vehicle, products, setProducts } = useStore()
  const [isPanelOpen, setIsPanelOpen] = useState(true)

  // define steps with translation
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

  const handleStepClick = (stepId) => {
    if (stepId === 0 || vehicle) {
      setCurrentStep(stepId)
    }
  }

  const renderStepContent = () => {
    if (currentStep === 0) {
      return <VehicleEntry onVehicleLoaded={() => setCurrentStep(1)} />
    }

    // Scrollable container for panel content
    const content = (
      <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
        {(() => {
          switch (currentStep) {
            case 1:
              return (
                <div className="space-y-8 pb-20">
                  <ProductSelector
                    category="paints"
                    products={products?.paints || []}
                    title={t('features.paint.title')}
                    description={t('features.paint.description')}
                    showSwatches
                  />
                  <div className="border-t border-white/10 pt-8">
                    <ProductSelector
                      category="wraps"
                      products={products?.wraps || []}
                      title={t('products.filters.wrap')}
                      description={t('features.paint.description')}
                      showSwatches
                    />
                  </div>
                </div>
              )
            case 2:
              return <ProductSelector category="bodykits" products={products?.bodykits || []} title={t('features.bodykit.title')} description={t('features.bodykit.description')} />
            case 3:
              return <ProductSelector category="wheels" products={products?.wheels || []} title={t('features.wheels.title')} description={t('features.wheels.description')} />
            case 4:
              return <ProductSelector category="interior" products={products?.interior || []} title={t('features.interior.title')} description={t('features.interior.description')} />
            case 5:
              return <ProductSelector category="starlight" products={products?.starlight || []} title={t('features.starlight.title')} description={t('features.starlight.description')} />
            case 6:
              return <ProductSelector category="accessories" products={products?.accessories || []} title={t('features.accessories.title')} description={t('features.accessories.description')} />
            case 7:
              return <LocationVisualizer />
            case 8:
              return <QuoteBuilder onProceedToBooking={() => setCurrentStep(9)} />
            case 9:
              return <BookingForm />
            default:
              return null
          }
        })()}
      </div>
    )

    return content
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-atlas-black overflow-hidden flex flex-col md:flex-row">
      {/* 3D Background - Always visible but z-index varies */}
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${currentStep === 0 ? 'opacity-30 blur-sm' : 'opacity-100'}`}>
        <Car3DViewer />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full z-20 p-6 flex justify-between items-start pointer-events-none">
        <button
          onClick={() => navigate('/')}
          className="pointer-events-auto flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="font-medium text-sm">{t('nav.home')}</span>
        </button>

        {vehicle && (
          <div className="pointer-events-auto bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white">
            <span className="opacity-50 text-xs uppercase tracking-wider mr-2">{vehicle.year}</span>
            <span className="font-display font-bold">{vehicle.make} {vehicle.model}</span>
          </div>
        )}
      </div>

      {/* Main Content Area (Overlay) */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {/* Step 0: Center Modal style */}
        {currentStep === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-30">
            {renderStepContent()}
          </div>
        )}

        {/* Right Side Panel - Config options */}
        {vehicle && currentStep > 0 && (
          <div
            className={`
              absolute top-0 right-0 h-full w-full md:w-[480px] 
              bg-atlas-surface/90 backdrop-blur-xl border-l border-white/10 
              shadow-2xl transition-transform duration-500 ease-out pointer-events-auto
              flex flex-col
              ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            {/* Panel Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-display font-bold text-white">
                  {steps.find(s => s.id === currentStep)?.name}
                </h2>
                <div className="flex gap-1 mt-1">
                  {/* Progress dots */}
                  {steps.slice(1).map(s => (
                    <div
                      key={s.id}
                      className={`h-1 rounded-full transition-all ${s.id === currentStep ? 'w-8 bg-atlas-gold' :
                          s.id < currentStep ? 'w-2 bg-atlas-burgundy' : 'w-2 bg-white/10'
                        }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsPanelOpen(false)}
                className="md:hidden p-2 text-white/50 hover:text-white"
              >
                <ChevronRight />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 relative p-6">
              {renderStepContent()}
            </div>

            {/* Panel Footer Navigation */}
            <div className="p-6 border-t border-white/10 bg-black/20 flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="text-sm font-medium text-white/50 hover:text-white disabled:opacity-20 transition-colors"
              >
                {t('common.previous')}
              </button>

              {currentStep < 9 && (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="btn-gold px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
                >
                  {t('common.next')}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Toggle Button for Mobile/Closed Panel */}
        {!isPanelOpen && vehicle && (
          <button
            onClick={() => setIsPanelOpen(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-auto bg-atlas-gold p-4 rounded-l-xl shadow-lg"
          >
            <ChevronLeft className="text-atlas-charcoal" />
          </button>
        )}

      </div>

      {/* Quote Widget */}
      {vehicle && currentStep > 0 && currentStep < 8 && (
        <div className="pointer-events-auto z-20">
          <QuoteSummaryWidget onViewQuote={() => setCurrentStep(8)} />
        </div>
      )}

    </div>
  )
}
