// Products Catalog Netlify Function
// Fetches products from Turso database using HTTP API

const TURSO_URL = process.env.TURSO_DATABASE_URL || process.env.VITE_TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN;

// Convert libsql:// to https:// for HTTP API
function getHttpUrl(url) {
  if (!url) return null;
  return url.replace('libsql://', 'https://');
}

// Execute SQL query via Turso HTTP API
async function executeQuery(sql, args = []) {
  const httpUrl = getHttpUrl(TURSO_URL);
  if (!httpUrl || !TURSO_TOKEN) {
    throw new Error('Turso credentials not configured');
  }

  const response = await fetch(`${httpUrl}/v2/pipeline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TURSO_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          type: 'execute',
          stmt: {
            sql,
            args: args.map(arg => ({ type: 'text', value: String(arg) })),
          },
        },
        { type: 'close' },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Turso API error: ${response.status} - ${text}`);
  }

  const data = await response.json();

  if (data.results && data.results[0] && data.results[0].response) {
    const result = data.results[0].response.result;
    if (result && result.rows) {
      // Map column names to values
      const cols = result.cols.map(c => c.name);
      return result.rows.map(row => {
        const obj = {};
        row.forEach((cell, i) => {
          obj[cols[i]] = cell.value;
        });
        return obj;
      });
    }
  }

  return [];
}

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

  try {
    const category = event.queryStringParameters?.category;
    const search = event.queryStringParameters?.search?.toLowerCase();

    let query = 'SELECT * FROM products';
    const params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    if (search) {
      if (category) {
        query += ' AND (LOWER(name) LIKE ? OR LOWER(sku) LIKE ?)';
      } else {
        query += ' WHERE (LOWER(name) LIKE ? OR LOWER(sku) LIKE ?)';
      }
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY category, name';

    const rows = await executeQuery(query, params);

    // Group products by category
    const products = {};
    const categories = new Set();

    for (const row of rows) {
      const cat = row.category;
      categories.add(cat);

      if (!products[cat]) {
        products[cat] = [];
      }

      // Build product object with proper field mapping
      const product = {
        id: row.id,
        sku: row.sku,
        name: row.name,
        category: row.category,
        price: Number(row.price),
        currency: row.currency || 'MAD',
        laborHours: Number(row.labor_hours),
        image: row.image,
      };

      // Add optional fields based on category
      if (row.color) product.color = row.color;
      if (row.finish) product.finish = row.finish;
      if (row.warranty) product.warranty = row.warranty;
      if (row.type) product.type = row.type;
      if (row.size) product.size = row.size;
      if (row.set_count) product.set = Number(row.set_count);
      if (row.stars) product.stars = Number(row.stars);
      if (row.fiber) product.fiber = row.fiber;
      if (row.shooting) product.shooting = Boolean(Number(row.shooting));
      if (row.constellations) product.constellations = Boolean(Number(row.constellations));

      // Parse JSON fields
      if (row.includes) {
        try {
          product.includes = JSON.parse(row.includes);
        } catch (e) {
          product.includes = [];
        }
      }
      if (row.materials) {
        try {
          product.materials = JSON.parse(row.materials);
        } catch (e) {
          product.materials = [];
        }
      }
      if (row.colors) {
        try {
          product.colors = JSON.parse(row.colors);
        } catch (e) {
          product.colors = [];
        }
      }

      products[cat].push(product);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        products,
        categories: Array.from(categories).sort(),
        laborRate: 350,
        currency: 'MAD',
        source: 'turso',
      }),
    };
  } catch (error) {
    console.error('Error fetching products from Turso:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch products',
        message: error.message,
      }),
    };
  }
};
