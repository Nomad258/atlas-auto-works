import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import storageConfig from '../src/config/storageConfig.js';
import { GDRIVE_FILE_IDS } from '../src/config/storageConfig.js';

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// Ensure directories exist
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const downloadFile = (fileId, destPath) => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(destPath)) {
            console.log(`Skipping existing file: ${destPath}`);
            resolve();
            return;
        }

        const fileStream = fs.createWriteStream(destPath);
        const url = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;

        console.log(`Downloading ${fileId} to ${destPath}...`);

        https.get(url, (res) => {
            if (res.statusCode === 302 || res.statusCode === 303) {
                const newUrl = res.headers.location;
                https.get(newUrl, (redirectedRes) => {
                    if (redirectedRes.statusCode !== 200) {
                        reject(new Error(`Failed to download: ${redirectedRes.statusCode}`));
                        return;
                    }
                    redirectedRes.pipe(fileStream);
                    fileStream.on('finish', () => {
                        fileStream.close();
                        console.log(`✅ Downloaded: ${path.basename(destPath)}`);
                        resolve();
                    });
                });
            } else if (res.statusCode === 200) {
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`✅ Downloaded: ${path.basename(destPath)}`);
                    resolve();
                });
            } else {
                reject(new Error(`Failed to download: ${res.statusCode}`));
            }
        }).on('error', (err) => {
            fs.unlink(destPath, () => { });
            reject(err);
        });
    });
};


async function main() {
    console.log('🚀 Starting Google Drive Asset Migration...');

    // We can traverse GDRIVE_FILE_IDS to find what to download
    // And map them to a logical structure in public/models/...

    const downloadTasks = [];

    // Wheels
    for (const [name, id] of Object.entries(GDRIVE_FILE_IDS.wheels)) {
        const dest = path.join(PUBLIC_DIR, 'models/wheels/rims', `${name}.glb`);
        ensureDir(path.dirname(dest));
        downloadTasks.push(() => downloadFile(id, dest));
    }

    // Tires
    for (const [name, id] of Object.entries(GDRIVE_FILE_IDS.tires)) {
        const dest = path.join(PUBLIC_DIR, 'models/wheels/tires', `${name}.glb`);
        ensureDir(path.dirname(dest));
        downloadTasks.push(() => downloadFile(id, dest));
    }

    // Accessories
    for (const [name, id] of Object.entries(GDRIVE_FILE_IDS.accessories)) {
        const dest = path.join(PUBLIC_DIR, 'models/accessories', `${name}.glb`);
        ensureDir(path.dirname(dest));
        downloadTasks.push(() => downloadFile(id, dest));
    }

    // Bodykits
    for (const [name, id] of Object.entries(GDRIVE_FILE_IDS.bodykits)) {
        const dest = path.join(PUBLIC_DIR, 'models/bodykits', `${name}.glb`);
        ensureDir(path.dirname(dest));
        downloadTasks.push(() => downloadFile(id, dest));
    }

    // Cars
    for (const [name, id] of Object.entries(GDRIVE_FILE_IDS.cars)) {
        const dest = path.join(PUBLIC_DIR, 'models/cars', `${name}.glb`);
        ensureDir(path.dirname(dest));
        downloadTasks.push(() => downloadFile(id, dest));
    }

    // Process recursively? No, just batch them.
    // Serial execution to avoid rate limits?
    for (const task of downloadTasks) {
        try {
            await task();
        } catch (e) {
            console.error(`❌ Error downloading file:`, e.message);
        }
    }

    console.log('✨ Asset Migration Complete!');
}

main();
