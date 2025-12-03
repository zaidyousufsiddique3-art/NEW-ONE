import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Upload, Check, BookOpen } from 'lucide-react';
import { useLanguage, Language, Subject } from '../contexts/LanguageContext';
import { FileUploaderModal } from '../components/FileUploaderModal';

export const LanguageSelectionPage: React.FC = () => {
    const { setLanguage, setSubject } = useLanguage();
    const navigate = useNavigate();
    const [selectedLang, setSelectedLang] = useState<Language | null>(null);
    const [selectedSubj, setSelectedSubj] = useState<Subject | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleLanguageSelect = (lang: Language) => {
        setSelectedLang(lang);
    };

    const handleSubjectSelect = (subj: Subject) => {
        setSelectedSubj(subj);
    };

    const handleContinue = () => {
        if (selectedLang && selectedSubj) {
            setLanguage(selectedLang);
            setSubject(selectedSubj);
            navigate('/home');
        }
    };

    const languages = [
        { code: 'english' as Language, label: 'English', emoji: '🇬🇧' },
        { code: 'tamil' as Language, label: 'தமிழ்', emoji: '🇱🇰' },
        { code: 'sinhala' as Language, label: 'සිංහල', emoji: '🇱🇰' }
    ];

    const subjects: Subject[] = ['Accounting', 'ICT', 'Business Studies'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#1a1f35] to-[#0a0f1c] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full space-y-6"
            >
                {/* Header */}
                <div className="text-center space-y-2 relative">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-cyan to-brand-purple"
                    >
                        <Globe className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white">Your AI-Powered Study Assistant</h1>
                    <p className="text-sm text-slate-400">Select language, subject & upload your study materials</p>

                    {/* Upload Files Button - Top Right */}
                    <div className="absolute top-0 right-0">
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#7B4DFF] hover:bg-[#6B3DEF] text-white rounded-lg transition-all font-medium text-sm shadow-lg"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Files to Database
                        </button>
                    </div>
                </div>

                {/* Language Selection */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <span>1.</span> Choose Language
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageSelect(lang.code)}
                                className={`p-3 rounded-lg border transition-all ${selectedLang === lang.code
                                    ? 'bg-brand-cyan/20 border-brand-cyan text-white'
                                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{lang.emoji}</div>
                                <div className="text-xs font-medium">{lang.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subject Selection */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <span>2.</span> Select Subject
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                        {subjects.map((subj) => (
                            <button
                                key={subj}
                                onClick={() => handleSubjectSelect(subj)}
                                className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center gap-2 ${selectedSubj === subj
                                    ? 'bg-brand-purple/20 border-brand-purple text-white'
                                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                    }`}
                            >
                                <BookOpen className={`w-6 h-6 ${selectedSubj === subj ? 'text-brand-purple' : 'text-slate-400'}`} />
                                <div className="text-xs font-medium">{subj}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Continue Button */}
                <button
                    onClick={handleContinue}
                    disabled={!selectedLang || !selectedSubj}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-bold text-lg shadow-lg shadow-brand-cyan/20 hover:shadow-brand-cyan/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Check className="w-5 h-5" />
                    {selectedLang && selectedSubj ? 'Continue to Study Tools' : 'Select Language & Subject to Continue'}
                </button>

                <p className="text-xs text-center text-slate-500">
                    Uploaded materials work across all languages • You can add more files later from the home page
                </p>
            </motion.div>

            {/* Upload Modal */}
            <FileUploaderModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadComplete={() => {
                    // Optional: Refresh list or show notification
                }}
            />
        </div>
    );
};
