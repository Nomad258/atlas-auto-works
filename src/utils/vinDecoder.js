// Car Database for VIN Decoding (Simulation)
const carDatabase = {
    // BMW
    'WBAPH5C55BA': { make: 'BMW', model: '328i', year: 2011, baseColor: '#1C1C1C', bodyStyle: 'Sedan', engine: '3.0L I6' },
    'WBA8E9C50GK': { make: 'BMW', model: 'M3', year: 2016, baseColor: '#FFFFFF', bodyStyle: 'Sedan', engine: '3.0L Twin-Turbo I6' },
    'WBSWD935': { make: 'BMW', model: 'M4', year: 2023, baseColor: '#0066B1', bodyStyle: 'Coupe', engine: '3.0L Twin-Turbo I6' },

    // Mercedes
    'WDDGF81X': { make: 'Mercedes-Benz', model: 'C63 AMG', year: 2022, baseColor: '#1C1C1C', bodyStyle: 'Sedan', engine: '4.0L Twin-Turbo V8' },
    'WDC0G4KB': { make: 'Mercedes-Benz', model: 'GLE 450', year: 2023, baseColor: '#FFFFFF', bodyStyle: 'SUV', engine: '3.0L Turbo I6' },

    // Porsche
    'WP0AB2A7': { make: 'Porsche', model: '911 Carrera', year: 2023, baseColor: '#C0C0C0', bodyStyle: 'Coupe', engine: '3.0L Twin-Turbo Flat-6' },
    'WP1AA2AY': { make: 'Porsche', model: 'Cayenne', year: 2022, baseColor: '#1C1C1C', bodyStyle: 'SUV', engine: '3.0L Turbo V6' },

    // Audi
    'WAUDFAFL': { make: 'Audi', model: 'RS6 Avant', year: 2023, baseColor: '#2C2C2C', bodyStyle: 'Wagon', engine: '4.0L Twin-Turbo V8' },
    'WAUZZZF1': { make: 'Audi', model: 'R8', year: 2022, baseColor: '#B22222', bodyStyle: 'Coupe', engine: '5.2L V10' },

    // Ferrari
    'ZFF76ZFA': { make: 'Ferrari', model: '488 GTB', year: 2019, baseColor: '#FF2800', bodyStyle: 'Coupe', engine: '3.9L Twin-Turbo V8' },

    // Lamborghini
    'ZHWUC1ZF': { make: 'Lamborghini', model: 'Huracán', year: 2023, baseColor: '#FFD700', bodyStyle: 'Coupe', engine: '5.2L V10' }
}

function generateCarFromVIN(vin) {
    const manufacturers = {
        'W': ['BMW', 'Volkswagen', 'Mercedes-Benz', 'Audi', 'Porsche'],
        'S': ['Land Rover', 'Jaguar', 'Aston Martin'],
        'Z': ['Ferrari', 'Lamborghini', 'Maserati'],
        'J': ['Toyota', 'Honda', 'Nissan', 'Mazda', 'Lexus'],
        '1': ['Chevrolet', 'Ford', 'Cadillac'],
    }

    const firstChar = vin.charAt(0)
    const possibleMakes = manufacturers[firstChar] || ['Generic Motors']
    const make = possibleMakes[Math.floor(Math.random() * possibleMakes.length)]

    const modelsByMake = {
        'BMW': ['3 Series', '5 Series', 'X5', 'M4', 'i8'],
        'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLE', 'AMG GT'],
        'Audi': ['A4', 'A6', 'Q7', 'RS7', 'R8'],
        'Porsche': ['911', 'Cayenne', 'Panamera', 'Taycan', 'Macan'],
        'Ferrari': ['488', 'Roma', 'Portofino', 'SF90'],
        'Lamborghini': ['Huracán', 'Urus', 'Aventador'],
    }

    const models = modelsByMake[make] || ['Sedan', 'Coupe', 'SUV']
    const model = models[Math.floor(Math.random() * models.length)]

    const colors = ['#1C1C1C', '#FFFFFF', '#C0C0C0', '#2C2C2C', '#0066B1', '#B22222']
    const baseColor = colors[Math.floor(Math.random() * colors.length)]

    const bodyStyles = ['Sedan', 'Coupe', 'SUV', 'Wagon', 'Convertible']
    const bodyStyle = bodyStyles[Math.floor(Math.random() * bodyStyles.length)]

    return {
        make,
        model,
        year: new Date().getFullYear() - Math.floor(Math.random() * 5),
        baseColor,
        bodyStyle,
        engine: 'Performance Engine',
    }
}

export function decodeVIN(vin) {
    // Normalize VIN
    const cleanVIN = vin.toUpperCase().replace(/[^A-Z0-9]/g, '')

    if (cleanVIN.length < 8) throw new Error('Le VIN doit comporter au moins 8 caractères')

    // Look up
    const prefix = cleanVIN.substring(0, 8)
    // Check exact match first, then prefix match
    let carData = Object.entries(carDatabase).find(([key]) => cleanVIN.startsWith(key))?.[1]

    if (!carData && carDatabase[prefix]) {
        carData = carDatabase[prefix]
    }

    // Fallback to generator
    if (!carData) {
        carData = generateCarFromVIN(cleanVIN)
    }

    return {
        vin: cleanVIN,
        ...carData,
        decoded: true,
        timestamp: new Date().toISOString(),
    }
}
