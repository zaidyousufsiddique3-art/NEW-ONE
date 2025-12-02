# Vercel Environment Variables

When deploying to Vercel, go to **Settings > Environment Variables** and add the following:

| Variable Name | Description | Value (Example) |
|--------------|-------------|-----------------|
| `OPENAI_API_KEY` | Your OpenAI API Key | `sk-...` |
| `PDF_URL` | URL of the initial PDF file in Firebase Storage | `https://firebasestorage.googleapis.com/...` |
| `VITE_API_URL` | URL of your deployed backend (for frontend) | `https://your-project.vercel.app/api` |
| `FIREBASE_PROJECT_ID` | Firebase Project ID | `your-project-id` |
| `FIREBASE_CLIENT_EMAIL` | Firebase Service Account Email | `firebase-adminsdk-xxxxx@...` |
| `FIREBASE_PRIVATE_KEY` | Firebase Private Key (Must include \n) | `"-----BEGIN PRIVATE KEY-----\n..."` |
| `FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket URL | `your-project-id.appspot.com` |

> **Note:** Vercel automatically handles `PORT`.

## Important for Vercel Deployment

1.  **Root Directory:** If you are deploying the whole repo, you might need to configure the "Root Directory" in Vercel settings to `.` (root) or split into two projects (frontend and backend).
    *   **Recommended:** Deploy as a single project if using Next.js, but since this is Vite + Express, you typically deploy the Frontend to Vercel and the Backend to a service like Render or Railway.
    *   **However**, you can deploy the Express backend to Vercel as Serverless Functions if you move `server/server.js` to `api/index.js`.

### Option A: Deploy Frontend Only (Vercel) + Backend (Render/Railway)
1.  Deploy `server` folder to Render/Railway.
2.  Get the URL (e.g., `https://ict-copilot.onrender.com`).
3.  Deploy root folder to Vercel.
4.  Set `VITE_API_URL` in Vercel to the Render backend URL.

### Option B: Deploy Both to Vercel (Requires restructuring)
To deploy the Express backend to Vercel, you need to:
1.  Create an `api` folder in the root.
2.  Move `server/server.js` logic to `api/index.js`.
3.  Update `vercel.json` to route `/api/*` to that function.

**Given your current structure (Vite + separate Server folder), Option A is standard.**
If you want to deploy EVERYTHING to Vercel, you need to create a `vercel.json` in the root:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/server/server.js" }
  ]
}
```
*Note: This requires `server.js` to export the app, not just listen.*

## Node Modules
**Do NOT upload `node_modules`.** Vercel will install dependencies automatically based on `package.json`.
Ensure your `.gitignore` includes:
```
node_modules
dist
.env
```
