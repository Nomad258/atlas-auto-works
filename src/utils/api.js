
import { supabase } from './supabaseClient'
import { decodeVIN as localDecodeVIN } from './vinDecoder'
import productsData from '../../netlify/functions/products.js?raw' // Fallback import method if needed, but we'll use DB 

// We can still parse the raw products file if DB fails, or use a hardcoded fallback
// But ideally we use Supabase

export async function decodeVIN(vin) {
  // Use client-side logic to avoid API dependency
  return localDecodeVIN(vin)
}

export async function getProducts(category = null) {
  if (!supabase) {
    console.warn('Supabase not configured. Using fallback data.')
    // In a real app we might import local JSON here
    return { products: [] }
  }

  let query = supabase.from('products').select('*')

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Supabase error fetching products:', error)
    throw new Error(error.message)
  }

  // Normalize data (snake_case to camelCase)
  const normalizedData = data.map(item => ({
    ...item,
    laborHours: item.labor_hours, // Map snake_case from DB to camelCase for UI
    id: item.id, // Ensure ID is available
  }))

  // Transform array to object by category if no specific category requested (to match expected format)
  if (!category) {
    const grouped = normalizedData.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {})
    return { products: grouped }
  }

  return { products: normalizedData }
}

export async function calculateQuote(items, vehicle, rushOrder = false) {
  // Calculate locally to avoid round trip, or use a Netlify function if logic is secret
  // For now, local calculation is faster and easier for this request

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

  // Save quote to DB if vehicle included? 
  // Let's just return the object for now

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
      estimatedDays: Math.ceil(laborHours / 8) + (rushOrder ? 0 : 2) // Simple logic
    }
  }
}

export async function getAvailability(locationId, date) {
  // Check bookings count in DB for that date
  if (!supabase) return { availableSlots: generateTimeSlots() }

  const { data, error } = await supabase
    .from('bookings')
    .select('time')
    .eq('location_id', locationId)
    .eq('date', date)

  if (error) {
    console.error('Error checking availability:', error)
    return { availableSlots: generateTimeSlots() } // Fail open
  }

  const bookedTimes = data.map(b => b.time)
  const allSlots = generateTimeSlots()
  const availableSlots = allSlots.filter(t => !bookedTimes.includes(t))

  return { availableSlots }
}

function generateTimeSlots() {
  return [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ]
}

export async function createBooking(bookingData) {
  if (!supabase) {
    console.warn('Supabase not configured. Simulating booking.')
    return { id: 'SIMULATED-' + Date.now(), ...bookingData, status: 'pending' }
  }

  // Flatten the object for DB
  const dbData = {
    location_id: bookingData.locationId,
    date: bookingData.date,
    time: bookingData.time,
    customer_name: bookingData.customer.name,
    customer_email: bookingData.customer.email,
    customer_phone: bookingData.customer.phone,
    vehicle_info: bookingData.vehicle,
    quote_id: bookingData.quoteId,
    status: 'pending'
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert(dbData)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Format currency
export function formatCurrency(amount, currency = 'MAD') {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD', // Force MAD for consistency as per requets
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
export function formatDate(dateString, format = 'long') {
  // Support Date objects or strings
  const date = typeof dateString === 'object' ? dateString : new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: format === 'long' ? 'long' : 'short',
    year: 'numeric',
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
  }).format(date)
}
