// Funções de cálculo para o sistema de Banca KERB

import { Participant } from '../types';

export function calculatePercentages(
    participants: Participant[],
    total: number
): Participant[] {
    return participants.map(p => ({
        ...p,
        percentage: total > 0 ? (p.contribution / total) * 100 : 0
    }));
}

export function calculateDistribution(
    participants: Participant[],
    finalBalance: number
): Participant[] {
    const totalContributions = participants.reduce((sum, p) => sum + p.contribution, 0);

    return participants.map(p => {
        const percentage = totalContributions > 0 ? p.contribution / totalContributions : 0;
        const finalAmount = finalBalance * percentage;
        const profit = finalAmount - p.contribution;

        return {
            ...p,
            percentage: percentage * 100,
            finalAmount,
            profit
        };
    });
}

export function calculateTotalInvested(participants: Participant[]): number {
    return participants.reduce((sum, p) => sum + p.contribution, 0);
}

export function getMaxParticipation(participants: Participant[]): number {
    if (participants.length === 0) return 0;
    return Math.max(...participants.map(p => p.percentage));
}

export function generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}
