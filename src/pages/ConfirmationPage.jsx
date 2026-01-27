import React from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle, Calendar, MapPin, Clock, Car, Mail, Phone, User,
  Download, Share2, ArrowRight, Home
} from 'lucide-react'
import useStore from '../store/useStore'
import { formatCurrency, formatDate } from '../utils/api'
import { useTranslation } from '../i18n/useTranslation'

function ConfirmationPage() {
  const { booking, vehicle, quote, reset } = useStore()
  const { t } = useTranslation()

  if (!booking) {
    return (
      <div className="min-h-screen bg-atlas-cream pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-atlas-charcoal mb-4">
            {t('confirmation.noBooking.title')}
          </h2>
          <p className="text-atlas-charcoal/60 mb-6">
            {t('confirmation.noBooking.subtitle')}
          </p>
          <Link to="/" className="btn-burgundy px-6 py-3 rounded-xl inline-flex items-center gap-2">
            <Home className="w-5 h-5" />
            {t('confirmation.noBooking.button')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-atlas-cream pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
          <h1 className="font-display text-4xl font-bold text-atlas-charcoal mb-3">
            {t('confirmation.title')}
          </h1>
          <p className="text-atlas-charcoal/60 text-lg">
            {t('confirmation.subtitle')}
          </p>
        </div>

        <div className="card p-6 mb-6 text-center bg-gradient-to-br from-atlas-burgundy to-atlas-burgundy-dark text-white">
          <p className="text-white/70 mb-2">{t('confirmation.code.label')}</p>
          <p className="font-mono text-4xl font-bold tracking-wider">
            {booking.confirmationCode}
          </p>
          <p className="text-white/60 text-sm mt-2">
            {t('confirmation.code.note')}
          </p>
        </div>

        {/* Booking details */}
        <div className="card p-6 mb-6">
          <h3 className="font-display text-xl font-semibold text-atlas-charcoal mb-6">
            {t('confirmation.details.title')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date & Time */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-atlas-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-atlas-gold" />
              </div>
              <div>
                <p className="text-sm text-atlas-charcoal/60">{t('confirmation.details.dateLabel')}</p>
                <p className="font-semibold text-atlas-charcoal">
                  {formatDate(booking.appointment.date)}
                </p>
                <p className="text-atlas-charcoal">
                  {booking.appointment.time}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-atlas-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-atlas-gold" />
              </div>
              <div>
                <p className="text-sm text-atlas-charcoal/60">{t('confirmation.details.locationLabel')}</p>
                <p className="font-semibold text-atlas-charcoal">
                  {booking.location.name}
                </p>
                <p className="text-atlas-charcoal/70 text-sm">
                  {booking.location.address}
                </p>
              </div>
            </div>

            {/* Customer */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-atlas-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-atlas-gold" />
              </div>
              <div>
                <p className="text-sm text-atlas-charcoal/60">{t('confirmation.details.contactLabel')}</p>
                <p className="font-semibold text-atlas-charcoal">
                  {booking.customer.name}
                </p>
                <p className="text-atlas-charcoal/70 text-sm flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {booking.customer.email}
                </p>
                {booking.customer.phone && (
                  <p className="text-atlas-charcoal/70 text-sm flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {booking.customer.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Vehicle */}
            {vehicle && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-atlas-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Car className="w-6 h-6 text-atlas-gold" />
                </div>
                <div>
                  <p className="text-sm text-atlas-charcoal/60">{t('confirmation.details.vehicleLabel')}</p>
                  <p className="font-semibold text-atlas-charcoal">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-atlas-charcoal/70 text-sm">
                    VIN: {vehicle.vin}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quote summary */}
        {quote && (
          <div className="card p-6 mb-6">
            <h3 className="font-display text-xl font-semibold text-atlas-charcoal mb-4">
              {t('confirmation.quote.title')}
            </h3>

            <div className="space-y-3">
              {quote.lineItems.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-atlas-charcoal/70">{item.name}</span>
                  <span className="font-medium">{formatCurrency(item.price)}</span>
                </div>
              ))}

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-atlas-charcoal/70">{t('confirmation.quote.partsSubtotal')}</span>
                  <span>{formatCurrency(quote.summary.partsSubtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-atlas-charcoal/70">{t('confirmation.quote.labor')}</span>
                  <span>{formatCurrency(quote.summary.laborCost)}</span>
                </div>
                {quote.summary.rushFee > 0 && (
                  <div className="flex justify-between text-sm text-atlas-gold">
                    <span>{t('confirmation.quote.rushFee')}</span>
                    <span>{formatCurrency(quote.summary.rushFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-atlas-charcoal/70">{t('confirmation.quote.vat')}</span>
                  <span>{formatCurrency(quote.summary.tax)}</span>
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold text-lg">{t('confirmation.quote.total')}</span>
                <span className="font-bold text-2xl text-atlas-burgundy">
                  {formatCurrency(quote.summary.total)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-atlas-charcoal/60 mt-2">
                <Clock className="w-4 h-4" />
                <span>{t('confirmation.quote.estimated')}: {quote.timeline.estimatedDays} {t('quote.timeline.days')}</span>
              </div>
            </div>
          </div>
        )}

        {/* What's next */}
        <div className="card p-6 mb-6 bg-atlas-charcoal text-white">
          <h3 className="font-display text-xl font-semibold mb-4">
            {t('confirmation.next.title')}
          </h3>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-atlas-gold text-atlas-charcoal rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </span>
              <div>
                <p className="font-medium">{t('confirmation.next.step1.title')}</p>
                <p className="text-white/60 text-sm">
                  {t('confirmation.next.step1.desc')}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-atlas-gold text-atlas-charcoal rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </span>
              <div>
                <p className="font-medium">{t('confirmation.next.step2.title')}</p>
                <p className="text-white/60 text-sm">
                  {t('confirmation.next.step2.desc')}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-atlas-gold text-atlas-charcoal rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </span>
              <div>
                <p className="font-medium">{t('confirmation.next.step3.title')}</p>
                <p className="text-white/60 text-sm">
                  {t('confirmation.next.step3.desc', { location: booking.location.name, date: formatDate(booking.appointment.date) })}
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Contact info */}
        <div className="card p-6 mb-8">
          <h3 className="font-display text-xl font-semibold text-atlas-charcoal mb-4">
            {t('confirmation.contact.title')}
          </h3>
          <p className="text-atlas-charcoal/60 mb-4">
            {t('confirmation.contact.desc')}
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${booking.location.phone}`}
              className="flex items-center gap-2 text-atlas-burgundy hover:underline"
            >
              <Phone className="w-4 h-4" />
              {booking.location.phone}
            </a>
            <span className="text-atlas-charcoal/30">|</span>
            <a
              href="mailto:info@atlasautoworks.ma"
              className="flex items-center gap-2 text-atlas-burgundy hover:underline"
            >
              <Mail className="w-4 h-4" />
              info@atlasautoworks.ma
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-gold px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            {t('confirmation.actions.download')}
          </button>
          <button className="border-2 border-atlas-charcoal/20 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white transition-colors">
            <Share2 className="w-5 h-5" />
            {t('confirmation.actions.share')}
          </button>
        </div>

        {/* Start new */}
        <div className="text-center mt-12">
          <Link
            to="/"
            onClick={() => reset()}
            className="text-atlas-charcoal/50 hover:text-atlas-burgundy inline-flex items-center gap-2 transition-colors"
          >
            {t('confirmation.actions.new')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPage
