// Tipos e interfaces para o sistema de Banca KERB

export interface SlotCall {
    id: string;
    slotName: string;
    betValue?: number;
}

export interface Participant {
    id: string;
    name: string;
    contribution: number;
    percentage: number;
    finalAmount: number;
    profit: number;
    pix?: string;
    slotCalls?: SlotCall[];
    slotCall?: string;
    betValue?: number;
}

export interface Banca {
    id: string;
    title: string;
    startDate: string;
    description: string;
    participants: Participant[];
    totalInvested: number;
    finalBalance: number;
    isLocked: boolean;
    allowDynamic: boolean;
    status: 'active' | 'closed';
    createdAt: string;
}

export interface ParticipantFormData {
    name: string;
    contribution: string;
    pix: string;
}

export interface SlotCallFormData {
    slotName: string;
    betValue: string;
}
