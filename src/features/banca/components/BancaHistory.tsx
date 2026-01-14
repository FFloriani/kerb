// Modal histórico de bancas - Tema Dourado

'use client';

import { motion } from 'framer-motion';
import { X, Download, RefreshCw, Calendar, Users, DollarSign } from 'lucide-react';
import { Banca } from '../types';
import { formatCurrency, formatDate, exportToCSV } from '../utils/export';

interface BancaHistoryProps {
    isOpen: boolean;
    bancas: Banca[];
    onClose: () => void;
    onReopen: (banca: Banca) => void;
}

export default function BancaHistory({ isOpen, bancas, onClose, onReopen }: BancaHistoryProps) {
    if (!isOpen) return null;

    const closedBancas = bancas.filter(b => b.status === 'closed');

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 w-full max-w-2xl gold-border max-h-[80vh] overflow-hidden flex flex-col"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold gold-text">Histórico de Bancas</h3>
                    <button onClick={onClose} className="p-2 text-yellow-100/50 hover:text-yellow-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {closedBancas.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar size={48} className="mx-auto text-yellow-100/20 mb-3" />
                        <p className="text-yellow-100/50">Nenhuma banca encerrada ainda</p>
                    </div>
                ) : (
                    <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                        {closedBancas.map((banca, index) => (
                            <motion.div
                                key={banca.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="card-gold rounded-lg p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-yellow-100 font-semibold">{banca.title}</h4>
                                        <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                            <span className="flex items-center gap-1 text-yellow-100/60">
                                                <Calendar size={14} />
                                                {formatDate(banca.startDate)}
                                            </span>
                                            <span className="flex items-center gap-1 text-yellow-100/60">
                                                <Users size={14} />
                                                {banca.participants.length} participantes
                                            </span>
                                            <span className="flex items-center gap-1 text-yellow-400">
                                                <DollarSign size={14} />
                                                {formatCurrency(banca.finalBalance)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => exportToCSV(banca)}
                                            className="p-2 text-yellow-100/50 hover:text-green-400 hover:bg-green-500/10 rounded-lg"
                                            title="Exportar CSV"
                                        >
                                            <Download size={18} />
                                        </button>
                                        <button
                                            onClick={() => { onReopen(banca); onClose(); }}
                                            className="p-2 text-yellow-100/50 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg"
                                            title="Reabrir Banca"
                                        >
                                            <RefreshCw size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-yellow-500/20">
                    <button onClick={onClose} className="w-full px-4 py-3 bg-yellow-100/10 text-yellow-100 rounded-lg hover:bg-yellow-100/20">
                        Fechar
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
