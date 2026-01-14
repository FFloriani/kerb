// Modal adicionar participante - Tema Dourado

'use client';

import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { ParticipantFormData, SlotCallFormData } from '../types';
import SlotCallsInput from './SlotCallsInput';

interface AddParticipantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    participantForm: ParticipantFormData;
    setParticipantForm: React.Dispatch<React.SetStateAction<ParticipantFormData>>;
    slotCalls: SlotCallFormData[];
    onAddSlotCall: () => void;
    onRemoveSlotCall: (index: number) => void;
    onUpdateSlotCall: (index: number, field: 'slotName' | 'betValue', value: string) => void;
}

export default function AddParticipantModal({
    isOpen, onClose, onSubmit, participantForm, setParticipantForm,
    slotCalls, onAddSlotCall, onRemoveSlotCall, onUpdateSlotCall
}: AddParticipantModalProps) {
    if (!isOpen) return null;

    const handleSubmit = () => { onSubmit(); onClose(); };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 w-full max-w-md gold-border max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold gold-text">Adicionar Participante</h3>
                    <button onClick={onClose} className="p-2 text-yellow-100/50 hover:text-yellow-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-yellow-100/70 text-sm mb-1 block">Nome *</label>
                        <input
                            type="text"
                            placeholder="Nome do participante"
                            value={participantForm.name}
                            onChange={(e) => setParticipantForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="text-yellow-100/70 text-sm mb-1 block">Contribuição (R$) *</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={participantForm.contribution}
                            onChange={(e) => setParticipantForm(prev => ({ ...prev, contribution: e.target.value }))}
                            className="w-full px-4 py-3 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="text-yellow-100/70 text-sm mb-1 block">Chave PIX</label>
                        <input
                            type="text"
                            placeholder="CPF, E-mail ou Celular"
                            value={participantForm.pix}
                            onChange={(e) => setParticipantForm(prev => ({ ...prev, pix: e.target.value }))}
                            className="w-full px-4 py-3 rounded-lg"
                        />
                    </div>
                    <SlotCallsInput slotCalls={slotCalls} onAdd={onAddSlotCall} onRemove={onRemoveSlotCall} onUpdate={onUpdateSlotCall} />
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 px-4 py-3 bg-yellow-100/10 text-yellow-100 rounded-lg hover:bg-yellow-100/20">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="flex-1 px-4 py-3 btn-gold rounded-lg flex items-center justify-center gap-2">
                        <Plus size={18} />
                        Adicionar
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
