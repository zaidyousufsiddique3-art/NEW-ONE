import React from 'react';

export const KnowledgePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#1a1f35] to-[#0a0f1c] text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">Knowledge Base</h1>
                <p className="text-slate-400">Manage your uploaded study materials here.</p>
            </div>
        </div>
    );
};
