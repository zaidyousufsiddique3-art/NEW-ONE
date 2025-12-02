# ICT Study Copilot - PDF-Based RAG System

## 🔥 Overview

This application uses a **PDF-first RAG (Retrieval Augmented Generation)** system powered by OpenAI to provide intelligent answers across all learning modules. The system:

1. **PDF-First Logic**: Attempts to answer using the uploaded PDF from Firebase Storage
2. **Automatic Fallback**: If PDF doesn't contain sufficient information, falls back to OpenAI's general knowledge
3. **Multi-Language Support**: Answers in English, Tamil, or Sinhala based on user selection
4. **Secure Backend**: API keys are stored securely on the backend, never exposed to the frontend

## 📚 Modules Covered

All 5 modules use the same unified answering engine:

1. **Ask a Question** - Interactive chat with AI tutor
2. **Exam-Style Questions** - Generate practice questions with mark schemes
3. **Flashcards** - Create Q&A flashcards
4. **Quick Revision Questions** - Fast recall questions
5. **Case Study Answers** - Structured case study responses

## 🚀 Setup Instructions

### Prerequisites

- Node.js 16+ installed
- OpenAI API key
- Firebase Storage PDF URL

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 2: Configure Environment Variables

Create `server/.env` with:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
PDF_URL=https://firebasestorage.googleapis.com/v0/b/ict-3d0a0.firebasestorage.app/o/ilovepdf_merged%20(1)_compressed.pdf?alt=media&token=d72ad912-b865-4cc5-9665-63612f153d3b
```

### Step 3: Upload PDF to OpenAI (One-Time Setup)

Start the backend server:

```bash
cd server
npm run dev
```

Then make a POST request to upload the PDF:

```bash
curl -X POST http://localhost:3001/api/upload-pdf
```

Or use a tool like Postman/Insomnia to POST to `http://localhost:3001/api/upload-pdf`

This will:
- Download the PDF from Firebase Storage
- Upload it to OpenAI's File API
- Save the file ID for future use

**Note**: You only need to do this once. The file ID will be saved in `server/services/file-config.json`

### Step 4: Configure Frontend

Update `ICT CODES/.env.local` (or create it):

```env
VITE_API_URL=http://localhost:3001
```

### Step 5: Install Frontend Dependencies

```bash
cd "ICT CODES"
npm install
```

### Step 6: Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd "ICT CODES"
npm run dev
```

The application will be available at `http://localhost:5173` (or the port Vite assigns)

## 🔧 How It Works

### Architecture

```
User Question
    ↓
Frontend (React)
    ↓
Backend API (/api/generate-answer)
    ↓
Knowledge Engine
    ↓
┌─────────────────────────────┐
│  1. PDF-First Approach      │
│  - Uses OpenAI Assistants   │
│  - File Search on PDF       │
│  - Returns answer if found  │
└─────────────────────────────┘
    ↓ (if PDF insufficient)
┌─────────────────────────────┐
│  2. Fallback Approach       │
│  - Standard OpenAI Chat     │
│  - Uses general knowledge   │
│  - Always returns answer    │
└─────────────────────────────┘
    ↓
Language Translation Applied
    ↓
Final Answer Returned
```

### Language Handling

The system enforces strict language rules:

- **English**: All output in English only
- **Tamil**: All output in Tamil (தமிழ்) only
- **Sinhala**: All output in Sinhala (සිංහල) only

The language is enforced at the OpenAI level through system prompts.

## 🎯 Key Features

✅ **No "Context Not Found" Messages**: System always provides a helpful answer
✅ **PDF-First Logic**: Prioritizes uploaded study materials
✅ **Intelligent Fallback**: Uses OpenAI's knowledge when PDF lacks info
✅ **Multi-Language**: Full support for English, Tamil, and Sinhala
✅ **Secure**: API keys never exposed to frontend
✅ **Mobile Responsive**: Works on all devices
✅ **Consistent**: Same logic across all 5 modules

## 🔐 Security

- OpenAI API key stored in backend `.env` file only
- Frontend communicates with backend via REST API
- No sensitive credentials in client-side code
- CORS enabled for local development

## 📝 API Endpoints

### POST /api/generate-answer

Generate an answer using PDF-first logic.

**Request:**
```json
{
  "question": "What is a database?",
  "selectedLanguage": "english",
  "moduleName": "Ask Question"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "A database is...",
  "language": "english",
  "module": "Ask Question"
}
```

### POST /api/upload-pdf

Upload PDF to OpenAI (one-time setup).

**Response:**
```json
{
  "success": true,
  "fileId": "file-abc123...",
  "message": "PDF uploaded successfully to OpenAI"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "ICT Copilot Backend is running"
}
```

## 🐛 Troubleshooting

### Backend not connecting

1. Check if backend is running on port 3001
2. Verify `VITE_API_URL` in frontend `.env.local`
3. Check CORS settings if accessing from different domain

### PDF not being used

1. Ensure you ran the `/api/upload-pdf` endpoint
2. Check `server/services/file-config.json` exists with a file ID
3. Verify PDF_URL in backend `.env` is correct

### Wrong language in responses

1. Check language selection in frontend
2. Verify language parameter is being sent to backend
3. Check backend logs for language being used

## 📦 Production Deployment

For production:

1. Deploy backend to a service like Railway, Render, or Heroku
2. Update `VITE_API_URL` in frontend to point to production backend URL
3. Ensure environment variables are set in production
4. Build frontend: `npm run build`
5. Deploy frontend to Vercel, Netlify, or similar

## 🔄 Updating the PDF

To update the study materials PDF:

1. Upload new PDF to Firebase Storage
2. Update `PDF_URL` in backend `.env`
3. Run `/api/upload-pdf` endpoint again
4. New file ID will be saved automatically

## 📞 Support

For issues or questions, check:
- Backend logs in terminal
- Browser console for frontend errors
- Network tab for API call failures
