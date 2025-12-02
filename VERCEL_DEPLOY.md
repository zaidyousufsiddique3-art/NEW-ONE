# 🚀 Vercel Deployment Guide

Your project is already configured for Vercel deployment! 

## 1. Environment Variables (CRITICAL)

When you deploy to Vercel, you **MUST** add the following Environment Variables in the Vercel Dashboard (Settings > Environment Variables).

| Variable Name | Description |
|--------------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API Key |
| `FIREBASE_PROJECT_ID` | `ict-3d0a0` |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@ict-3d0a0.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Copy the **entire** private key (including `-----BEGIN...` and `...END-----`). Vercel handles the newlines automatically. |
| `FIREBASE_STORAGE_BUCKET` | `ict-3d0a0.firebasestorage.app` |

## 2. Deployment Steps

1. **Push to GitHub/GitLab/Bitbucket**
   - Make sure your code is pushed to a repository.

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." > "Project"
   - Import your repository.

3. **Configure Project**
   - **Framework Preset**: Vite (should be detected automatically)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)

4. **Add Environment Variables**
   - **Before clicking Deploy**, expand the "Environment Variables" section.
   - Add all the variables listed above.

5. **Deploy**
   - Click "Deploy".

## 3. Verification

Once deployed:
1. Go to your Vercel URL (e.g., `https://your-project.vercel.app`).
2. The frontend should load.
3. Go to `https://your-project.vercel.app/api/health`
   - You should see: `{"status":"ok","message":"ICT Copilot Backend is running"}`

## 4. Troubleshooting

- **500 Error on API calls**: 
  - Check Vercel Logs (Dashboard > Project > Logs).
  - Usually means `FIREBASE_PRIVATE_KEY` is incorrect or missing.
  - Ensure you didn't miss any characters when copying the key.

- **"Function not found"**:
  - Ensure `vercel.json` is in the root directory.
  - Ensure `api/index.js` exists.

## 5. Local Development vs Vercel

- **Locally**: You run `npm run dev` (frontend) and `npm run dev` (backend in `server/`).
- **On Vercel**: Vercel runs the frontend as static files and the backend as Serverless Functions automatically using the `api/` folder.
