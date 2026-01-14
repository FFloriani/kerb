// Input para múltiplas slot calls - Tema Dourado

'use client';

import { Plus, Trash2 } from 'lucide-react';
import { SlotCallFormData } from '../types';

interface SlotCallsInputProps {
    slotCalls: SlotCallFormData[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onUpdate: (index: number, field: 'slotName' | 'betValue', value: string) => void;
}

export default function SlotCallsInput({
    slotCalls,
    onAdd,
    onRemove,
    onUpdate
}: SlotCallsInputProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-yellow-100/70 text-sm">Calls de Slot</label>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 rounded transition-colors"
                >
                    <Plus size={14} />
                    Adicionar
                </button>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {slotCalls.map((call, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <input
                            type="text"
                            placeholder="Nome do Slot"
                            value={call.slotName}
                            onChange={(e) => onUpdate(index, 'slotName', e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg text-sm"
                        />
                        <input
                            type="number"
                            placeholder="Valor"
                            value={call.betValue}
                            onChange={(e) => onUpdate(index, 'betValue', e.target.value)}
                            className="w-24 px-3 py-2 rounded-lg text-sm"
                        />
                        {slotCalls.length > 1 && (
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
