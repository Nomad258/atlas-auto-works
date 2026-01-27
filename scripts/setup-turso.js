import { createClient } from "@libsql/client";
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.VITE_TURSO_DATABASE_URL || "file:local.db";
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

const db = createClient({
    url,
    authToken,
});

async function main() {
    console.log('🛠 Setting up Turso Database at:', url);

    try {
        // 1. Create Tables
        await db.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        sku TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        price DECIMAL NOT NULL,
        currency TEXT DEFAULT 'MAD',
        labor_hours INTEGER DEFAULT 0,
        image_url TEXT,
        color TEXT,
        finish TEXT,
        warranty TEXT,
        includes TEXT, -- JSON string
        materials TEXT, -- JSON string
        colors TEXT, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await db.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        location_id TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        vehicle_info TEXT, -- JSON string
        quote_id TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await db.execute(`
      CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY,
        items TEXT NOT NULL, -- JSON string
        vehicle_info TEXT, -- JSON string
        total_parts DECIMAL NOT NULL,
        total_labor DECIMAL NOT NULL,
        rush_fee DECIMAL DEFAULT 0,
        total_amount DECIMAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log('✅ Tables created successfully.');

        // 2. Seed Data (Basic Paint colors for testing)
        const seedPaints = [
            { id: 'p001', sku: 'PPG-ENV-SG01', name: 'Sahara Gold Metallic', category: 'paints', color: '#C9A961', price: 4500, labor_hours: 24 },
            { id: 'p002', sku: 'BASF-GLS-AB02', name: 'Atlas Burgundy Pearl', category: 'paints', color: '#6B1D2D', price: 5200, labor_hours: 28 },
            { id: 'p007', sku: 'AXL-CRX-OB07', name: 'Obsidian Black', category: 'paints', color: '#1A1A2E', price: 4000, labor_hours: 20 },
        ];

        for (const p of seedPaints) {
            await db.execute({
                sql: `INSERT OR IGNORE INTO products (id, sku, name, category, color, price, labor_hours) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [p.id, p.sku, p.name, p.category, p.color, p.price, p.labor_hours]
            });
        }

        console.log('✅ Seed data inserted.');

    } catch (err) {
        console.error('❌ Error setting up Turso:', err);
    }
}

main();
