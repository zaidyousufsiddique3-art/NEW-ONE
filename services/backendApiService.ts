/**
 * Frontend service to communicate with the backend API
 * This replaces direct OpenAI calls from the frontend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Generate answer using the backend API
 */
export async function generateAnswerFromBackend(
    question: string,
    selectedLanguage: string = 'english',
    moduleName: string = 'General',
    images: string[] = [],
    subject: string = 'General'
): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/generate-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, selectedLanguage, moduleName, images, subject }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || 'Backend error');

    return data.answer;
}

/**
 * Upload PDF to backend
 */
export async function uploadPDFToBackend(): Promise<{ success: boolean; fileId?: string; error?: string }> {
    const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    return await response.json();
}

/**
 * Generate a logic diagram
 */
export async function generateLogicDiagram(
    prompt: string,
    selectedLanguage: string = 'english'
): Promise<{ imageUrl: string; caption: string }> {
    const response = await fetch(`${API_BASE_URL}/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language: selectedLanguage }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
}

/**
 * Process uploaded file
 */
export async function processUploadedFile(
    fileUrl: string,
    fileName: string,
    subject?: string
): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/process-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl, fileName, subject }),
    });

    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return data.fileId;
}

/**
 * Health check
 */
export async function checkBackendHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
}
