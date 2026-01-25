// VIN Decoder Netlify Function
// Simulates AI-powered VIN decoding with realistic car data

const carDatabase = {
  // BMW - Complete 17-character VINs
  'WBAPH5C55BA': { make: 'BMW', model: '328i', year: 2011, baseColor: '#1C1C1C', bodyStyle: 'Sedan', engine: '3.0L I6' },
  'WBAPH5C55BA012345': { make: 'BMW', model: '328i', year: 2011, baseColor: '#1C1C1C', bodyStyle: 'Sedan', engine: '3.0L I6' },
  'WBA8E9C50GK': { make: 'BMW', model: 'M3', year: 2016, baseColor: '#FFFFFF', bodyStyle: 'Sedan', engine: '3.0L Twin-Turbo I6' },
  'WBA8E9C50GK234567': { make: 'BMW', model: 'M3', year: 2016, baseColor: '#FFFFFF', bodyStyle: 'Sedan', engine: '3.0L Twin-Turbo I6' },
  'WBSWD935': { make: 'BMW', model: 'M4', year: 2023, baseColor: '#0066B1', bodyStyle: 'Coupe', engine: '3.0L Twin-Turbo I6' },
  'WBSWD9350PS123456': { make: 'BMW', model: 'M4', year: 2023, baseColor: '#0066B1', bodyStyle: 'Coupe', engine: '3.0L Twin-Turbo I6' },

  // Mercedes - Complete VINs
  'WDDGF81X': { make: 'Mercedes-Benz', model: 'C63 AMG', year: 2022, baseColor: '#1C1C1C', bodyStyle: 'Sedan', engine: '4.0L Twin-Turbo V8' },
  'WDDGF81X5NF123456': { make: 'Mercedes-Benz', model: 'C63 AMG', year: 2022, baseColor: '#1C1C1C', bodyStyle: 'Sedan', engine: '4.0L Twin-Turbo V8' },
  'WDC0G4KB': { make: 'Mercedes-Benz', model: 'GLE 450', year: 2023, baseColor: '#FFFFFF', bodyStyle: 'SUV', engine: '3.0L Turbo I6' },
  'WDDWJ8EB': { make: 'Mercedes-Benz', model: 'E-Class', year: 2021, baseColor: '#2C2C2C', bodyStyle: 'Sedan', engine: '2.0L Turbo I4' },

  // Porsche - Complete VINs (Top examples)
  'WP0AB2A7': { make: 'Porsche', model: '911 Carrera', year: 2023, baseColor: '#C0C0C0', bodyStyle: 'Coupe', engine: '3.0L Twin-Turbo Flat-6' },
  'WP0AB2A79PS167890': { make: 'Porsche', model: '911 Carrera', year: 2023, baseColor: '#C0C0C0', bodyStyle: 'Coupe', engine: '3.0L Twin-Turbo Flat-6' },
  'WP1AA2AY': { make: 'Porsche', model: 'Cayenne', year: 2022, baseColor: '#1C1C1C', bodyStyle: 'SUV', engine: '3.0L Turbo V6' },
  'WP1AA2AY4MLA12345': { make: 'Porsche', model: 'Cayenne', year: 2022, baseColor: '#1C1C1C', bodyStyle: 'SUV', engine: '3.0L Turbo V6' },
  'WP0CA2A8': { make: 'Porsche', model: '718 Cayman', year: 2023, baseColor: '#FF0000', bodyStyle: 'Coupe', engine: '2.0L Turbo Flat-4' },
  'WP0CA2A88NS123456': { make: 'Porsche', model: '718 Cayman', year: 2023, baseColor: '#FF0000', bodyStyle: 'Coupe', engine: '2.0L Turbo Flat-4' },

  // Audi - Complete VINs
  'WAUDFAFL': { make: 'Audi', model: 'RS6 Avant', year: 2023, baseColor: '#2C2C2C', bodyStyle: 'Wagon', engine: '4.0L Twin-Turbo V8' },
  'WAUDFAFL5PA123456': { make: 'Audi', model: 'RS6 Avant', year: 2023, baseColor: '#2C2C2C', bodyStyle: 'Wagon', engine: '4.0L Twin-Turbo V8' },
  'WAUZZZF1': { make: 'Audi', model: 'R8', year: 2022, baseColor: '#B22222', bodyStyle: 'Coupe', engine: '5.2L V10' },
  'WAUZZZF15MA234567': { make: 'Audi', model: 'R8', year: 2022, baseColor: '#B22222', bodyStyle: 'Coupe', engine: '5.2L V10' },
  'WAUENAF4': { make: 'Audi', model: 'A6', year: 2023, baseColor: '#FFFFFF', bodyStyle: 'Sedan', engine: '3.0L Turbo V6' },

  // Range Rover
  'SALGS2SE': { make: 'Land Rover', model: 'Range Rover Sport', year: 2023, baseColor: '#1C1C1C', bodyStyle: 'SUV', engine: '3.0L Turbo I6' },
  'SALGS2SE5PA123456': { make: 'Land Rover', model: 'Range Rover Sport', year: 2023, baseColor: '#1C1C1C', bodyStyle: 'SUV', engine: '3.0L Turbo I6' },
  'SALWR2RU': { make: 'Land Rover', model: 'Range Rover', year: 2024, baseColor: '#FFFFFF', bodyStyle: 'SUV', engine: '4.4L Twin-Turbo V8' },

  // Lamborghini - Complete VINs
  'ZHWUC1ZF': { make: 'Lamborghini', model: 'Huracán', year: 2023, baseColor: '#FFD700', bodyStyle: 'Coupe', engine: '5.2L V10' },
  'ZHWUC1ZF5PLA12345': { make: 'Lamborghini', model: 'Huracán', year: 2023, baseColor: '#FFD700', bodyStyle: 'Coupe', engine: '5.2L V10' },
  'ZHWUR1ZF': { make: 'Lamborghini', model: 'Urus', year: 2023, baseColor: '#FF6B00', bodyStyle: 'SUV', engine: '4.0L Twin-Turbo V8' },

  // Ferrari
  'ZFF76ZFA': { make: 'Ferrari', model: '488 GTB', year: 2019, baseColor: '#FF2800', bodyStyle: 'Coupe', engine: '3.9L Twin-Turbo V8' },
  'ZFF82CLA': { make: 'Ferrari', model: 'Roma', year: 2023, baseColor: '#1C1C1C', bodyStyle: 'Coupe', engine: '3.9L Twin-Turbo V8' },
  'ZFF82CLA5NA123456': { make: 'Ferrari', model: 'Roma', year: 2023, baseColor: '#1C1C1C', bodyStyle: 'Coupe', engine: '3.9L Twin-Turbo V8' },
};

