// Funções de exportação para o sistema de Banca KERB

import { Banca } from '../types';

export function exportToCSV(banca: Banca): void {
    const headers = ['Nome', 'Contribuição', 'Percentual', 'Valor Final', 'Lucro/Prejuízo', 'PIX'];
    const rows = banca.participants.map(p => [
        p.name,
        p.contribution.toFixed(2),
        p.percentage.toFixed(2) + '%',
        p.finalAmount.toFixed(2),
        (p.profit >= 0 ? '+' : '') + p.profit.toFixed(2),
        p.pix || ''
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kerb_banca_${banca.title}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

export function formatPercent(value: number): string {
    return `${value.toFixed(1)}%`;
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
