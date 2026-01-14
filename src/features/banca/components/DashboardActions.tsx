// Botões de ação do dashboard - Tema Dourado

'use client';

import { motion } from 'framer-motion';
import { Plus, History } from 'lucide-react';

interface DashboardActionsProps {
    onCreateBanca: () => void;
    onShowHistory: () => void;
}

export default function DashboardActions({ onCreateBanca, onShowHistory }: DashboardActionsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
            <motion.button
                onClick={onCreateBanca}
                className="card-gold p-6 rounded-xl text-slate-100 text-center gold-glow hover:brightness-110 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-amber-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Plus size={32} className="text-white drop-shadow-md" />
                </div>
                <h3 className="text-xl font-bold mb-2 gold-text tracking-wider">NOVA BANCA</h3>
                <p className="text-yellow-100/70 font-sans text-sm">Criar nova banca compartilhada</p>
            </motion.button>

            <motion.button
                onClick={onShowHistory}
                className="card-gold p-6 rounded-xl text-slate-100 text-center hover:brightness-110 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 border border-yellow-500/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <History size={32} className="text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-yellow-500 tracking-wider">HISTÓRICO</h3>
                <p className="text-yellow-100/60 font-sans text-sm">Ver bancas anteriores</p>
            </motion.button>
        </motion.div>
    );
}
