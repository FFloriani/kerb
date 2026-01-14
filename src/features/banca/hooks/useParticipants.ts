// Hook para gerenciamento de participantes KERB

'use client';

import { useState, useCallback } from 'react';
import { Participant, SlotCall, ParticipantFormData, SlotCallFormData, Banca } from '../types';
import { calculatePercentages, generateId } from '../utils/calculations';

interface UseParticipantsReturn {
    participantForm: ParticipantFormData;
    slotCalls: SlotCallFormData[];
    editingParticipant: Participant | null;
    setParticipantForm: React.Dispatch<React.SetStateAction<ParticipantFormData>>;
    addSlotCall: () => void;
    removeSlotCall: (index: number) => void;
    updateSlotCall: (index: number, field: 'slotName' | 'betValue', value: string) => void;
    resetForm: () => void;
    addParticipant: (currentBanca: Banca) => Banca | null;
    startEditParticipant: (participant: Participant) => void;
    updateParticipant: (currentBanca: Banca) => Banca | null;
    removeParticipant: (currentBanca: Banca, participantId: string) => Banca;
}

const INITIAL_FORM: ParticipantFormData = { name: '', contribution: '', pix: '' };
const INITIAL_SLOT_CALL: SlotCallFormData = { slotName: '', betValue: '' };

export function useParticipants(): UseParticipantsReturn {
    const [participantForm, setParticipantForm] = useState<ParticipantFormData>(INITIAL_FORM);
    const [slotCalls, setSlotCalls] = useState<SlotCallFormData[]>([INITIAL_SLOT_CALL]);
    const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

    const resetForm = useCallback(() => {
        setParticipantForm(INITIAL_FORM);
        setSlotCalls([INITIAL_SLOT_CALL]);
        setEditingParticipant(null);
    }, []);

    const addSlotCall = useCallback(() => {
        setSlotCalls(prev => [...prev, { ...INITIAL_SLOT_CALL }]);
    }, []);

    const removeSlotCall = useCallback((index: number) => {
        setSlotCalls(prev => prev.length <= 1 ? prev : prev.filter((_, i) => i !== index));
    }, []);

    const updateSlotCall = useCallback((index: number, field: 'slotName' | 'betValue', value: string) => {
        setSlotCalls(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }, []);

    const buildSlotCalls = useCallback((): SlotCall[] => {
        return slotCalls
            .filter(call => call.slotName.trim())
            .map(call => ({
                id: generateId(),
                slotName: call.slotName.trim(),
                betValue: call.betValue ? parseFloat(call.betValue) : undefined
            }));
    }, [slotCalls]);

    const addParticipant = useCallback((currentBanca: Banca): Banca | null => {
        if (!participantForm.name.trim() || !participantForm.contribution) return null;

        const contribution = parseFloat(participantForm.contribution);
        if (isNaN(contribution) || contribution <= 0) return null;

        const validSlotCalls = buildSlotCalls();

        const newParticipant: Participant = {
            id: generateId(),
            name: participantForm.name.trim(),
            contribution,
            percentage: 0,
            finalAmount: 0,
            profit: 0,
            pix: participantForm.pix.trim() || undefined,
            slotCalls: validSlotCalls.length > 0 ? validSlotCalls : undefined
        };

        const updatedParticipants = [...currentBanca.participants, newParticipant];
        const newTotal = updatedParticipants.reduce((sum, p) => sum + p.contribution, 0);

        const updatedBanca: Banca = {
            ...currentBanca,
            participants: calculatePercentages(updatedParticipants, newTotal),
            totalInvested: newTotal
        };

        resetForm();
        return updatedBanca;
    }, [participantForm, buildSlotCalls, resetForm]);

    const startEditParticipant = useCallback((participant: Participant) => {
        setEditingParticipant(participant);
        setParticipantForm({
            name: participant.name,
            contribution: participant.contribution.toString(),
            pix: participant.pix || ''
        });

        if (participant.slotCalls && participant.slotCalls.length > 0) {
            setSlotCalls(participant.slotCalls.map(call => ({
                slotName: call.slotName,
                betValue: call.betValue?.toString() || ''
            })));
        } else if (participant.slotCall) {
            setSlotCalls([{
                slotName: participant.slotCall,
                betValue: participant.betValue?.toString() || ''
            }]);
        } else {
            setSlotCalls([INITIAL_SLOT_CALL]);
        }
    }, []);

    const updateParticipant = useCallback((currentBanca: Banca): Banca | null => {
        if (!editingParticipant) return null;
        if (!participantForm.name.trim() || !participantForm.contribution) return null;

        const contribution = parseFloat(participantForm.contribution);
        if (isNaN(contribution) || contribution <= 0) return null;

        const validSlotCalls = buildSlotCalls();

        const updatedParticipants = currentBanca.participants.map(p => {
            if (p.id !== editingParticipant.id) return p;
            return {
                ...p,
                name: participantForm.name.trim(),
                contribution,
                pix: participantForm.pix.trim() || undefined,
                slotCalls: validSlotCalls.length > 0 ? validSlotCalls : undefined,
                slotCall: undefined,
                betValue: undefined
            };
        });

        const newTotal = updatedParticipants.reduce((sum, p) => sum + p.contribution, 0);

        const updatedBanca: Banca = {
            ...currentBanca,
            participants: calculatePercentages(updatedParticipants, newTotal),
            totalInvested: newTotal
        };

        resetForm();
        return updatedBanca;
    }, [editingParticipant, participantForm, buildSlotCalls, resetForm]);

    const removeParticipant = useCallback((currentBanca: Banca, participantId: string): Banca => {
        const updatedParticipants = currentBanca.participants.filter(p => p.id !== participantId);
        const newTotal = updatedParticipants.reduce((sum, p) => sum + p.contribution, 0);

        return {
            ...currentBanca,
            participants: calculatePercentages(updatedParticipants, newTotal),
            totalInvested: newTotal
        };
    }, []);

    return {
        participantForm,
        slotCalls,
        editingParticipant,
        setParticipantForm,
        addSlotCall,
        removeSlotCall,
        updateSlotCall,
        resetForm,
        addParticipant,
        startEditParticipant,
        updateParticipant,
        removeParticipant
    };
}
