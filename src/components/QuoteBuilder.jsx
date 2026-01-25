
import React, { useState, useEffect } from 'react'
import { Receipt, Clock, Zap, ChevronDown, ChevronUp, Trash2, AlertCircle } from 'lucide-react'
import useStore from '../store/useStore'
import { calculateQuote } from '../utils/api'
import { useTranslation } from '../i18n/useTranslation'

function QuoteLineItem({ item, onRemove }) {
  const { t, formatCurrency } = useTranslation()

  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group">
      <div className="flex-1">
        <p className="font-medium text-white">{item.name}</p>
        <p className="text-sm text-gray-400">
          {item.sku} • {item.laborHours}h {t('products.specifications.labor')}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-semibold text-atlas-gold">
          {formatCurrency(item.price)}
        </span>
        <button
          onClick={() => onRemove(item)}
          className="text-gray-600 hover:text-red-500 transition-colors bg-white/5 p-2 rounded-lg opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function QuoteBuilder({ onProceedToBooking }) {
  const {
    configuration,
    setConfiguration,
    vehicle,
    quote,
    setQuote,
    getSelectedItems,
    removeAccessory,
  } = useStore()

  const { t, formatCurrency } = useTranslation()

  const [rushOrder, setRushOrder] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const [error, setError] = useState(null)

  const selectedItems = getSelectedItems()

  // Calculate quote whenever items or rush order changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (selectedItems.length === 0) {
        setQuote(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const quoteData = await calculateQuote(selectedItems, vehicle, rushOrder)
        setQuote(quoteData)
      } catch (err) {
        setError(t('errors.generic'))
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchQuote, 300)
    return () => clearTimeout(timeoutId)
  }, [selectedItems.length, rushOrder])

  const handleRemoveItem = (item) => {
    if (item.category === 'accessories') {
      removeAccessory(item.id)
    } else {
      // Find which configuration key this item belongs to
      // Configuration keys mapping
      const categoryMap = {
        'paints': 'paint',
        'wraps': 'wrap',
        'bodykits': 'bodykit',
        'wheels': 'wheels',
        'interior': 'interior',
        'starlight': 'starlight',
      }

      Object.entries(configuration).forEach(([key, value]) => {
        if (value?.id === item.id) {
          setConfiguration(key, null)
        }
      })
    }
  }

  if (selectedItems.length === 0) {
    return (
      <div className="md:col-span-2 p-12 text-center border-2 border-dashed border-white/10 rounded-2xl bg-black/20">
        <Receipt className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="font-display text-xl font-semibold text-white mb-2">
          {t('quote.noItems')}
        </h3>
        <p className="text-gray-400">
          {t('quote.selectProducts')}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-atlas-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-atlas-burgundy to-black text-white hover:brightness-110 transition-all"
      >
        <div className="flex items-center gap-3">
          <Receipt className="w-5 h-5" />
          <span className="font-semibold text-lg">{t('quote.title')}</span>
          <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
            {selectedItems.length}
          </span>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {expanded && (
        <div className="p-6">
          {/* Line items */}
          <div className="mb-6 space-y-1">
            {selectedItems.map((item) => (
              <QuoteLineItem
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          {/* Rush order option */}
          <label className="flex items-center gap-4 p-4 bg-atlas-gold/5 border border-atlas-gold/20 rounded-xl mb-8 cursor-pointer hover:bg-atlas-gold/10 transition-colors">
            <div className={`
              w-6 h-6 rounded border flex items-center justify-center transition-all
              ${rushOrder ? 'bg-atlas-gold border-atlas-gold' : 'border-gray-500'}
            `}>
              {rushOrder && <Check className="w-4 h-4 text-black" />}
            </div>
            <input
              type="checkbox"
              checked={rushOrder}
              onChange={(e) => setRushOrder(e.target.checked)}
              className="hidden"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-atlas-gold" />
                <span className="font-semibold text-white">{t('quote.options.rush')}</span>
              </div>
              <p className="text-sm text-gray-400">
                {t('quote.breakdown.rushFee')}
              </p>
            </div>
          </label>

          {/* Error state */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quote summary */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />
              ))}
            </div>
          ) : quote ? (
            <div className="space-y-4">
              <div className="flex justify-between text-gray-400">
                <span>{t('quote.breakdown.products')}</span>
                <span className="text-white">{formatCurrency(quote.summary.partsSubtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>
                  {t('quote.breakdown.labor')} ({quote.summary.laborHours}h)
                </span>
                <span className="text-white">{formatCurrency(quote.summary.laborCost)}</span>
              </div>
              {quote.summary.rushFee > 0 && (
                <div className="flex justify-between text-atlas-gold">
                  <span>{t('quote.options.rush')}</span>
                  <span>{formatCurrency(quote.summary.rushFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>{t('quote.breakdown.vat')}</span>
                <span className="text-white">{formatCurrency(quote.summary.tax)}</span>
              </div>

              <div className="flex justify-between items-end pt-6 border-t border-white/10 mt-4">
                <span className="font-semibold text-lg text-white">{t('quote.breakdown.total')}</span>
                <span className="font-display font-bold text-3xl text-atlas-gold">{formatCurrency(quote.summary.total)}</span>
              </div>

              {/* Timeline estimate */}
              <div className="flex items-center gap-2 mt-2 py-3 px-4 bg-white/5 rounded-lg border border-white/5">
                <Clock className="w-4 h-4 text-atlas-gold" />
                <span className="text-sm text-gray-300">
                  {t('quote.timeline.estimated')}: <strong className="text-white">{quote.timeline.estimatedDays} {t('quote.timeline.days')}</strong>
                </span>
              </div>
            </div>
          ) : null}

          {/* Proceed button */}
          {quote && (
            <button
              onClick={onProceedToBooking}
              className="w-full btn-gold py-4 rounded-xl font-bold text-lg mt-8 shadow-lg shadow-atlas-gold/20 hover:shadow-atlas-gold/40 transition-shadow"
            >
              {t('quote.actions.continue')}
            </button>
          )}

          {/* Quote validity */}
          {quote && (
            <p className="text-xs text-gray-600 text-center mt-6">
              {t('quote.validity')} 30 {t('quote.timeline.days')} • {t('quote.reference')}: {quote.id}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default QuoteBuilder
