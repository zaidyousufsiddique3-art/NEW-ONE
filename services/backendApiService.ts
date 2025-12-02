/**
 * Frontend service to communicate with the backend API
 * This replaces direct OpenAI calls from the frontend
 */

const getApiBaseUrl = () => {
    const url = (import.meta as any).env?.VITE_API_URL;

    if (url) {
        let cleanUrl = url.replace(/\/$/, '');
        if (cleanUrl.endsWith('/api')) {
            cleanUrl = cleanUrl.slice(0, -4);
        }
        return cleanUrl;
    }

    // fallback to same-origin backend
    return '';
};

const API_BASE_URL = getApiBaseUrl();

export interface GenerateAnswerRequest {
    question: string;
    selectedLanguage: string;
    moduleName: string;
}

export interface GenerateAnswerResponse {
    success: boolean;
    answer: string;
    language: string;
    module: string;
    error?: string;
}

/**
 * Generate answer using the backend API
 * This implements PDF-first logic with OpenAI fallback
 */
export async function generateAnswerFromBackend(
    question: string,
    selectedLanguage: string = 'english',
    moduleName: string = 'General'
): Promise<string> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question,
                selectedLanguage,
                moduleName,
            }),
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.statusText}`);
        }

        const data: GenerateAnswerResponse = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to generate answer');
        }

        return data.answer;

    } catch (error) {
        console.error('Error calling backend API:', error);

        // Fallback messages in case backend is down
        const fallbackMessages: Record<string, string> = {
            english: "I'm currently unable to connect to the AI service. Please check your connection and try again.",
            tamil: "நான் தற்போது AI சேவையுடன் இணைக்க முடியவில்லை. உங்கள் இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
            sinhala: "මට දැනට AI සේවාව සමඟ සම්බන්ධ විය නොහැක. ඔබේ සම්බන්ධතාවය පරීක්ෂා කර නැවත උත්සාහ කරන්න.",
        };

        return fallbackMessages[selectedLanguage] || fallbackMessages.english;
    }
}

/**
 * Upload PDF to OpenAI (one-time setup)
 * This should be called from an admin interface
 */
export async function uploadPDFToBackend(): Promise<{ success: boolean; fileId?: string; error?: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/upload-pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error uploading PDF:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Generate a logic diagram using the backend API
 */
export async function generateLogicDiagram(
    prompt: string,
    selectedLanguage: string = 'english'
): Promise<{ imageUrl: string; caption: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                language: selectedLanguage,
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return { imageUrl: data.imageUrl, caption: data.caption };
    } catch (error) {
        console.error('Error generating diagram:', error);
        throw error;
    }
}

/**
 * Process an uploaded file (add to knowledge hub)
 */
export async function processUploadedFile(
    fileUrl: string,
    fileName: string
): Promise<{ success: boolean; fileId: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/process-file`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fileUrl,
                fileName,
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, fileId: data.fileId };
    } catch (error) {
        console.error('Error processing file:', error);
        throw error;
    }
}

/**
 * Check backend health
 */
export async function checkBackendHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        return response.ok;
    } catch (error) {
        console.error('Backend health check failed:', error);
        return false;
    }
}
