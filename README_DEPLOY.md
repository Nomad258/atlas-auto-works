# Deployment Guide: Netlify + Turso + Local/Remote Assets

## 1. Environment Variables (Netlify)

Go to **Site Settings > Environment Variables** and add the following:

### Database (Turso)
- `VITE_TURSO_DATABASE_URL`: `libsql://your-db-name-org.turso.io`
- `VITE_TURSO_AUTH_TOKEN`: `your-turso-auth-token`

### OpenAI (Optional - for chatbot/AI features)
- `VITE_OPENAI_API_KEY`: `sk-proj-...`

## 2. Database Migration (Turso)

Since we used a local SQLite file during development, you need to push the schema to your Turso production database.

1. Install the Turso CLI locally and login:
   ```bash
   brew install turso
   turso auth login
   ```

2. Create a new database (if you haven't):
   ```bash
   turso db create atlas-auto-works
   ```

3. Push the schema from our local SQL file (or setup script):
   You can use the shell command to pipe the schema:
   ```bash
   turso db shell atlas-auto-works < supabase/schema.sql
   ```
   *(Note: Adjust the SQL if Turso has specific syntax differences, but `create table` is standard)*

4. Seed initial data (Products):
   Since our seed script (`scripts/setup-turso.js`) connects to `local.db` by default, update it temporarily or run a modified version that connects to the remote URL to insert the products.

## 3. Storage (Assets)
All 3D assets are currently in the `public/models` folder.
- **Git LFS**: Ensure your GLB files are tracked with Git LFS if they are large (>100MB), otherwise Netlify might struggle.
- Currently, our setup treats them as static files which is fine for <100MB files.
- If you move them to **Supabase Storage** or another provider later, enable the relevant backend in `src/config/storageConfig.js`.

## 4. Deploy
1. Push your code to GitHub.
2. Connect your repository to Netlify.
3. It will auto-detect the build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Deploy!
