// Hook para gerenciamento de bancas KERB

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Banca } from '../types';
import { calculateDistribution, generateId } from '../utils/calculations';

// Storage keys específicas para KERB (não conflita com leobanca)
const STORAGE_KEYS = {
    BANCAS: 'kerb_bancas',
    CURRENT: 'kerb_currentBanca'
} as const;

interface UseBancaReturn {
    bancas: Banca[];
    currentBanca: Banca | null;
    isLoading: boolean;
    createBanca: (title: string, description: string) => void;
    selectBanca: (banca: Banca) => void;
    closeBanca: (bancaToClose: Banca, finalBalance: number) => void;
    reopenBanca: (banca: Banca) => void;
    updateFinalBalance: (balance: number) => void;
    updateCurrentBanca: (banca: Banca) => void;
    clearCurrentBanca: () => void;
    clearAllData: () => void;
}

export function useBanca(): UseBancaReturn {
    const [bancas, setBancas] = useState<Banca[]>([]);
    const [currentBanca, setCurrentBanca] = useState<Banca | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedBancas = localStorage.getItem(STORAGE_KEYS.BANCAS);
        const savedCurrent = localStorage.getItem(STORAGE_KEYS.CURRENT);

        if (savedBancas) {
            setBancas(JSON.parse(savedBancas));
        }
        if (savedCurrent) {
            setCurrentBanca(JSON.parse(savedCurrent));
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(STORAGE_KEYS.BANCAS, JSON.stringify(bancas));
        }
    }, [bancas, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            if (currentBanca) {
                localStorage.setItem(STORAGE_KEYS.CURRENT, JSON.stringify(currentBanca));
            } else {
                localStorage.removeItem(STORAGE_KEYS.CURRENT);
            }
        }
    }, [currentBanca, isLoading]);

    const createBanca = useCallback((title: string, description: string) => {
        const newBanca: Banca = {
            id: generateId(),
            title: title.trim() || `Banca ${new Date().toLocaleDateString('pt-BR')}`,
            description: description.trim(),
            startDate: new Date().toISOString(),
            participants: [],
            totalInvested: 0,
            finalBalance: 0,
            isLocked: false,
            allowDynamic: false,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        setCurrentBanca(newBanca);
    }, []);

    const selectBanca = useCallback((banca: Banca) => {
        setCurrentBanca(banca);
    }, []);

    const closeBanca = useCallback((bancaToClose: Banca, finalBalance: number) => {
        const closedBanca: Banca = {
            ...bancaToClose,
            status: 'closed',
            isLocked: true,
            finalBalance: finalBalance,
            totalInvested: bancaToClose.participants.reduce((sum, p) => sum + p.contribution, 0),
            participants: calculateDistribution(bancaToClose.participants, finalBalance)
        };

        setBancas(prev => {
            const existing = prev.findIndex(b => b.id === closedBanca.id);
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = closedBanca;
                return updated;
            }
            return [...prev, closedBanca];
        });

        setCurrentBanca(null);
    }, []);

    const reopenBanca = useCallback((banca: Banca) => {
        const reopened: Banca = {
            ...banca,
            id: generateId(),
            status: 'active',
            isLocked: false,
            startDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            finalBalance: 0,
            participants: banca.participants.map(p => ({
                ...p,
                id: generateId(),
                finalAmount: 0,
                profit: 0
            }))
        };
        setCurrentBanca(reopened);
    }, []);

    const updateFinalBalance = useCallback((balance: number) => {
        setCurrentBanca(prev => prev ? { ...prev, finalBalance: balance } : null);
    }, []);

    const updateCurrentBanca = useCallback((banca: Banca) => {
        setCurrentBanca(banca);
    }, []);

    const clearCurrentBanca = useCallback(() => {
        setCurrentBanca(null);
    }, []);

    const clearAllData = useCallback(() => {
        localStorage.removeItem(STORAGE_KEYS.BANCAS);
        localStorage.removeItem(STORAGE_KEYS.CURRENT);
        setBancas([]);
        setCurrentBanca(null);
    }, []);

    return {
        bancas,
        currentBanca,
        isLoading,
        createBanca,
        selectBanca,
        closeBanca,
        reopenBanca,
        updateFinalBalance,
        updateCurrentBanca,
        clearCurrentBanca,
        clearAllData
    };
}
