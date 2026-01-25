// Booking System Netlify Function
// Handles appointment scheduling

const locations = [
  {
    id: 'casa',
    name: 'Casablanca Flagship',
    address: '123 Boulevard Mohammed V, Casablanca',
    phone: '+212 522 123 456',
    hours: '09:00 - 18:00',
    timezone: 'Africa/Casablanca',
  },
  {
    id: 'marrakech',
    name: 'Marrakech Studio',
    address: '45 Avenue Mohammed VI, Guéliz, Marrakech',
    phone: '+212 524 987 654',
    hours: '09:00 - 18:00',
    timezone: 'Africa/Casablanca',
  },
  {
    id: 'tangier',
    name: 'Tangier Workshop',
    address: '78 Rue de Fès, Tangier',
    phone: '+212 539 456 789',
    hours: '09:00 - 18:00',
    timezone: 'Africa/Casablanca',
  },
];

// Simulate booked slots
const getBookedSlots = (locationId, date) => {
  const hash = (locationId + date).split('').reduce((a, b) => {
    return ((a << 5) - a) + b.charCodeAt(0);
  }, 0);

  const slots = [];
  const possibleSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  possibleSlots.forEach((slot, i) => {
    if ((hash + i) % 3 === 0) {
      slots.push(slot);
    }
  });

  return slots;
};

const getAvailableSlots = (locationId, date) => {
  const allSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  const booked = getBookedSlots(locationId, date);
  return allSlots.filter(slot => !booked.includes(slot));
};

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/booking', '');

  // GET /locations
  if (event.httpMethod === 'GET' && (path === '' || path === '/locations')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ locations }),
    };
  }

  // GET /availability?location=xxx&date=yyyy-mm-dd
  if (event.httpMethod === 'GET' && path === '/availability') {
    const { location, date } = event.queryStringParameters || {};

    if (!location || !date) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Location and date required' }),
      };
    }

    const available = getAvailableSlots(location, date);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        location,
        date,
        availableSlots: available,
        timezone: 'Africa/Casablanca',
      }),
    };
  }

  // POST /book
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { locationId, date, time, customer, quoteId, vehicle } = body;

      if (!locationId || !date || !time || !customer) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields' }),
        };
      }

      const location = locations.find(l => l.id === locationId);
      if (!location) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid location' }),
        };
      }

      const available = getAvailableSlots(locationId, date);
      if (!available.includes(time)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Time slot not available' }),
        };
      }

      const booking = {
        id: `BK-${Date.now()}`,
        confirmationCode: `AAW${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
        location: location,
        appointment: {
          date,
          time,
          datetime: `${date}T${time}:00`,
        },
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
        vehicle: vehicle || {},
        quoteId: quoteId || null,
      };

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(booking),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to create booking' }),
      };
    }
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Not found' }),
  };
};
