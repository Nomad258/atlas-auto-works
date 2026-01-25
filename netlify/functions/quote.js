// Quote Calculator Netlify Function
// Calculates detailed pricing for configurations

const LABOR_RATE = 350; // MAD per hour
const TAX_RATE = 0.20; // 20% VAT

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { items, vehicle, rushOrder } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No items provided' }),
      };
    }

    let subtotal = 0;
    let totalLaborHours = 0;
    const lineItems = [];

    items.forEach(item => {
      const itemTotal = item.price || 0;
      const laborHours = item.laborHours || 0;

      subtotal += itemTotal;
      totalLaborHours += laborHours;

      lineItems.push({
        sku: item.sku,
        name: item.name,
        category: item.category,
        price: itemTotal,
        laborHours: laborHours,
        laborCost: laborHours * LABOR_RATE,
      });
    });

    const laborCost = totalLaborHours * LABOR_RATE;
    const rushFee = rushOrder ? (subtotal + laborCost) * 0.25 : 0;
    const subtotalWithLabor = subtotal + laborCost + rushFee;
    const tax = subtotalWithLabor * TAX_RATE;
    const total = subtotalWithLabor + tax;

    // Estimate completion time
    const workDays = Math.ceil(totalLaborHours / 8);
    const bufferDays = rushOrder ? 2 : 5;
    const estimatedDays = workDays + bufferDays;

    const quote = {
      id: `QT-${Date.now()}`,
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      vehicle: vehicle || {},
      lineItems,
      summary: {
        partsSubtotal: subtotal,
        laborHours: totalLaborHours,
        laborRate: LABOR_RATE,
        laborCost: laborCost,
        rushFee: rushFee,
        subtotal: subtotalWithLabor,
        taxRate: TAX_RATE,
        tax: tax,
        total: total,
        currency: 'MAD',
      },
      timeline: {
        estimatedDays: estimatedDays,
        rushOrder: rushOrder || false,
        workDays: workDays,
      },
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(quote),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to calculate quote' }),
    };
  }
};
