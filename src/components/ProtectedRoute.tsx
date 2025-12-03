import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { language, subject } = useLanguage();

    if (!language || !subject) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
