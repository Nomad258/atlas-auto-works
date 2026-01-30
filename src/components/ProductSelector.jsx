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

function ProductCard({ product, isSelected, onSelect, type, onHover, onLeave }) {
  const { t, formatCurrency } = useTranslation()

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => onHover && onHover(product)}
      onMouseLeave={() => onLeave && onLeave()}
      className={`
        relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer group
        ${isSelected
          ? 'border-atlas-gold bg-atlas-gold/10 scale-[1.02] shadow-[0_0_20px_rgba(196,166,97,0.2)]'
          : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]'}
      `}
    >
      <div className="p-4">
        {/* Product Image or Color Swatch */}
        {product.image ? (
          <div className="relative w-full h-32 rounded-lg mb-4 overflow-hidden bg-black/50">
            <img
              src={`/products/${type}/${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                // If image fails, show gradient placeholder
                e.target.style.display = 'none'
                const parent = e.target.parentElement
                if (product.color) {
                  parent.style.backgroundColor = product.color
                } else {
                  parent.classList.add('bg-gradient-to-br', 'from-white/10', 'to-white/0')
                  parent.innerHTML = `<span class="text-white/30 text-xs tracking-widest uppercase">${product.type || type}</span>`
                  parent.classList.add('flex', 'items-center', 'justify-center')
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
          </div>
        ) : (type === 'paints' || type === 'wraps') && product.color ? (
          <div
            className="w-full h-32 rounded-lg mb-4 shadow-inner flex-shrink-0 border border-white/5"
            style={{ backgroundColor: product.color }}
          />
        ) : (
          <div className={`w-full h-32 rounded-lg mb-4 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden ${
            type === 'wheels' ? 'bg-gradient-to-br from-zinc-800 to-zinc-900' :
            type === 'bodykits' ? 'bg-gradient-to-br from-slate-800 to-slate-900' :
            type === 'accessories' ? 'bg-gradient-to-br from-amber-900/30 to-zinc-900' :
            type === 'interior' ? 'bg-gradient-to-br from-red-900/30 to-zinc-900' :
            type === 'starlight' ? 'bg-gradient-to-br from-indigo-900/40 to-zinc-900' :
            'bg-gradient-to-br from-white/5 to-white/0'
          }`}>
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: type === 'starlight' 
                  ? 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px), radial-gradient(circle at 50% 50%, white 1px, transparent 1px)'
                  : 'none',
                backgroundSize: '30px 30px'
              }} />
            </div>
            <span className="text-white/40 text-xs tracking-widest uppercase font-medium">{product.type || type}</span>
            {product.size && <span className="text-white/20 text-[10px] mt-1">{product.size}</span>}
            {product.stars && <span className="text-atlas-gold/50 text-[10px] mt-1">★ {product.stars} stars</span>}
          </div>
        )}

        {/* Product info */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <h4 className="font-bold text-white leading-tight">
            {product.name}
          </h4>
          {isSelected && <div className="text-atlas-gold bg-atlas-gold/20 p-1 rounded-full"><Check className="w-3 h-3" /></div>}
        </div>

        <div className="space-y-1 mb-4">
          {product.finish && (
            <p className="text-xs text-gray-500 capitalize">{product.finish}</p>
          )}
          {product.warranty && (
            <span className="inline-block px-1.5 py-0.5 bg-atlas-gold/10 text-atlas-gold text-[10px] font-bold tracking-wide rounded uppercase">
              {product.warranty}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between mt-auto border-t border-white/5 pt-3">
          <span className="text-atlas-gold font-bold text-lg font-display">
            {formatCurrency(product.price)}
          </span>
          <div className="text-right">
            <span className="text-[10px] text-gray-500 block uppercase tracking-wider">{product.laborHours}h {t('products.specifications.labor')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ColorSwatches({ products, selectedId, onSelect, onHover, onLeave }) {
  return (
    <div className="flex flex-wrap gap-3 mb-8 bg-black/20 p-4 rounded-2xl border border-white/5">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onSelect(product)}
          onMouseEnter={() => onHover && onHover(product)}
          onMouseLeave={() => onLeave && onLeave()}
          className={`
            w-12 h-12 rounded-full cursor-pointer transition-all duration-300 border-2 relative
            ${selectedId === product.id
              ? 'border-atlas-gold scale-110 shadow-[0_0_15px_rgba(196,166,97,0.5)] z-10'
              : 'border-transparent hover:scale-110 hover:border-white/30 hover:z-10'}
          `}
          style={{ backgroundColor: product.color }}
          title={product.name}
        >
          {selectedId === product.id && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check className="w-6 h-6 text-white drop-shadow-md" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

function ProductSelector({ category, products, title, description, showSwatches = false }) {
  const {
    configuration,
    setConfiguration,
    setCarColor,
    setWheelColor,
    setWheelProductId,
    setBodykitProductId,
    setInteriorProductId,
    setInteriorColor,
    setStarlightProductId,
    addAccessoryProductId,
    removeAccessoryProductId,
    setWindowTintLevel,
    setPreview,
    clearPreview
  } = useStore()
  const { t, formatCurrency } = useTranslation()

  // Handle hover preview
  const handleMouseEnter = (product) => {
    if (category === 'paints' || category === 'wraps') {
      if (product.color) {
        setPreview('paint', product.color)
      }
    }
    if (category === 'wheels') {
      const finishMap = {
        'Gloss Black': '#1a1a1a',
        'Satin Black': '#1a1a1a',
        'Brushed Bronze': '#8B7355',
        'Machined Silver': '#C0C0C0',
        'Polished Chrome': '#E8E8E8',
        'Carbon Weave': '#2a2a2a'
      }
      const color = finishMap[product.finish] || '#4a4a4a'
      setPreview('wheels', color)
    }
  }

  const handleMouseLeave = () => {
    clearPreview()
  }

  const selectedProduct = configuration[category]

  const handleSelect = (product) => {
    if (selectedProduct?.id === product.id) {
      setConfiguration(category, null)
      return
    }

    setConfiguration(category, product)

    if (category === 'paints' || category === 'wraps') {
      if (product.color) {
        setCarColor(product.color)
      }
    }

    if (category === 'wheels') {
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
      setWheelProductId(product.id)
    }

    if (category === 'bodykits') setBodykitProductId(product.id)

    if (category === 'interior') {
      setInteriorProductId(product.id)
      // Apply interior color based on product type
      const interiorColors = {
        'Complete': '#8B4513',    // Tan leather
        'Sport': '#1A1A1A',       // Black alcantara
        'Trim': '#2C2C2C',        // Carbon fiber dark
        'Steering': '#1A1A1A',    // Black
        'Lighting': null,         // No color change
        'Accessories': '#1A1A1A'  // Black
      }
      if (product.type && interiorColors[product.type]) {
        setInteriorColor(interiorColors[product.type])
      }
    }

    if (category === 'starlight') setStarlightProductId(product.id)

    if (category === 'accessories') {
      addAccessoryProductId(product.id)
      // Handle window tint specially
      if (product.name?.toLowerCase().includes('window tint') || product.type === 'Tint') {
        // Default to medium tint (35% = 0.35 opacity)
        setWindowTintLevel(0.35)
      }
    }
  }

  const handleDeselect = () => {
    setConfiguration(category, null)
    if (category === 'wheels') setWheelProductId(null)
    if (category === 'bodykits') setBodykitProductId(null)
    if (category === 'interior') setInteriorProductId(null)
    if (category === 'starlight') setStarlightProductId(null)
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
        <h3 className="font-display text-3xl font-bold text-white mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
        )}
      </div>

      {showSwatches && (
        <ColorSwatches
          products={products}
          selectedId={selectedProduct?.id}
          onSelect={handleSelect}
          onHover={handleMouseEnter}
          onLeave={handleMouseLeave}
        />
      )}

      {selectedProduct && selectedProduct.category !== 'paints' && (
        <div className="mb-8 p-6 bg-gradient-to-br from-atlas-gold/20 to-transparent rounded-2xl border border-atlas-gold/20 relative overflow-hidden backdrop-blur-sm">
          <div className="flex items-start gap-4 relative z-10">
            <div className="flex-1">
              <div className="text-atlas-gold text-xs font-bold tracking-widest uppercase mb-1">{t('nav.currentBuild')}</div>
              <h4 className="font-bold text-white text-xl">
                {selectedProduct.name}
              </h4>
              <p className="text-3xl font-display font-bold text-atlas-gold mt-2">
                {formatCurrency(selectedProduct.price)}
              </p>
            </div>
            <button
              onClick={handleDeselect}
              className="text-xs font-bold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors border border-white/5"
            >
              {t('products.remove')}
            </button>
          </div>
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
            onHover={handleMouseEnter}
            onLeave={handleMouseLeave}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductSelector
