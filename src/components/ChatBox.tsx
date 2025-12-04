import React, { useState, useRef, useEffect } from 'react';
import { generateAnswerFromBackend } from '../services/backendApiService';
import { motion } from 'framer-motion';
import { Download, Image as ImageIcon, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ToolId } from '../types/index';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    images?: string[];
}

interface ChatBoxProps {
    toolId: string;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ toolId }) => {
    const { language, subject } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isImageAnalysis = toolId === ToolId.IMAGE_ANALYSIS;

    const [note, setNote] = useState('');

    useEffect(() => {
        if (messages.length === 0 && subject) {
            const welcomeMap: Record<string, string> = {
                english: `Hi, how can I help you?`,
                tamil: `வணக்கம், நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?`,
                sinhala: `හායි, මට ඔබට කෙසේ උදව් කළ හැකිද?`
            };
            setMessages([{ role: 'assistant', content: welcomeMap[language || 'english'] || welcomeMap.english }]);
        }
    }, [subject, language]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        setSelectedImages(prev => [...prev, reader.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = async () => {
        if ((!input.trim() && selectedImages.length === 0) || !language) return;

        const userMsg = input.trim();
        const userNote = note.trim();
        const combinedMsg = isImageAnalysis && userNote ? `${userMsg}\n\nNote: ${userNote}` : userMsg;

        const currentImages = [...selectedImages];

        setMessages(prev => [...prev, { role: 'user', content: combinedMsg, images: currentImages }]);
        setInput('');
        setNote('');
        setSelectedImages([]);
        setIsGenerating(true);

        try {
            const answer = await generateAnswerFromBackend(
                combinedMsg,
                language,
                isImageAnalysis ? 'Image Analysis' : 'Ask Question',
                currentImages,
                subject || 'General'
            );
            setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error generating response. Please check your connection.' }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`max-w-[80%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'} `}
                    >
                        <div
                            className={`rounded-lg p-3 ${msg.role === 'user'
                                ? 'bg-brand-cyan text-black'
                                : 'bg-white/10 text-white whitespace-pre-wrap'
                                }`}
                        >
                            {msg.images && msg.images.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {msg.images.map((img, i) => (
                                        <img key={i} src={img} alt="Uploaded" className="w-24 h-24 object-cover rounded-md border border-black/10" />
                                    ))}
                                </div>
                            )}
                            {msg.content}
                        </div>
                    </motion.div>
                ))}

                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mr-auto max-w-[80%]"
                    >
                        <div className="rounded-lg p-3 bg-white/10 text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce delay-200" />
                        </div>
                    </motion.div>
                )}
            </div>

            {selectedImages.length > 0 && (
                <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-white/10 bg-white/5">
                    {selectedImages.map((img, idx) => (
                        <div key={idx} className="relative shrink-0">
                            <img src={img} alt="Preview" className="w-16 h-16 object-cover rounded-md border border-white/20" />
                            <button
                                onClick={() => removeImage(idx)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isImageAnalysis && (
                <div className="px-2 pb-2 border-t border-white/10 bg-white/5">
                    <input
                        type="text"
                        className="w-full bg-transparent text-white placeholder-gray-500 text-sm px-3 py-1.5 focus:outline-none"
                        placeholder="Add an optional note..."
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        disabled={isGenerating}
                    />
                </div>
            )}

            <div className="flex items-center gap-2 p-2 border-t border-white/10">
                {isImageAnalysis && (
                    <>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 bg-white/5 text-slate-300 rounded-md hover:bg-white/10 transition border border-white/10"
                            title="Upload Images"
                        >
                            <ImageIcon className="w-5 h-5" />
                        </button>
                    </>
                )}

                <input
                    type="text"
                    className="flex-1 bg-white/5 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-cyan/50"
                    placeholder={isImageAnalysis ? "Ask a question about the images..." : "Ask a question…"}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    disabled={isGenerating}
                />

                <button
                    onClick={() => {
                        import('jspdf').then(({ jsPDF }) => {
                            const doc = new jsPDF();
                            doc.setFontSize(16);
                            doc.text("Chat History", 20, 20);
                            doc.setFontSize(12);
                            let y = 40;
                            messages.forEach(msg => {
                                const role = msg.role === 'user' ? 'You: ' : 'AI: ';
                                const text = role + msg.content;
                                const splitText = doc.splitTextToSize(text, 170);
                                doc.text(splitText, 20, y);
                                y += splitText.length * 7 + 5;
                                if (y > 280) {
                                    doc.addPage();
                                    y = 20;
                                }
                            });
                            doc.save('chat_history.pdf');
                        });
                    }}
                    className="px-4 py-2 bg-white/5 text-slate-300 rounded-md hover:bg-white/10 transition border border-white/10"
                    title="Download Chat"
                >
                    <Download className="w-5 h-5" />
                </button>

                <button
                    onClick={handleSend}
                    disabled={isGenerating || (!input.trim() && selectedImages.length === 0)}
                    className="px-4 py-2 bg-brand-cyan text-black rounded-md hover:bg-brand-cyan/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </div>
        </div>
    );
};
