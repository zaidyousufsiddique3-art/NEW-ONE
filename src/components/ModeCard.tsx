import React from 'react';
import { motion } from 'framer-motion';
import { ToolConfig } from '../types';

interface ModeCardProps {
    tool: ToolConfig;
    onClick: () => void;
    index: number;
}

export const ModeCard: React.FC<ModeCardProps> = ({ tool, onClick, index }) => {
    const Icon = tool.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={onClick}
            className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 hover:border-brand-cyan/50 transition-all duration-300 overflow-hidden"
        >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/0 to-brand-purple/0 group-hover:from-brand-cyan/10 group-hover:to-brand-purple/10 transition-all duration-300" />

            <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-purple flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{tool.title}</h3>
                    <p className="text-sm text-slate-400">{tool.description}</p>
                </div>
            </div>
        </motion.div>
    );
};
