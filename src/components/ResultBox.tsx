import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Download } from 'lucide-react';
import { useState } from 'react';

interface ResultBoxProps {
    result: string;
    onBack: () => void;
    toolTitle: string;
}

export const ResultBox: React.FC<ResultBoxProps> = ({ result, onBack, toolTitle }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = async () => {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(toolTitle, 20, 20);
        doc.setFontSize(12);

        const splitText = doc.splitTextToSize(result, 170);
        doc.text(splitText, 20, 40);

        doc.save(`${toolTitle.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Tools
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
                    >
                        <Copy className="w-4 h-4" />
                        {copied ? 'Copied!' : 'Copy'}
                    </button>

                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-cyan hover:bg-brand-cyan/80 rounded-lg text-black font-medium transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">{toolTitle}</h2>
                <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-slate-300 font-sans leading-relaxed">
                        {result}
                    </pre>
                </div>
            </div>
        </motion.div>
    );
};
