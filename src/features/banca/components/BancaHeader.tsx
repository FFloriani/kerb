// Cabeçalho da banca ativa - Tema Dourado

'use client';

import { motion } from 'framer-motion';
import { Plus, CheckCircle, ArrowLeft } from 'lucide-react';
import { Banca } from '../types';
import { formatDate, formatCurrency } from '../utils/export';

interface BancaHeaderProps {
    banca: Banca;
    onAddParticipant: () => void;
    onCloseBanca: () => void;
    onBack: () => void;
    onUpdateFinalBalance: (balance: number) => void;
}

export default function BancaHeader({ banca, onAddParticipant, onCloseBanca, onBack, onUpdateFinalBalance }: BancaHeaderProps) {
    return (
        <div className="card-gold rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-2 text-yellow-100/50 hover:text-yellow-100 hover:bg-yellow-500/10 rounded-lg" title="Voltar">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold gold-text">{banca.title}</h2>
                            {banca.description && <p className="text-yellow-100/70 text-sm">{banca.description}</p>}
                            <p className="text-yellow-100/50 text-xs mt-1">Iniciada em {formatDate(banca.startDate)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <motion.button
                        onClick={onAddParticipant}
                        className="px-6 py-2 btn-gold rounded-lg flex items-center gap-2 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus size={18} />
                        ADICIONAR
                    </motion.button>

                    <motion.button
                        onClick={onCloseBanca}
                        className="px-6 py-2 bg-gradient-to-r from-red-900 to-red-700 text-red-100 border border-red-500/30 rounded-lg flex items-center gap-2 shadow-lg hover:from-red-800 hover:to-red-600 transition-all font-serif tracking-wider font-bold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <CheckCircle size={18} />
                        ENCERRAR
                    </motion.button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                <label className="text-yellow-100/70 text-sm whitespace-nowrap">Saldo Final (R$):</label>
                <input
                    type="number"
                    placeholder="0.00"
                    value={banca.finalBalance || ''}
                    onChange={(e) => onUpdateFinalBalance(parseFloat(e.target.value) || 0)}
                    className="flex-1 px-4 py-2 rounded-lg"
                />
                <span className="text-yellow-400 font-bold text-lg">{formatCurrency(banca.finalBalance)}</span>
            </div>
        </div>
    );
}
