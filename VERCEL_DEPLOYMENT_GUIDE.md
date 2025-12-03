# 🚀 Vercel Deployment Guide - ICT Study Copilot

## ✅ Your Project is Ready for Vercel!

Your project is already configured to deploy both frontend and backend to Vercel as a single application.

---

## 📋 Pre-Deployment Checklist

### 1. **Get Firebase Web App Configuration**

You need to add Firebase config to Vercel environment variables. Get these from:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ict-3d0a0`
3. Click ⚙️ **Project Settings**
4. Scroll to **"Your apps"** → Web app
5. Copy the `firebaseConfig` object values

You'll need:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`
- `measurementId` (optional)

---

## 🌐 Deploy to Vercel

### Step 1: Push to GitHub (if not already done)

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. **Import** your GitHub repository
4. Vercel will auto-detect it as a Vite project

### Step 3: Configure Project Settings

**Framework Preset:** Vite  
**Root Directory:** `./` (leave as root)  
**Build Command:** `npm run build` (auto-detected)  
**Output Directory:** `dist` (auto-detected)  
**Install Command:** `npm install` (auto-detected)

### Step 4: Add Environment Variables

In the Vercel deployment screen, click **"Environment Variables"** and add ALL of these:

#### **Frontend Variables (VITE_)**
```
VITE_API_URL=/api

VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=ict-3d0a0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ict-3d0a0
VITE_FIREBASE_STORAGE_BUCKET=ict-3d0a0.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-messaging-sender-id>
VITE_FIREBASE_APP_ID=<your-firebase-app-id>
VITE_FIREBASE_MEASUREMENT_ID=<your-measurement-id>
```

#### **Backend Variables (Backend will use these)**
```
OPENAI_API_KEY=<your-openai-key>
PORT=3001

PDF_URL=https://firebasestorage.googleapis.com/v0/b/ict-3d0a0.firebasestorage.app/o/ilovepdf_merged%20(1)_compressed.pdf?alt=media&token=d72ad912-b865-4cc5-9665-63612f153d3b

FIREBASE_PROJECT_ID=ict-3d0a0
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@ict-3d0a0.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDFe77hmX2cannz\nSvAPB1u2nUDdE7zFPRSp+dmtuEweNGVpLESxyBIakfrfG6GVh6y/7r0x5TJMlOmI\nuUDlK2X3d7j+RYNyB0sE60MG1UF3A8ktOYkTtYRDk+Ng7fUrEigYGf+HuUce/vDm\nXwLejC57OyuPfo9expgFwbqYgcyufzSQ5OzGzdcqxX3LP/RG5X78/SRD3vBL+ulq\nQbM06Q5OPYkRBFYcUTtwVx5xj8fSWVVEl3DIyM8zo1p7xfzSBsv1/j4HRl8mmTV5\nscvHcYc+6MNEFUEYHkGcrvlyybLkYmcByzAbEp6p8nKUrAhhIa+xh4+Hl4vA2OoC\nWPCo2IldAgMBAAECggEAEGb3A29XcLyiPNwSRLlIe4ojl0kaomowk26STxyxy8dv\nzdS0ruxuXoEV7F5z5QLEDRvz4FdIPnaWz/mNA4u/eBacSZg18uxapYGxyzk+qvco\nSCaRdU7b+a3okoYpGQb0yA2uvNPdbZxgn02wZBISET+onk41c7p8aWv+BskvGiYG\nuc0kqxqnX+eNFGVc696tcOS+DmzxmB+Pbxe/QyjJVhgFukdALg7c3aLaFF+BMpQv\n8C9Hgg7fT7un3I85tfo1CKdCOYWfWFr5gj9bHme6GHXPmyMIsWbJo11kKaxOqT2y\njMsEPGKFzl6Nt+2IOz7GUT/liEsK7DAZO+pbDBdbsQKBgQDkCix2tZbfLr0TExDD\nqzrKmEJb+5b7C/I9TLPv4VQ0gTy3joIl0CopHaLHLd30WOXY5of/ALIOE5iWw2Oa\nK2zTY9X6t02g92BDEqjdyImZ+uyc0W/R6MdZpOW8qw3kA/9Mb/wqXtjab7cZJgHH\nQrPEQPhr4Z0u+5tKBeRtcfCLzQKBgQDdsnQafJ4ksjvAbHeyQsYq8V3LD57tu9vH\nX9LDjeWyYgbVwH7+FuNo4hdFiPeItxQbUFQxvsJIFi3MSA8g1WCaz1qgd5Ej9cJm\ni9G70Dw3tNbvG1zEoYrxmh99j9/RY/BPxgV7jUbeCmh+pW6rs3IpSLDGxvpvPiHY\nYBXjdB8D0QKBgQCSJRcD6TLMy/Zu0Awxan6eMmBs9Nt4/tn7gTncZWuCzsSr2s/8\nDeHHQe/9eJ7Dp2l+zZegzMBQFyz2ijg+KNBw1Y3gRTOiEogF1GKW6JuPLGoRwoPI\nYkfIYs69UF7xn8IxKZ/RQ8H0lB4jJuGC43O0NfM/qHMFFkkacpZHsfr4jQKBgQCb\nWqM7sFoNswxmElxqgZpmm08zrdWcGImxk/eY68WrlD/f6A3VtmpTpCPUqV904X5o\niYkGdvukEk6zmUdopb4VnfqO+lquDVjWDWLCrvCTxNjdI5qFfAJmva8ViQ25qMPM\n0yIia2Te0gJZxUnhblUwkuy1ztfNvodvHh4YjtXxEQKBgQDFNm/6UF8xOXrp+vnt\nR189I10MYDaat6pLtQJ1S7y8/4oCKP9d3bzeRag0M1BBIbDfsW9SmIkzsUPzBHXn\nU7O8XlDfjS2ZUMRk9KoMBjbz5gkpNtTqIUeNJWFgAEhu5NBrh9J4KEwmnpPxM+8E\n09ohR+zyXuKAE5X97n9sB84MOg==\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=ict-3d0a0.appspot.com
```

