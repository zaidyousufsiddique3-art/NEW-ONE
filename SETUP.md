# 🚀 Quick Setup Guide

## ⚠️ PowerShell Script Execution Issue

If you see an error about "running scripts is disabled", run this command in PowerShell as Administrator:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then close and reopen your terminal.

## 📦 Installation Steps

### 1. Install Backend Dependencies

Open a terminal and run:

```bash
cd "c:\Users\zaidy\OneDrive\Desktop\ICT CODES\server"
npm install
```

### 2. Install Frontend Dependencies (if not already done)

```bash
cd "c:\Users\zaidy\OneDrive\Desktop\ICT CODES"
npm install
```

### 3. Start the Backend Server

```bash
cd "c:\Users\zaidy\OneDrive\Desktop\ICT CODES\server"
npm run dev
```

You should see:
```
🚀 ICT Copilot Backend running on http://localhost:3001
📚 PDF URL configured: Yes
🔑 OpenAI API Key configured: Yes
```

### 4. Upload PDF to OpenAI (ONE-TIME SETUP)

**Option A: Using curl (if available)**
```bash
curl -X POST http://localhost:3001/api/upload-pdf
```

**Option B: Using PowerShell**
```powershell
Invoke-WebRequest -Uri http://localhost:3001/api/upload-pdf -Method POST
```

**Option C: Using browser**
- Open your browser
- Install a REST client extension (like "Talend API Tester" or "REST Client")
- Make a POST request to: `http://localhost:3001/api/upload-pdf`

You should see a response with a file ID. This only needs to be done ONCE.

### 5. Start the Frontend

Open a NEW terminal window:

```bash
cd "c:\Users\zaidy\OneDrive\Desktop\ICT CODES"
npm run dev
```

### 6. Open the Application

Open your browser and go to the URL shown (usually `http://localhost:5173`)

## ✅ Verification

1. Backend should show: `🚀 ICT Copilot Backend running on http://localhost:3001`
2. Frontend should open in browser
3. Select a language (English/Tamil/Sinhala)
4. Try asking a question - you should get an answer in your selected language
5. Try all 5 modules - they should all work consistently

## 🔧 Common Issues

### "Cannot find module 'express'"
- Run `npm install` in the server directory

### "ECONNREFUSED" or "Failed to fetch"
- Make sure backend is running on port 3001
- Check if `VITE_API_URL` is set correctly in frontend

### "OpenAI API key not configured"
- Check `server/.env` file exists
- Verify `OPENAI_API_KEY` is set correctly

### "Firebase Admin SDK error" or "API 500 error"
- Ensure `firebase-admin` is installed (`npm install` in server folder)
- Check `server/.env` contains:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`
  - `FIREBASE_STORAGE_BUCKET`

### Answers are in wrong language
- Make sure you selected the correct language on the language selection page
- Check browser console for errors
- Verify backend is receiving the correct language parameter

## 📝 Quick Test

Once everything is running, try this:

1. Select "English" as language
2. Click "Ask a Question"
3. Type: "What is a database?"
4. You should get a detailed answer in English

Then:
1. Go back and select "Tamil"
2. Click "Ask a Question"  
3. Type the same question
4. You should get the answer in Tamil

## 🎯 Next Steps

- All 5 modules now use the PDF-first approach
- No more "context not found" errors
- Answers always provided in selected language
- System works consistently across all features

Enjoy your AI-powered ICT study companion! 🎓
