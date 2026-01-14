// Modal criar banca - Tema Dourado

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';

interface CreateBancaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, description: string) => void;
}

export default function CreateBancaModal({ isOpen, onClose, onSubmit }: CreateBancaModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(title, description);
        setTitle('');
        setDescription('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 w-full max-w-md gold-border"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold gold-text">Nova Banca</h3>
                    <button onClick={onClose} className="p-2 text-yellow-100/50 hover:text-yellow-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-yellow-100/70 text-sm mb-1 block">Título</label>
                        <input
                            type="text"
                            placeholder="Ex: Banca do Kerb"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="text-yellow-100/70 text-sm mb-1 block">Descrição</label>
                        <textarea
                            placeholder="Descrição opcional"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg resize-none"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 px-4 py-3 bg-yellow-100/10 text-yellow-100 rounded-lg hover:bg-yellow-100/20">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="flex-1 px-4 py-3 btn-gold rounded-lg flex items-center justify-center gap-2">
                        <Plus size={18} />
                        Criar Banca
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