**⚠️ IMPORTANT:**
- For `FIREBASE_PRIVATE_KEY`, copy the ENTIRE value including quotes and `\n` characters
- Make sure to apply these variables to **Production**, **Preview**, and **Development** environments

### Step 5: Deploy

Click **"Deploy"** and Vercel will:
1. Install dependencies
2. Build your Vite frontend
3. Set up serverless functions for your backend API
4. Deploy everything

---

## 🔧 Post-Deployment

### Update Firebase Storage & Firestore Rules

Since your app is now public, update security rules:

**Firebase Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read, write: if true; // For testing
      // TODO: Add authentication later
    }
  }
}
```

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /files/{document=**} {
      allow read, write: if true; // For testing
      // TODO: Add authentication later
    }
  }
}
```

---

## ✅ Verify Deployment

After deployment completes:

1. **Test the frontend:** `https://your-app.vercel.app`
2. **Test the backend:** `https://your-app.vercel.app/api/health`
3. **Test file upload:** Try uploading a file and asking a question

---

## 🐛 Troubleshooting

### If Firebase Storage error occurs:
- Double-check all `VITE_FIREBASE_*` variables are set correctly
- Verify `FIREBASE_STORAGE_BUCKET` is set to `ict-3d0a0.appspot.com`

### If backend API fails:
- Check Vercel Function Logs (Dashboard → Functions → Logs)
- Verify `OPENAI_API_KEY` and `FIREBASE_PRIVATE_KEY` are correct
- Ensure the private key includes `\n` characters

### If "Connection Failed" appears:
- Check that `VITE_API_URL=/api` is set (NOT a full URL)
- Verify the backend is working: `https://your-app.vercel.app/api/health`

---

## 📝 Quick Copy - All Environment Variables Template

```env
# Frontend
VITE_API_URL=/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=ict-3d0a0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ict-3d0a0
VITE_FIREBASE_STORAGE_BUCKET=ict-3d0a0.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Backend
OPENAI_API_KEY=
PORT=3001
PDF_URL=https://firebasestorage.googleapis.com/v0/b/ict-3d0a0.firebasestorage.app/o/ilovepdf_merged%20(1)_compressed.pdf?alt=media&token=d72ad912-b865-4cc5-9665-63612f153d3b
FIREBASE_PROJECT_ID=ict-3d0a0
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@ict-3d0a0.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="<paste-your-entire-private-key-here>"
FIREBASE_STORAGE_BUCKET=ict-3d0a0.appspot.com
```

Fill in the blanks and paste into Vercel!

---

## 🎉 Done!

Your app should now be live on Vercel with:
- ✅ Subject-based file organization
- ✅ Multi-language support (English, Tamil, Sinhala)
- ✅ AI-powered answers using OpenAI
- ✅ File uploads to Firebase Storage
- ✅ Image analysis with Vision API

**Deployment URL:** `https://your-project-name.vercel.app`
