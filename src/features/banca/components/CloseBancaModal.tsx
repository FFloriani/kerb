// Modal encerrar banca - Tema Dourado

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Banca } from '../types';
import { formatCurrency } from '../utils/export';
import { calculateDistribution } from '../utils/calculations';

interface CloseBancaModalProps {
    isOpen: boolean;
    banca: Banca | null;
    onClose: () => void;
    onConfirm: (finalBalance: number) => void;
}

export default function CloseBancaModal({ isOpen, banca, onClose, onConfirm }: CloseBancaModalProps) {
    const [finalBalance, setFinalBalance] = useState('');

    if (!isOpen || !banca) return null;

    const balance = parseFloat(finalBalance) || 0;
    const previewParticipants = calculateDistribution(banca.participants, balance);
    const totalProfit = balance - banca.totalInvested;
    const isProfitable = totalProfit >= 0;

    const handleConfirm = () => {
        if (balance <= 0) { alert('Informe o saldo final.'); return; }
        onConfirm(balance);
        setFinalBalance('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 w-full max-w-lg gold-border max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold gold-text">Encerrar Banca</h3>
                    <button onClick={onClose} className="p-2 text-yellow-100/50 hover:text-yellow-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <div className="card-gold rounded-lg p-4 mb-6">
                    <h4 className="text-yellow-100 font-semibold mb-2">{banca.title}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-yellow-100/50">Total Investido</p>
                            <p className="text-yellow-400 font-bold">{formatCurrency(banca.totalInvested)}</p>
                        </div>
                        <div>
                            <p className="text-yellow-100/50">Participantes</p>
                            <p className="text-yellow-100 font-bold">{banca.participants.length}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-yellow-100/70 text-sm mb-2 block">Saldo Final da Banca *</label>
                    <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" size={20} />
                        <input
                            type="number"
                            placeholder="0.00"
                            value={finalBalance}
                            onChange={(e) => setFinalBalance(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-lg text-xl"
                            autoFocus
                        />
                    </div>
                </div>

                {balance > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                        <div className={`p-4 rounded-lg mb-4 ${isProfitable ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                            <div className="flex items-center gap-2">
                                {isProfitable ? <TrendingUp className="text-green-400" size={24} /> : <TrendingDown className="text-red-400" size={24} />}
                                <div>
                                    <p className="text-yellow-100/70 text-sm">{isProfitable ? 'Lucro Total' : 'Prejuízo Total'}</p>
                                    <p className={`font-bold text-xl ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                                        {isProfitable ? '+' : ''}{formatCurrency(totalProfit)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h4 className="text-yellow-100/70 text-sm mb-2">Distribuição:</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {previewParticipants.map((p) => (
                                <div key={p.id} className="flex items-center justify-between card-gold rounded-lg p-3">
                                    <span className="text-yellow-100 text-sm">{p.name}</span>
                                    <div className="text-right">
                                        <p className="text-yellow-100 font-bold">{formatCurrency(p.finalAmount)}</p>
                                        <p className={`text-xs ${p.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {p.profit >= 0 ? '+' : ''}{formatCurrency(p.profit)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-3 bg-yellow-100/10 text-yellow-100 rounded-lg hover:bg-yellow-100/20">
                        Cancelar
                    </button>
                    <button onClick={handleConfirm} disabled={balance <= 0} className="flex-1 px-4 py-3 btn-gold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                        <CheckCircle size={18} />
                        Encerrar
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
