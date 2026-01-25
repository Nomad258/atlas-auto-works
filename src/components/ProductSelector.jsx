
import React from 'react'
import { Check, Info } from 'lucide-react'
import useStore from '../store/useStore'
import { useTranslation } from '../i18n/useTranslation'

// Utility function to adjust color brightness
function adjustBrightness(hexColor, percent) {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  const adjust = (value) => {
    const adjusted = value + (value * percent) / 100
    return Math.max(0, Math.min(255, Math.round(adjusted)))
  }

  const newR = adjust(r).toString(16).padStart(2, '0')
  const newG = adjust(g).toString(16).padStart(2, '0')
  const newB = adjust(b).toString(16).padStart(2, '0')

  return `#${newR}${newG}${newB}`
}

function ProductCard({ product, isSelected, onSelect, type }) {
  const { t, formatCurrency } = useTranslation()

  return (
    <div
      onClick={() => onSelect(product)}
      className={`
        relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer group
        ${isSelected
          ? 'border-atlas-gold bg-atlas-gold/10'
          : 'border-white/5 bg-black/20 hover:border-white/20 hover:bg-black/40'}
      `}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-0 right-0 p-1 bg-atlas-gold rounded-bl-xl shadow-lg z-10">
          <Check className="w-4 h-4 text-black" />
        </div>
      )}

      <div className="p-4">
        {/* Product Image or Color Swatch */}
        {product.image ? (
          <div className="relative w-full h-32 rounded-lg mb-4 overflow-hidden bg-atlas-surface">
            <img
              src={`/products/${type}/${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                // Fallback to gradient if image fails
                e.target.style.display = 'none'
                e.target.parentElement.style.background = product.color
                  ? `linear-gradient(135deg, ${product.color} 0%, ${adjustBrightness(product.color, -20)} 100%)`
                  : 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
              }}
            />
            {/* Overlay gradient for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (type === 'paints' || type === 'wraps') && product.color ? (
          <div
            className="w-full h-32 rounded-lg mb-4 shadow-inner flex-shrink-0 border border-white/10"
            style={{ backgroundColor: product.color }}
          />
        ) : (
          <div className="w-full h-32 rounded-lg mb-4 bg-gradient-to-br from-atlas-surface to-atlas-charcoal border border-white/10 flex items-center justify-center">
            <span className="text-white/30 text-sm">{product.type || 'Product'}</span>
          </div>
        )}

        {/* Product info */}
        <h4 className="font-display font-semibold text-white mb-2 text-lg leading-tight">
          {product.name}
        </h4>

        <div className="space-y-2 mb-4">
          {product.finish && (
            <p className="text-xs text-gray-400 capitalize">{product.finish}</p>
          )}
          {product.size && (
            <p className="text-xs text-gray-400">{product.size}</p>
          )}
          {product.type && (
            <p className="text-xs text-gray-400">{product.type}</p>
          )}
          {product.stars && (
            <p className="text-xs text-gray-400">{product.stars} stars</p>
          )}
          {product.warranty && (
            <span className="inline-block px-2 py-1 bg-atlas-gold/20 text-atlas-gold text-xs font-medium rounded">
              {product.warranty} Warranty
            </span>
          )}
          {product.materials && (
            <p className="text-xs text-gray-500">Materials: {product.materials.join(', ')}</p>
          )}
        </div>

        <div className="flex items-end justify-between mt-auto">
          <span className="text-atlas-gold font-bold text-lg">
            {formatCurrency(product.price)}
          </span>
          <div className="text-right">
            <span className="text-xs text-gray-500 block">{product.laborHours}h {t('products.specifications.labor')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ColorSwatches({ products, selectedId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onSelect(product)}
          className={`
            w-10 h-10 rounded-full cursor-pointer transition-all duration-300 border-2
            ${selectedId === product.id
              ? 'border-atlas-gold scale-110 shadow-[0_0_15px_rgba(196,166,97,0.5)]'
              : 'border-transparent hover:scale-110 hover:border-white/30'}
          `}
          style={{ backgroundColor: product.color }}
          title={product.name}
        />
      ))}
    </div>
  )
}

function ProductSelector({ category, products, title, description, showSwatches = false }) {
  const { configuration, setConfiguration, setCarColor, setWheelColor } = useStore()
  const { t, formatCurrency } = useTranslation()

  const selectedProduct = configuration[category]

  const handleSelect = (product) => {
    // If same product is clicked, deselect it
    if (selectedProduct?.id === product.id) {
      setConfiguration(category, null)
      return
    }

    setConfiguration(category, product)

    // Update car color for visual preview
    if (category === 'paints' || category === 'wraps') {
      if (product.color) {
        setCarColor(product.color)
      }
    }

    if (category === 'wheels') {
      // Mapping finish to hex colors for 3D viewer
      // Enhance this logic for better matching or move to utility
      const finishMap = {
        'Gloss Black': '#1a1a1a',
        'Satin Black': '#1a1a1a',
        'Brushed Bronze': '#8B7355',
        'Machined Silver': '#C0C0C0',
        'Polished Chrome': '#E8E8E8',
        'Carbon Weave': '#2a2a2a'
      }
      const color = finishMap[product.finish] || '#4a4a4a'
      setWheelColor(color)
    }
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{t('products.notFound') || 'No products available'}</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h3 className="font-display text-2xl font-bold text-white mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-gray-400 leading-relaxed">{description}</p>
        )}
      </div>

      {/* Show color swatches for quick selection */}
      {showSwatches && (
        <ColorSwatches
          products={products}
          selectedId={selectedProduct?.id}
          onSelect={handleSelect}
        />
      )}

      {/* Selected product detail */}
      {selectedProduct && (
        <div className="mb-8 p-5 bg-gradient-to-br from-atlas-gold/20 to-transparent rounded-xl border border-atlas-gold/20 relative overflow-hidden">
          <div className="flex items-start gap-4 relative z-10">
            {selectedProduct.color && (
              <div
                className="w-16 h-16 rounded-lg shadow-inner flex-shrink-0 border border-white/10"
                style={{ backgroundColor: selectedProduct.color }}
              />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-white text-lg">
                {selectedProduct.name}
              </h4>
              <p className="text-sm text-gray-300 mt-1">
                {selectedProduct.finish && `${selectedProduct.finish} • `}
                {selectedProduct.laborHours}h {t('products.specifications.labor')}
                {selectedProduct.warranty && ` • ${selectedProduct.warranty} ${t('products.specifications.warranty')}`}
              </p>
              <p className="text-xl font-bold text-atlas-gold mt-2">
                {formatCurrency(selectedProduct.price)}
              </p>
            </div>
            <button
              onClick={() => setConfiguration(category, null)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {t('products.remove')}
            </button>
          </div>

          {/* Included items */}
          {selectedProduct.includes && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-2">{t('products.specifications.included')}:</p>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.includes.map((item, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={selectedProduct?.id === product.id}
            onSelect={handleSelect}
            type={category}
          />
        ))}
      </div>

      {/* Info note */}
      <div className="mt-8 flex items-start gap-3 text-sm text-gray-500 bg-black/20 p-4 rounded-lg">
        <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-atlas-gold" />
        <p>
          {t('products.details')}
        </p>
      </div>
    </div>
  )
}

export default ProductSelector
