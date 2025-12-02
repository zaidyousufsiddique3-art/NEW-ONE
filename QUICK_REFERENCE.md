# 🚀 Quick Reference Card

## One-Time Setup (Do This First!)

### Step 1: Install Backend
```bash
cd server
npm install
```

### Step 2: Start Backend
```bash
cd server
npm run dev
```
Should show: `🚀 ICT Copilot Backend running on http://localhost:3001`

### Step 3: Upload PDF (ONCE ONLY)
Open in browser: `server/upload-tool.html`
Click: "Upload PDF to OpenAI"
Wait for success message ✅

### Step 4: Start Frontend
```bash
npm run dev
```

---

## Daily Usage (After Setup)

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend
```bash
npm run dev
```

That's it! Open browser and use the app.

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module 'express'" | Run `npm install` in server folder |
| "Backend not running" | Start backend: `cd server && npm run dev` |
| "Failed to fetch" | Check backend is on port 3001 |
| Wrong language | Check language selection in app |
| "PowerShell scripts disabled" | Run as Admin: `Set-ExecutionPolicy RemoteSigned` |

---

## File Locations

- **Backend**: `server/`
- **Environment**: `server/.env`
- **Upload Tool**: `server/upload-tool.html`
- **Frontend Env**: `.env.local`

---

## Important URLs

- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173 (or shown in terminal)
- **Upload Tool**: Open `server/upload-tool.html` in browser

---

## Environment Variables

### Backend (`server/.env`)
```env
OPENAI_API_KEY=your_key_here
PORT=3001
PDF_URL=firebase_storage_url
```

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:3001
```

---

## Testing Checklist

✅ Backend starts without errors
✅ PDF uploaded successfully (one time)
✅ Frontend connects to backend
✅ Can ask questions in English
✅ Can ask questions in Tamil
✅ Can ask questions in Sinhala
✅ All 5 modules work
✅ No "context not found" errors

---

## All 5 Modules

1. **Ask a Question** - Chat interface
2. **Exam-Style Questions** - Practice questions
3. **Flashcards** - Q&A cards
4. **Quick Revision** - Fast recall
5. **Case Study** - Structured answers

All use the same PDF-first engine! 🎯

---

## Need Help?

1. Check `SETUP.md` for detailed instructions
2. Check `README.md` for full documentation
3. Check `IMPLEMENTATION_SUMMARY.md` for technical details
4. Check backend terminal for error logs
5. Check browser console for frontend errors

---

## Remember

- Upload PDF **ONCE** during setup
- Keep backend running while using app
- Select language before using modules
- All answers use PDF-first logic
- No "context not found" - always get an answer!

🎓 Happy studying!
