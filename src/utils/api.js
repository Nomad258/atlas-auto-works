import { decodeVIN as localDecodeVIN } from './vinDecoder'

// API base URL - uses Netlify functions
const API_BASE = '/.netlify/functions'

export async function decodeVIN(vin) {
  return localDecodeVIN(vin)
}

export async function getProducts(category = null) {
  try {
    let url = `${API_BASE}/products`
    if (category) {
      url += `?category=${encodeURIComponent(category)}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data

  } catch (err) {
    console.error('Error fetching products:', err)
    return { products: {} }
  }
}

export async function calculateQuote(items, vehicle, rushOrder = false) {
  const partsSubtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)

  const laborRate = 350 // MAD/hour
  const laborHours = items.reduce((sum, item) => sum + (Number(item.labor_hours || item.laborHours) || 0), 0)
  const laborCost = laborHours * laborRate

  let subtotal = partsSubtotal + laborCost
  let rushFee = 0

  if (rushOrder) {
    rushFee = subtotal * 0.25
  }

  const taxableAmount = subtotal + rushFee
  const tax = taxableAmount * 0.20 // 20% VAT
  const total = taxableAmount + tax

  return {
    id: 'Q-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    items,
    vehicle,
    summary: {
      partsSubtotal,
      laborHours,
      laborRate,
      laborCost,
      rushFee,
      tax,
      total
    },
    timeline: {
      estimatedDays: Math.ceil(laborHours / 8) + (rushOrder ? 0 : 2)
    }
  }
}

export async function getAvailability(locationId, date) {
  try {
    const response = await fetch(`${API_BASE}/booking?action=availability&locationId=${encodeURIComponent(locationId)}&date=${encodeURIComponent(date)}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.error('Error checking availability:', err)
    // Return default slots as fallback
    return {
      availableSlots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']
    }
  }
}

export async function createBooking(bookingData) {
  try {
    const response = await fetch(`${API_BASE}/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (err) {
    console.error('Error creating booking:', err)
    throw new Error('Échec de la réservation')
  }
}

// Format currency
export function formatCurrency(amount, currency = 'MAD') {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString, format = 'long') {
  const date = typeof dateString === 'object' ? dateString : new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: format === 'long' ? 'long' : 'short',
    year: 'numeric',
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
  }).format(date)
}
