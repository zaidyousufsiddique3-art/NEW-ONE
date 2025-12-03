import React, { createContext, useContext, useState, ReactNode } from 'react';

// Supported languages and subjects
export type Language = 'english' | 'tamil' | 'sinhala';
export type Subject = 'Accounting' | 'ICT' | 'Business Studies';

// Language context type
interface LanguageContextType {
    language: Language | null;
    setLanguage: (lang: Language) => void;
    subject: Subject | null;
    setSubject: (subj: Subject) => void;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language | null>(() => {
        const saved = localStorage.getItem('selectedLanguage');
        return saved as Language | null;
    });

    const [subject, setSubjectState] = useState<Subject | null>(() => {
        const saved = localStorage.getItem('selectedSubject');
        return saved as Subject | null;
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('selectedLanguage', lang);
    };

    const setSubject = (subj: Subject) => {
        setSubjectState(subj);
        localStorage.setItem('selectedSubject', subj);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, subject, setSubject }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Hook to use language context
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
