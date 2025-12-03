import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ModeCard } from './components/ModeCard';
import { ModeModal } from './components/ModeModal';
import { ResultBox } from './components/ResultBox';
import { ToolConfig, ToolId } from './types';
import { MessageSquare, FileQuestion, CreditCard, ListChecks, FileText, ScanLine } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import { getTranslation } from './utils/translations';

function App() {
    const { language, subject } = useLanguage();
    const [selectedTool, setSelectedTool] = useState<ToolConfig | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const t = (key: keyof typeof import('./utils/translations').translations.english) =>
        getTranslation(language || 'english', key);

    const tools: ToolConfig[] = [
        {
            id: ToolId.ASK_QUESTION,
            title: t('askQuestion'),
            description: t('askQuestionDesc'),
            icon: MessageSquare,
            promptTemplate: (topic: string) => topic,
        },
        {
            id: ToolId.EXAM_QUESTIONS,
            title: t('examQuestions'),
            description: t('examQuestionsDesc'),
            icon: FileQuestion,
            promptTemplate: (topic: string, notes?: string) =>
                `Generate 3 A-Level ICT exam-style questions on "${topic}". ${notes ? `Context: ${notes}` : ''} Include mark schemes.`,
        },
        {
            id: ToolId.FLASHCARDS,
            title: t('flashcards'),
            description: t('flashcardsDesc'),
            icon: CreditCard,
            promptTemplate: (topic: string, notes?: string) =>
                `Create 5 flashcards for "${topic}". ${notes ? `Context: ${notes}` : ''} Format: Q: [question] | A: [answer]`,
        },
        {
            id: ToolId.REVISION_QUESTIONS,
            title: t('revisionQuestions'),
            description: t('revisionQuestionsDesc'),
            icon: ListChecks,
            promptTemplate: (topic: string, notes?: string) =>
                `Generate 10 quick revision questions on "${topic}". ${notes ? `Context: ${notes}` : ''}`,
        },
        {
            id: ToolId.CASE_STUDY,
            title: t('caseStudy'),
            description: t('caseStudyDesc'),
            icon: FileText,
            promptTemplate: (topic: string, notes?: string) =>
                `Provide a structured case study answer for "${topic}". ${notes ? `Scenario: ${notes}` : ''}`,
        },
        {
            id: ToolId.IMAGE_ANALYSIS,
            title: t('imageAnalysis'),
            description: t('imageAnalysisDesc'),
            icon: ScanLine,
            promptTemplate: (topic: string) => topic,
        },
    ];

    const handleToolClick = (tool: ToolConfig) => {
        setSelectedTool(tool);
        setIsModalOpen(true);
        setResult(null);
    };

    const handleGenerate = async (topic: string, notes: string) => {
        if (!selectedTool || !language) return;

        setIsGenerating(true);
        try {
            const fullQuestion = notes
                ? `${selectedTool.promptTemplate(topic, notes)}`
                : selectedTool.promptTemplate(topic, '');

            const { generateAnswerFromBackend } = await import('./services/backendApiService');
            const answer = await generateAnswerFromBackend(
                fullQuestion,
                language,
                selectedTool.title,
                [],
                subject || 'General'
            );

            setResult(answer);
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert("Failed to generate content. Please check your connection.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#1a1f35] to-[#0a0f1c] text-white">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <AnimatePresence mode="wait">
                    {!result && (
                        <motion.div
                            key="header"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center mb-12 space-y-4"
                        >
                            <div className="inline-block">
                                <span className="text-xs font-semibold tracking-wide uppercase text-brand-cyan">
                                    {t('aiPoweredLearning')}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                                <span className="block text-white mb-2">{t('whatWouldYouLike')}</span>
                                <span className="neon-text-gradient">{t('generateToday')}</span>
                            </h1>

                            <p className="text-base text-slate-400 max-w-2xl mx-auto font-light">
                                {t('studyToolsSubtitlePrefix')} <span className="text-brand-cyan font-medium">{subject ? t(subject === 'Business Studies' ? 'subjectBusiness' : `subject${subject}`) : ''}</span> {t('studyToolsSubtitleSuffix')}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {result ? (
                        <ResultBox
                            key="result"
                            result={result}
                            onBack={() => setResult(null)}
                            toolTitle={selectedTool?.title || ''}
                        />
                    ) : (
                        <motion.div
                            key="tools"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {tools.map((tool, index) => (
                                <ModeCard
                                    key={tool.id}
                                    tool={tool}
                                    onClick={() => handleToolClick(tool)}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <ModeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tool={selectedTool}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
            />
        </div>
    );
}

export default App;
