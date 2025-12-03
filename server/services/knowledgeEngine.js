import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminDB } from './firebase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On Vercel, process.cwd() is the root. In local server, it might be different.
// We need to ensure we can find files relative to this script.


// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Paths (Only used for temp files now)
const CONFIG_PATH = path.join(__dirname, 'file-config.json');

/**
 * Get all available file IDs (original PDF + uploaded files from Firestore)
 */
export async function getFileIds() {
    const fileIds = [];

    // 1. Get original PDF ID (from env or local config if exists)
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
            if (config.fileId) fileIds.push(config.fileId);
        }
    } catch (error) {
        console.warn('Could not load original file ID:', error);
    }

    // 2. Get uploaded file IDs from Firestore
    try {
        const querySnapshot = await adminDB.collection("files").get();
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.fileId && !fileIds.includes(data.fileId)) {
                fileIds.push(data.fileId);
            }
        });
    } catch (error) {
        console.warn('Could not load Firestore file IDs:', error);
    }

    return fileIds;
}

/**
 * Process a new uploaded file
 * 1. Download from URL
 * 2. Upload to OpenAI
 * 3. Update Firestore document with fileId
 */
export async function processUploadedFile(fileUrl, fileName) {
    try {
        console.log(`Processing file: ${fileName}`);

        // Download file
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        // Use /tmp for serverless compatibility (Vercel)
        const tempDir = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME ? '/tmp' : path.join(__dirname, '..');
        const tempPath = path.join(tempDir, `temp_${Date.now()}_${fileName}`);

        fs.writeFileSync(tempPath, response.data);

        // Upload to OpenAI
        const file = await openai.files.create({
            file: fs.createReadStream(tempPath),
            purpose: 'assistants',
        });

        const fileSize = fs.statSync(tempPath).size;

        // Clean up temp file
        // fs.unlinkSync(tempPath); // Moved to finally block or after usage

        // Update Firestore
        // Find the document with this fileUrl and update it
        const querySnapshot = await adminDB.collection("files").where("fileUrl", "==", fileUrl).get();

        if (!querySnapshot.empty) {
            const updatePromises = [];
            querySnapshot.forEach((doc) => {
                updatePromises.push(
                    doc.ref.update({
                        fileId: file.id,
                        processedAt: new Date().toISOString()
                    })
                );
            });
            await Promise.all(updatePromises);
            console.log(`✅ Firestore updated for file: ${fileName}`);
        } else {
            // If document doesn't exist, create it (User requested "add" logic)
            await adminDB.collection("files").add({
                fileName,
                fileUrl,
                fileId: file.id,
                processedAt: new Date().toISOString(),
                uploadedAt: new Date(),
                type: 'pdf', // Assumed based on context
                size: fileSize
            });
            console.log(`✅ Created new Firestore document for file: ${fileName}`);
        }

        // Clean up temp file
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }

        console.log(`✅ File processed and added to knowledge hub: ${file.id}`);
        return file.id;

    } catch (error) {
        console.error('Error processing file:', error);
        throw error;
    }
}

/**
 * Upload PDF from Firebase Storage to OpenAI File API (Legacy/Initial setup)
 */
export async function uploadPDFToOpenAI() {
    try {
        const pdfUrl = process.env.PDF_URL;
        if (!pdfUrl) throw new Error('PDF_URL not configured');

        console.log('Downloading PDF from Firebase Storage...');
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });

        const tempDir = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME ? '/tmp' : path.join(__dirname, '..');
        const tempPath = path.join(tempDir, 'temp_ict_notes.pdf');

        fs.writeFileSync(tempPath, response.data);

        console.log('Uploading PDF to OpenAI...');
        const file = await openai.files.create({
            file: fs.createReadStream(tempPath),
            purpose: 'assistants',
        });

        fs.unlinkSync(tempPath);

        // Save to config (Local only - for Vercel, use Env Var or Firestore)
        if (!process.env.VERCEL) {
            fs.writeFileSync(CONFIG_PATH, JSON.stringify({ fileId: file.id }, null, 2));
        }

        console.log(`✅ PDF uploaded successfully! File ID: ${file.id}`);
        return file.id;
    } catch (error) {
        console.error('Error uploading PDF to OpenAI:', error);
        throw error;
    }
}

// Helper for language instructions
const getLanguageInstructions = (language) => {
    const instructions = {
        english: 'You MUST respond ONLY in English.',
        tamil: 'You MUST respond ONLY in Tamil (தமிழ்). Translate everything to Tamil. Never use English.',
        sinhala: 'You MUST respond ONLY in Sinhala (සිංහල). Translate everything to Sinhala. Never use English.',
    };
    return instructions[language.toLowerCase()] || instructions.english;
};

/**
 * Generate answer with Multi-File RAG logic and OpenAI fallback
 */
