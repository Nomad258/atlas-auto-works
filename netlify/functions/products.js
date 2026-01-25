// Products Catalog Netlify Function
// Returns all available customization products with SKUs and pricing

const products = {
  paints: [
    { id: 'p001', sku: 'AAW-PNT-001', name: 'Sahara Gold Metallic', category: 'paints', color: '#C9A961', price: 4500, currency: 'MAD', laborHours: 24, image: 'sahara-gold.jpg' },
    { id: 'p002', sku: 'AAW-PNT-002', name: 'Atlas Burgundy Pearl', category: 'paints', color: '#6B1D2D', price: 5200, currency: 'MAD', laborHours: 28, image: 'atlas-burgundy.jpg' },
    { id: 'p003', sku: 'AAW-PNT-003', name: 'Midnight Casablanca', category: 'paints', color: '#0D1B2A', price: 4800, currency: 'MAD', laborHours: 26, image: 'midnight-casa.jpg' },
    { id: 'p004', sku: 'AAW-PNT-004', name: 'Marrakech Sunset Orange', category: 'paints', color: '#E85D04', price: 5500, currency: 'MAD', laborHours: 30, image: 'marrakech-sunset.jpg' },
    { id: 'p005', sku: 'AAW-PNT-005', name: 'Mediterranean Blue', category: 'paints', color: '#0077B6', price: 4600, currency: 'MAD', laborHours: 24, image: 'med-blue.jpg' },
    { id: 'p006', sku: 'AAW-PNT-006', name: 'Ceramic White Pearl', category: 'paints', color: '#F8F9FA', price: 4200, currency: 'MAD', laborHours: 22, image: 'ceramic-white.jpg' },
    { id: 'p007', sku: 'AAW-PNT-007', name: 'Obsidian Black', category: 'paints', color: '#1A1A2E', price: 4000, currency: 'MAD', laborHours: 20, image: 'obsidian-black.jpg' },
    { id: 'p008', sku: 'AAW-PNT-008', name: 'Desert Storm Grey', category: 'paints', color: '#6C757D', price: 4300, currency: 'MAD', laborHours: 24, image: 'desert-grey.jpg' },
  ],

  wraps: [
    { id: 'w001', sku: 'AAW-WRP-001', name: 'Satin Khaki Green', category: 'wraps', color: '#4A5D23', finish: 'Satin', price: 18000, currency: 'MAD', laborHours: 32, warranty: '5 years', image: 'satin-khaki.jpg' },
    { id: 'w002', sku: 'AAW-WRP-002', name: 'Gloss Midnight Purple', category: 'wraps', color: '#2D1B4E', finish: 'Gloss', price: 20000, currency: 'MAD', laborHours: 35, warranty: '5 years', image: 'gloss-purple.jpg' },
    { id: 'w003', sku: 'AAW-WRP-003', name: 'Matte Nardo Grey', category: 'wraps', color: '#6E6E6E', finish: 'Matte', price: 22000, currency: 'MAD', laborHours: 36, warranty: '5 years', image: 'matte-grey.jpg' },
    { id: 'w004', sku: 'AAW-WRP-004', name: 'Chrome Rose Gold', category: 'wraps', color: '#E8B4B8', finish: 'Chrome', price: 35000, currency: 'MAD', laborHours: 45, warranty: '3 years', image: 'chrome-rose.jpg' },
    { id: 'w005', sku: 'AAW-WRP-005', name: 'Satin Ocean Teal', category: 'wraps', color: '#008B8B', finish: 'Satin', price: 19500, currency: 'MAD', laborHours: 33, warranty: '5 years', image: 'satin-teal.jpg' },
    { id: 'w006', sku: 'AAW-WRP-006', name: 'Matte Military Green', category: 'wraps', color: '#3D4F2F', finish: 'Matte', price: 21000, currency: 'MAD', laborHours: 35, warranty: '5 years', image: 'matte-military.jpg' },
    { id: 'w007', sku: 'AAW-WRP-007', name: 'Gloss Racing Red', category: 'wraps', color: '#C41E3A', finish: 'Gloss', price: 18500, currency: 'MAD', laborHours: 32, warranty: '5 years', image: 'gloss-red.jpg' },
    { id: 'w008', sku: 'AAW-WRP-008', name: 'Satin Pearl White', category: 'wraps', color: '#F5F5F5', finish: 'Satin', price: 17500, currency: 'MAD', laborHours: 30, warranty: '5 years', image: 'satin-white.jpg' },
  ],

  bodykits: [
    { id: 'b001', sku: 'AAW-BDK-001', name: 'Atlas Aero Package', category: 'bodykits', type: 'Full Kit', price: 85000, currency: 'MAD', laborHours: 48, includes: ['Front bumper', 'Side skirts', 'Rear diffuser', 'Spoiler'], image: 'aero-package.jpg' },
    { id: 'b002', sku: 'AAW-BDK-002', name: 'Sport Front Bumper', category: 'bodykits', type: 'Front', price: 25000, currency: 'MAD', laborHours: 12, includes: ['Front bumper', 'Lip spoiler'], image: 'sport-bumper.jpg' },
    { id: 'b003', sku: 'AAW-BDK-003', name: 'Wide Body Fenders', category: 'bodykits', type: 'Fenders', price: 45000, currency: 'MAD', laborHours: 24, includes: ['Front fenders +50mm', 'Rear fenders +60mm'], image: 'wide-fenders.jpg' },
    { id: 'b004', sku: 'AAW-BDK-004', name: 'Carbon Fiber Splitter', category: 'bodykits', type: 'Front', price: 15000, currency: 'MAD', laborHours: 6, includes: ['Front splitter'], image: 'carbon-splitter.jpg' },
    { id: 'b005', sku: 'AAW-BDK-005', name: 'GT Wing Spoiler', category: 'bodykits', type: 'Rear', price: 28000, currency: 'MAD', laborHours: 8, includes: ['Adjustable wing', 'Mounting brackets'], image: 'gt-wing.jpg' },
    { id: 'b006', sku: 'AAW-BDK-006', name: 'Side Skirt Extensions', category: 'bodykits', type: 'Side', price: 12000, currency: 'MAD', laborHours: 6, includes: ['Left skirt', 'Right skirt'], image: 'side-skirts.jpg' },
  ],

  wheels: [
    { id: 'r001', sku: 'AAW-WHL-001', name: 'Atlas Forged 21"', category: 'wheels', size: '21x9.5', finish: 'Gloss Black', price: 42000, currency: 'MAD', laborHours: 4, set: 4, image: 'forged-21.jpg' },
    { id: 'r002', sku: 'AAW-WHL-002', name: 'Sahara Flow Formed 20"', category: 'wheels', size: '20x9', finish: 'Brushed Bronze', price: 32000, currency: 'MAD', laborHours: 4, set: 4, image: 'flow-20.jpg' },
    { id: 'r003', sku: 'AAW-WHL-003', name: 'Marrakech Multi-Spoke 19"', category: 'wheels', size: '19x8.5', finish: 'Machined Silver', price: 28000, currency: 'MAD', laborHours: 4, set: 4, image: 'multi-spoke-19.jpg' },
    { id: 'r004', sku: 'AAW-WHL-004', name: 'Carbon Fiber Wheels 20"', category: 'wheels', size: '20x10', finish: 'Carbon Weave', price: 120000, currency: 'MAD', laborHours: 4, set: 4, image: 'carbon-20.jpg' },
    { id: 'r005', sku: 'AAW-WHL-005', name: 'Deep Dish Concave 22"', category: 'wheels', size: '22x10.5', finish: 'Satin Black', price: 55000, currency: 'MAD', laborHours: 4, set: 4, image: 'deep-dish-22.jpg' },
    { id: 'r006', sku: 'AAW-WHL-006', name: 'Classic 5-Spoke 19"', category: 'wheels', size: '19x8', finish: 'Polished Chrome', price: 36000, currency: 'MAD', laborHours: 4, set: 4, image: 'classic-5spoke.jpg' },
  ],

  interior: [
    { id: 'i001', sku: 'AAW-INT-001', name: 'Full Leather Retrim', category: 'interior', type: 'Complete', materials: ['Nappa Leather'], colors: ['Tan', 'Black', 'Red', 'White'], price: 65000, currency: 'MAD', laborHours: 72, image: 'leather-retrim.jpg' },
    { id: 'i002', sku: 'AAW-INT-002', name: 'Alcantara Sport Package', category: 'interior', type: 'Sport', materials: ['Alcantara', 'Carbon Fiber'], colors: ['Black', 'Grey'], price: 45000, currency: 'MAD', laborHours: 48, image: 'alcantara-sport.jpg' },
    { id: 'i003', sku: 'AAW-INT-003', name: 'Carbon Fiber Trim Set', category: 'interior', type: 'Trim', materials: ['Carbon Fiber'], price: 28000, currency: 'MAD', laborHours: 16, image: 'carbon-trim.jpg' },
    { id: 'i004', sku: 'AAW-INT-004', name: 'Custom Steering Wheel', category: 'interior', type: 'Steering', materials: ['Leather', 'Alcantara', 'Carbon Fiber'], price: 18000, currency: 'MAD', laborHours: 8, image: 'custom-wheel.jpg' },
    { id: 'i005', sku: 'AAW-INT-005', name: 'Ambient Lighting Kit', category: 'interior', type: 'Lighting', price: 8500, currency: 'MAD', laborHours: 12, image: 'ambient-lighting.jpg' },
    { id: 'i006', sku: 'AAW-INT-006', name: 'Custom Floor Mats', category: 'interior', type: 'Accessories', materials: ['Premium Carpet', 'Leather Binding'], price: 4500, currency: 'MAD', laborHours: 2, image: 'floor-mats.jpg' },
  ],

  starlight: [
    { id: 's001', sku: 'AAW-STR-001', name: 'Starlight Headliner - Standard', category: 'starlight', stars: 300, fiber: 'Standard', price: 25000, currency: 'MAD', laborHours: 24, image: 'starlight-standard.jpg' },
    { id: 's002', sku: 'AAW-STR-002', name: 'Starlight Headliner - Premium', category: 'starlight', stars: 800, fiber: 'Fiber Optic', price: 45000, currency: 'MAD', laborHours: 36, image: 'starlight-premium.jpg' },
    { id: 's003', sku: 'AAW-STR-003', name: 'Starlight Headliner - Galaxy', category: 'starlight', stars: 1500, fiber: 'RGB Fiber Optic', shooting: true, price: 75000, currency: 'MAD', laborHours: 48, image: 'starlight-galaxy.jpg' },
    { id: 's004', sku: 'AAW-STR-004', name: 'Constellation Package', category: 'starlight', stars: 2000, fiber: 'RGB Fiber Optic', shooting: true, constellations: true, price: 95000, currency: 'MAD', laborHours: 60, image: 'constellation.jpg' },
    { id: 's005', sku: 'AAW-STR-005', name: 'Door Panel Stars', category: 'starlight', stars: 200, fiber: 'Fiber Optic', price: 15000, currency: 'MAD', laborHours: 16, image: 'door-stars.jpg' },
  ],

  accessories: [
    { id: 'a001', sku: 'AAW-ACC-001', name: 'Performance Exhaust System', category: 'accessories', type: 'Exhaust', price: 35000, currency: 'MAD', laborHours: 8, image: 'exhaust-system.jpg' },
    { id: 'a002', sku: 'AAW-ACC-002', name: 'Sport Suspension Kit', category: 'accessories', type: 'Suspension', price: 28000, currency: 'MAD', laborHours: 16, image: 'suspension-kit.jpg' },
    { id: 'a003', sku: 'AAW-ACC-003', name: 'Big Brake Kit', category: 'accessories', type: 'Brakes', price: 45000, currency: 'MAD', laborHours: 12, image: 'brake-kit.jpg' },
    { id: 'a004', sku: 'AAW-ACC-004', name: 'Window Tint - Premium', category: 'accessories', type: 'Tint', price: 3500, currency: 'MAD', laborHours: 4, image: 'window-tint.jpg' },
    { id: 'a005', sku: 'AAW-ACC-005', name: 'Paint Protection Film', category: 'accessories', type: 'Protection', price: 25000, currency: 'MAD', laborHours: 24, image: 'ppf.jpg' },
    { id: 'a006', sku: 'AAW-ACC-006', name: 'Ceramic Coating', category: 'accessories', type: 'Protection', price: 12000, currency: 'MAD', laborHours: 16, image: 'ceramic-coating.jpg' },
  ],
};

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const category = event.queryStringParameters?.category;
  const search = event.queryStringParameters?.search?.toLowerCase();

  let result = products;

  if (category && products[category]) {
    result = { [category]: products[category] };
  }

  if (search) {
    const filtered = {};
    Object.entries(products).forEach(([cat, items]) => {
      const matches = items.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.sku.toLowerCase().includes(search)
      );
      if (matches.length > 0) {
        filtered[cat] = matches;
      }
    });
    result = filtered;
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      products: result,
      categories: Object.keys(products),
      laborRate: 350, // MAD per hour
      currency: 'MAD',
    }),
  };
};
