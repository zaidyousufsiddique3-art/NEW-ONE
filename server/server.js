import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// -------------------------
// ✅ FIREBASE ADMIN IMPORT
// -------------------------
import { adminDB, adminStorage } from "./services/firebase.js";

dotenv.config();

export const db = adminDB;
export const bucket = adminStorage;

// -------------------------
// IMPORT KNOWLEDGE ENGINE
// -------------------------
import { generateAnswer, uploadPDFToOpenAI, getFileIds, processUploadedFile, analyzeImages } from './services/knowledgeEngine.js';

const app = express();
const PORT = process.env.PORT || 3001;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'ICT Copilot Backend is running' });
});

// Generate answer with PDF-first logic
app.post('/api/generate-answer', async (req, res) => {
    try {
        const { question, selectedLanguage, moduleName, subject } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        const language = selectedLanguage || 'english';
        const module = moduleName || 'General';
        const subj = subject || 'General';

        console.log(`[${module}] Generating answer for: "${question}" in ${language} (Subject: ${subj})`);

        let answer;
        if (req.body.images && req.body.images.length > 0) {
            answer = await analyzeImages(question, req.body.images, language);
        } else {
            answer = await generateAnswer(question, language, module, subj);
        }

        res.json({
            success: true,
            answer,
            language,
            module
        });

    } catch (error) {
        console.error('Error generating answer:', error);
        res.status(500).json({
            error: 'Failed to generate answer',
            message: error.message
        });
    }
});

// Upload PDF to OpenAI
app.post('/api/upload-pdf', async (req, res) => {
    try {
        console.log('Uploading PDF to OpenAI...');
        const fileId = await uploadPDFToOpenAI();

        res.json({
            success: true,
            fileId,
            message: 'PDF uploaded successfully to OpenAI'
        });

    } catch (error) {
        console.error('Error uploading PDF:', error);
        res.status(500).json({
            error: 'Failed to upload PDF',
            message: error.message
        });
    }
});

// Process uploaded file
app.post('/api/process-file', async (req, res) => {
    // Add explicit CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        const { fileUrl, fileName, subject } = req.body;

        if (!fileUrl || !fileName) {
            return res.status(400).json({ error: 'File URL and name are required' });
        }

        console.log(`Processing uploaded file: ${fileName} for subject: ${subject}`);
        const fileId = await processUploadedFile(fileUrl, fileName, subject);

        res.json({
            success: true,
            fileId,
            message: 'File processed and added to knowledge hub'
        });

    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({
            error: 'Failed to process file',
            message: error.message
        });
    }
});

// List file IDs
app.get('/api/file-ids', async (req, res) => {
    try {
        const fileIds = await getFileIds();
        res.json({ fileIds });
    } catch (error) {
        console.error('Error fetching file IDs:', error);
        res.status(500).json({ error: 'Failed to fetch file IDs' });
    }
});

// Image generation endpoint
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt, language = 'english' } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log(`Generating image for prompt: ${prompt} in ${language}`);

        const enhancedPrompt = `A clean, professional, 2D black and white logic circuit diagram for: ${prompt}. 
        Use standard IEEE logic gate symbols (AND, OR, NOT, NAND, NOR, XOR). 
        Clear lines, simple layout, white background, high contrast. 
        Educational style, suitable for A-Level ICT textbook.`;

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: enhancedPrompt,
            n: 1,
            size: "1024x1024",
            response_format: "url",
        });

        const imageUrl = response.data[0].url;

        const captionResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert A-Level ICT tutor. Provide a brief 2-sentence explanation of the logic circuit for: "${prompt}". 
                    Output ONLY in ${language}.`
                },
                { role: "user", content: "Explain this circuit." }
            ],
        });

        const caption = captionResponse.choices[0].message.content;

        res.json({ imageUrl, caption });

    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({
            error: 'Failed to generate image',
            details: error.message
        });
    }
});

// Start server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 ICT Copilot Backend running on http://localhost:${PORT}`);
        console.log(`📚 PDF URL configured: ${process.env.PDF_URL ? 'Yes' : 'No'}`);
        console.log(`🔑 OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
    });
}

export default app;