export async function generateAnswer(question, selectedLanguage = 'english', moduleName = 'General') {
    try {
        const language = selectedLanguage.toLowerCase();
        const languageInstruction = getLanguageInstructions(language);

        // Step 1: Try PDF/File-first approach
        const fileIds = await getFileIds(); // Now async

        if (fileIds.length > 0) {
            console.log(`[${moduleName}] Attempting RAG with ${fileIds.length} files`);

            try {
                const thread = await openai.beta.threads.create();
                await openai.beta.threads.messages.create(thread.id, {
                    role: 'user',
                    content: question,
                });

                const assistant = await openai.beta.assistants.create({
                    name: 'ICT Study Assistant',
                    instructions: `You are an expert A-Level ICT tutor. Use the provided files as your PRIMARY knowledge source. ${languageInstruction}

CRITICAL RULES:
1. ${languageInstruction}
2. Answer based on the uploaded files content when available
3. Provide clear, well-structured answers
4. Use proper formatting with headings and bullet points
5. For exam questions: include mark schemes
6. For flashcards: format as Q&A pairs
7. For case studies: provide structured analysis

BINARY/COMPLEMENT CONVERSION RULES (VERY IMPORTANT):
8. For ALL binary conversions, one's complement, and two's complement:
   - DEFAULT to 8-bit representation UNLESS the user explicitly specifies a different bit length
   - Examples:
     * +50 in binary → 00110010 (8 bits, not 110010)
     * -50 in two's complement → 11001110 (8 bits)
     * +25 in one's complement → 00011001 (8 bits)
   - If user requests "6-bit", "12-bit", or "n-bit", honor that request
   - Always show the bit-length used in your answer (e.g., "8-bit binary: 00110010")
9. Use standard markdown bold (**text**) for emphasis. Do NOT use quotation marks for emphasis.

If the files don't contain enough information, still provide a helpful answer based on your A-Level ICT knowledge.`,
                    model: 'gpt-4o',
                    tools: [{ type: 'file_search' }],
                });

                // Create vector store with ALL files
                const vectorStore = await openai.beta.vectorStores.create({
                    name: 'ICT Knowledge Hub',
                    file_ids: fileIds,
                });

                await openai.beta.assistants.update(assistant.id, {
                    tool_resources: {
                        file_search: {
                            vector_store_ids: [vectorStore.id],
                        },
                    },
                });

                const run = await openai.beta.threads.runs.create(thread.id, {
                    assistant_id: assistant.id,
                });

                let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
                while (runStatus.status !== 'completed') {
                    if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
                        throw new Error(`Assistant run ${runStatus.status}`);
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
                }

                const messages = await openai.beta.threads.messages.list(thread.id);
                const assistantMessage = messages.data.find(msg => msg.role === 'assistant');

                if (assistantMessage && assistantMessage.content[0]?.text?.value) {
                    const answer = assistantMessage.content[0].text.value;

                    // Clean up
                    await openai.beta.assistants.del(assistant.id);
                    await openai.beta.threads.del(thread.id);
                    await openai.beta.vectorStores.del(vectorStore.id);

                    console.log(`[${moduleName}] ✅ RAG approach successful`);
                    return answer;
                }

            } catch (ragError) {
                console.warn(`[${moduleName}] RAG approach failed, falling back:`, ragError.message);
            }
        } else {
            console.warn(`[${moduleName}] No files found, using fallback approach`);
        }

        // Step 2: Fallback
        console.log(`[${moduleName}] Using OpenAI fallback (no files)`);
        const systemPrompt = `You are an expert A-Level ICT tutor. ${languageInstruction}

Provide clear, comprehensive answers suitable for A-Level ICT students.

CRITICAL RULES:
1. ${languageInstruction}
2. Provide well-structured, educational content
3. Use proper formatting with headings and bullet points
4. For exam questions: include mark schemes
5. For flashcards: format as Q&A pairs
6. For case studies: provide detailed, structured analysis
7. Always be helpful and educational

BINARY/COMPLEMENT CONVERSION RULES (VERY IMPORTANT):
8. For ALL binary conversions, one's complement, and two's complement:
   - DEFAULT to 8-bit representation UNLESS the user explicitly specifies a different bit length
   - Examples:
     * +50 in binary → 00110010 (8 bits, not 110010)
     * -50 in two's complement → 11001110 (8 bits)
     * +25 in one's complement → 00011001 (8 bits)
   - If user requests "6-bit", "12-bit", or "n-bit", honor that request
   - Always show the bit-length used in your answer (e.g., "8-bit binary: 00110010")
9. Use standard markdown bold (**text**) for emphasis. Do NOT use quotation marks for emphasis.

Module: ${moduleName}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: question },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const answer = response.choices[0]?.message?.content;
        if (!answer) throw new Error('No response from OpenAI');

        console.log(`[${moduleName}] ✅ Fallback approach successful`);
        return answer;

    } catch (error) {
        console.error(`[${moduleName}] Error generating answer:`, error);
        const fallbackMessages = {
            english: "I'm here to help with your A-Level ICT studies! Please try asking your question again.",
            tamil: "நான் உங்கள் A-நிலை ICT படிப்புக்கு உதவ இங்கே இருக்கிறேன்! தயவுசெய்து உங்கள் கேள்வியை மீண்டும் கேளுங்கள்.",
            sinhala: "මම ඔබේ A-මට්ටම ICT අධ්‍යයනයට උදව් කිරීමට මෙහි සිටිමි! කරුණාකර ඔබේ ප්‍රශ්නය නැවත අසන්න.",
        };
        return fallbackMessages[selectedLanguage.toLowerCase()] || fallbackMessages.english;
    }
}

/**
 * Analyze images using OpenAI Vision
 */
export async function analyzeImages(question, images, selectedLanguage = 'english') {
    try {
        const language = selectedLanguage.toLowerCase();
        const languageInstruction = getLanguageInstructions(language);

        console.log(`Analyzing ${images.length} images with question: "${question}" in ${language}`);

        const messages = [
            {
                role: 'system',
                content: `You are an expert A-Level ICT tutor. ${languageInstruction}
                Analyze the provided images and answer the user's question.
                Use standard markdown bold (**text**) for emphasis. Do NOT use quotation marks for emphasis.`
            },
            {
                role: 'user',
                content: [
                    { type: 'text', text: question },
                    ...images.map(img => ({
                        type: 'image_url',
                        image_url: { url: img }
                    }))
                ]
            }
        ];

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: messages,
            max_tokens: 2000,
        });

        return response.choices[0]?.message?.content || "No response generated.";

    } catch (error) {
        console.error('Error analyzing images:', error);
        throw error;
    }
}