function decodeVIN(vin) {
  // Normalize VIN
  const cleanVIN = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Validate VIN length (standard VINs are 17 characters, but we accept 8+ for demo)
  if (cleanVIN.length < 8) {
    return { error: 'VIN invalide: Minimum 8 caractères requis' };
  }

  if (cleanVIN.length > 17) {
    return { error: 'VIN invalide: Maximum 17 caractères' };
  }

  // Check for invalid characters (VINs don't use I, O, Q to avoid confusion)
  if (/[IOQ]/.test(cleanVIN)) {
    return { error: 'VIN invalide: Les lettres I, O, Q ne sont pas autorisées' };
  }

  // Try to match against database using prefix (8 characters)
  const prefix = cleanVIN.substring(0, 8);
  let carData = carDatabase[prefix];

  // If no exact match, use AI simulation to generate realistic data
  if (!carData) {
    carData = generateCarFromVIN(cleanVIN);
  }

  return {
    vin: cleanVIN,
    ...carData,
    decoded: true,
    timestamp: new Date().toISOString(),
  };
}

function generateCarFromVIN(vin) {
  // Simulate AI-powered VIN analysis
  const manufacturers = {
    'W': ['BMW', 'Volkswagen', 'Mercedes-Benz', 'Audi', 'Porsche'],
    'S': ['Land Rover', 'Jaguar', 'Aston Martin'],
    'Z': ['Ferrari', 'Lamborghini', 'Maserati'],
    'J': ['Toyota', 'Honda', 'Nissan', 'Mazda', 'Lexus'],
    '1': ['Chevrolet', 'Ford', 'Cadillac'],
    '2': ['Ford', 'Lincoln'],
    '3': ['Ford', 'Mazda'],
    '5': ['Honda', 'Hyundai', 'Toyota'],
  };

  const firstChar = vin.charAt(0);
  const possibleMakes = manufacturers[firstChar] || ['Generic Motors'];
  const make = possibleMakes[Math.floor(Math.random() * possibleMakes.length)];

  const modelsByMake = {
    'BMW': ['3 Series', '5 Series', 'X5', 'M4', 'i8'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLE', 'AMG GT'],
    'Audi': ['A4', 'A6', 'Q7', 'RS7', 'R8'],
    'Porsche': ['911', 'Cayenne', 'Panamera', 'Taycan', 'Macan'],
    'Land Rover': ['Range Rover', 'Range Rover Sport', 'Defender', 'Discovery'],
    'Ferrari': ['488', 'Roma', 'Portofino', 'SF90'],
    'Lamborghini': ['Huracán', 'Urus', 'Aventador'],
    'Toyota': ['Supra', 'Land Cruiser', 'Camry'],
    'Honda': ['Civic Type R', 'NSX', 'Accord'],
  };

  const models = modelsByMake[make] || ['Sedan', 'Coupe', 'SUV'];
  const model = models[Math.floor(Math.random() * models.length)];

  const currentYear = new Date().getFullYear();
  const year = currentYear - Math.floor(Math.random() * 5);

  const colors = ['#1C1C1C', '#FFFFFF', '#C0C0C0', '#2C2C2C', '#0066B1', '#B22222'];
  const baseColor = colors[Math.floor(Math.random() * colors.length)];

  const bodyStyles = ['Sedan', 'Coupe', 'SUV', 'Wagon', 'Convertible'];
  const bodyStyle = bodyStyles[Math.floor(Math.random() * bodyStyles.length)];

  return {
    make,
    model,
    year,
    baseColor,
    bodyStyle,
    engine: 'Performance Engine',
  };
}

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

  try {
    let vin;

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      vin = body.vin;
    } else {
      vin = event.queryStringParameters?.vin;
    }

    if (!vin) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'VIN is required' }),
      };
    }

    const result = decodeVIN(vin);

    if (result.error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify(result),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to decode VIN' }),
    };
  }
};
