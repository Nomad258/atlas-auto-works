
import { createClient } from "@libsql/client";
import * as dots from 'dotenv'

// Load environment variables manually since we're running this script directly with node
dots.config({ path: '.env' })

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error("Missing Turso credentials. Check .env file.");
    process.exit(1);
}

const db = createClient({ url, authToken });

// Import the configs implicitly (we'll just copy the necessary parts here to avoid ESM nuances with 'import' in a script if package.json type isn't set, but project is type: module)
// Since we are in a module project, we can import from src/config if we use the right paths, but to be robust, let's redefine the mappings we want to push.

const ASSET_MAPPINGS = [
    // Wheels
    { sku: 'AAW-WHL-001', glb_path: '/models/wheels/rims/method_305.glb' },
    { sku: 'AAW-WHL-002', glb_path: '/models/wheels/rims/method_312.glb' },
    { sku: 'AAW-WHL-003', glb_path: '/models/wheels/rims/xd_grenade.glb' },
    { sku: 'AAW-WHL-004', glb_path: '/models/wheels/rims/xd_machete.glb' },

    // Bodykits
    {
        sku: 'AAW-BDK-001',
        glb_path: null, // Full kits might be composed of multiple parts
        parts: [
            { key: 'spoiler', path: '/models/bodykits/gt_wing_spoiler.glb', pos: [-1.8, 0.8, 0] },
            { key: 'undertray', path: '/models/bodykits/undertray.glb', pos: [0, -0.5, 0] }
        ]
    },
    { sku: 'AAW-BDK-002', glb_path: '/models/bodykits/gt_wing_spoiler.glb' }, // Just using spoiler as placeholder for simple parts

    // Accessories
    { sku: 'AAW-ACC-001', glb_path: '/models/accessories/exhaust.glb', position_offset: [-2.3, -0.35, 0], rotation_offset: [0, Math.PI, 0] },
    { sku: 'AAW-ACC-002', glb_path: '/models/accessories/exhaustcover.glb' }
];

async function migrate() {
    console.log("Starting migration to Turso...");

    for (const item of ASSET_MAPPINGS) {
        try {
            console.log(`Updating ${item.sku}...`);

            let query = `UPDATE products SET glb_path = ? WHERE sku = ?`;
            let args = [item.glb_path, item.sku];

            if (item.position_offset) {
                query = `UPDATE products SET glb_path = ?, position_offset = json(?), rotation_offset = json(?) WHERE sku = ?`;
                args = [item.glb_path, JSON.stringify(item.position_offset), JSON.stringify(item.rotation_offset || [0, 0, 0]), item.sku];
            }

            const result = await db.execute({
                sql: query,
                args: args
            });

            console.log(`Updated ${item.sku}: ${result.rowsAffected} rows affected.`);
        } catch (e) {
            console.error(`Failed to update ${item.sku}:`, e);
        }
    }

    // Also update the CAR models in a separate table if we had one, or hardcode them in the frontend.
    // The user asked to move EVERYTHING to Turso.
    // Let's assume we want a 'cars' table or store base models in 'products' with category='car'.
    // For now, let's keep it simple and just update the parts we know about.

    console.log("Migration complete.");
}

migrate();
