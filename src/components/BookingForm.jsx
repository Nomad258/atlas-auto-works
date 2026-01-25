
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Calendar, Clock, User, Mail, Phone, ChevronLeft, ChevronRight,
  Check, Loader, AlertCircle
} from 'lucide-react'
import useStore from '../store/useStore'
import { getAvailability, createBooking } from '../utils/api'
import { useTranslation } from '../i18n/useTranslation'

function BookingForm() {
  const navigate = useNavigate()
  const { vehicle, quote, setBooking } = useStore()
  const { t, formatDate, formatCurrency } = useTranslation()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Form state
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
  })

  // Locations with Translation Keys
  const garageLocations = [
    {
      id: 'casa',
      name: t('booking.selectLocation.casablanca'),
      address: '123 Boulevard Mohammed V, Casablanca',
      phone: '+212 522 123 456',
    },
    {
      id: 'marrakech',
      name: t('booking.selectLocation.marrakech'),
      address: '45 Avenue Mohammed VI, Guéliz, Marrakech',
      phone: '+212 524 987 654',
    },
    {
      id: 'tangier',
      name: t('booking.selectLocation.tangier'),
      address: '78 Rue de Fès, Tangier',
      phone: '+212 539 456 789',
    },
  ]

  // Generate dates for the next 30 days
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return date
  }).filter(date => date.getDay() !== 0) // Exclude Sundays

  // Fetch availability when date is selected
  useEffect(() => {
    if (selectedLocation && selectedDate) {
      const fetchSlots = async () => {
        setLoading(true)
        try {
          const dateStr = selectedDate.toISOString().split('T')[0]
          const data = await getAvailability(selectedLocation.id, dateStr)
          setAvailableSlots(data.availableSlots || [])
        } catch (err) {
          setError(t('errors.network'))
        } finally {
          setLoading(false)
        }
      }
      fetchSlots()
    }
  }, [selectedLocation, selectedDate])

  const handleSubmit = async () => {
    if (!selectedLocation || !selectedDate || !selectedTime || !customer.name || !customer.email) {
      setError(t('errors.validation'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const booking = await createBooking({
        locationId: selectedLocation.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        customer,
        quoteId: quote?.id,
        vehicle,
      })

      setBooking(booking)
      navigate('/confirmation')
    } catch (err) {
      setError(err.message || t('errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-8">
        <h3 className="font-display text-2xl font-bold text-white mb-2">
          {t('booking.title')}
        </h3>
        <p className="text-gray-400">
          {t('booking.subtitle')}
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center justify-between mb-8 px-2">
        {[t('booking.steps.location'), t('booking.steps.datetime'), t('booking.steps.info')].map((label, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${step > i + 1
                  ? 'bg-atlas-burgundy text-white'
                  : step === i + 1
                    ? 'bg-atlas-gold text-black'
                    : 'bg-white/10 text-gray-500'}
              `}>
                {step > i + 1 ? <Check className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden md:block ${step >= i + 1 ? 'text-white' : 'text-gray-500'
                }`}>
                {label}
              </span>
            </div>
            {i < 2 && (
              <div className={`flex-1 h-px mx-4 ${step > i + 1 ? 'bg-atlas-burgundy' : 'bg-white/10'
                }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-6">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Location */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {garageLocations.map((location) => (
              <div
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`
                  p-5 rounded-xl cursor-pointer transition-all border
                  ${selectedLocation?.id === location.id
                    ? 'border-atlas-gold bg-atlas-gold/10'
                    : 'border-white/5 bg-black/20 hover:border-white/20 hover:bg-black/40'}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedLocation?.id === location.id
                      ? 'bg-atlas-gold text-black'
                      : 'bg-white/5 text-atlas-gold'
                    }`}>
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-lg">
                      {location.name}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">{location.address}</p>
                    <p className="text-sm text-gray-400">{location.phone}</p>
                  </div>
                  {selectedLocation?.id === location.id && (
                    <Check className="w-6 h-6 text-atlas-gold" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => selectedLocation && setStep(2)}
            disabled={!selectedLocation}
            className="w-full btn-burgundy py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {t('common.next')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div className="space-y-8">
          {/* Date selector */}
          <div>
            <label className="block text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-atlas-gold" />
              {t('booking.selectDate.title')}
            </label>
            <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
              {availableDates.slice(0, 14).map((date) => {
                const isSelected = selectedDate?.toDateString() === date.toDateString()
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => {
                      setSelectedDate(date)
                      setSelectedTime(null)
                    }}
                    className={`
                      flex-shrink-0 w-24 p-4 rounded-xl text-center transition-all border
                      ${isSelected
                        ? 'bg-atlas-burgundy border-atlas-burgundy text-white shadow-lg shadow-atlas-burgundy/30'
                        : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/20'}
                    `}
                  >
                    <div className="text-xs opacity-70 uppercase tracking-wide">
                      {formatDate(date, 'short').split('/')[0]} {/* Day only if possible or fallback */}
                      {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </div>
                    <div className="text-2xl font-bold my-1 font-display">
                      {date.getDate()}
                    </div>
                    <div className="text-xs opacity-70">
                      {date.toLocaleDateString('fr-FR', { month: 'short' })}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time slots */}
          <div className="min-h-[200px]">
            {selectedDate ? (
              <>
                <label className="block text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-atlas-gold" />
                  {t('booking.selectTime.title')}
                </label>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 text-atlas-gold animate-spin" />
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {availableSlots.map((time) => {
                      const isSelected = selectedTime === time
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`
                            p-3 rounded-lg font-medium transition-all border
                            ${isSelected
                              ? 'bg-atlas-gold border-atlas-gold text-black'
                              : 'bg-black/20 border-white/5 text-gray-300 hover:bg-white/5 hover:border-white/20'}
                          `}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8 border border-dashed border-white/10 rounded-xl">
                    {t('booking.selectDate.unavailable')}
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600">
                <p>{t('booking.selectDate.title')}</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-4 rounded-xl font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              {t('common.back')}
            </button>
            <button
              onClick={() => selectedDate && selectedTime && setStep(3)}
              disabled={!selectedDate || !selectedTime}
              className="flex-1 btn-burgundy py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {t('common.next')}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Customer Details */}
      {step === 3 && (
        <div className="space-y-8">
          <div className="p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10">
            <h4 className="font-semibold text-white mb-4 border-b border-white/10 pb-2">
              {t('booking.confirmation.details')}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">{t('booking.confirmation.location')}</span>
                <span className="font-medium text-white">{selectedLocation?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('booking.confirmation.date')}</span>
                <span className="font-medium text-white">{selectedDate && formatDate(selectedDate, 'long')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('booking.confirmation.time')}</span>
                <span className="font-medium text-white">{selectedTime}</span>
              </div>
              {vehicle && (
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('configurator.steps.vehicle')}</span>
                  <span className="font-medium text-white">{vehicle.year} {vehicle.make} {vehicle.model}</span>
                </div>
              )}
              {quote && (
                <div className="flex justify-between pt-3 border-t border-white/10 mt-2">
                  <span className="text-gray-400">{t('quote.breakdown.total')}</span>
                  <span className="font-bold text-atlas-gold text-lg">{formatCurrency(quote.summary.total)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2 text-atlas-gold" />
                {t('booking.customerInfo.firstName')} & {t('booking.customerInfo.lastName')} *
              </label>
              <input
                type="text"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                placeholder={t('booking.customerInfo.placeholders.firstName')}
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-atlas-gold focus:ring-1 focus:ring-atlas-gold outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2 text-atlas-gold" />
                {t('booking.customerInfo.email')} *
              </label>
              <input
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                placeholder={t('booking.customerInfo.placeholders.email')}
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-atlas-gold focus:ring-1 focus:ring-atlas-gold outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-2 text-atlas-gold" />
                {t('booking.customerInfo.phone')}
              </label>
              <input
                type="tel"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                placeholder={t('booking.customerInfo.placeholders.phone')}
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-atlas-gold focus:ring-1 focus:ring-atlas-gold outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-white/10 mt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-4 rounded-xl font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              {t('common.back')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !customer.name || !customer.email}
              className="flex-1 btn-gold py-4 rounded-xl font-bold text-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-atlas-gold/20"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {t('common.confirm')}
                  <Check className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingForm
