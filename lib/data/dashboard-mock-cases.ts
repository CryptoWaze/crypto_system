import type { DashboardCaseItem } from '@/lib/types/dashboard-case-item';

function formatAmount(decimal: string): string {
  const n = parseFloat(decimal);
  if (!Number.isFinite(n)) return decimal;
  if (n >= 0.01) return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
  if (n === 0) return '0';
  return decimal;
}

export const MOCK_DASHBOARD_CASES: DashboardCaseItem[] = [
  {
    id: 'mock-1',
    name: 'Fraude exchange - mar/25',
    createdAt: '2025-03-12T14:32:00.000Z',
    amountDisplay: formatAmount('1.500'),
    transactionCount: 1,
  },
  {
    id: 'mock-2',
    name: 'Recuperação ativos - cliente XYZ',
    createdAt: '2025-03-10T09:15:00.000Z',
    amountDisplay: formatAmount('0.500'),
    transactionCount: 2,
  },
  {
    id: 'mock-3',
    name: 'Perícia cível - processo 001',
    createdAt: '2025-03-08T16:45:00.000Z',
    amountDisplay: formatAmount('3.200'),
    transactionCount: 1,
  },
  {
    id: 'mock-4',
    name: 'Rastreio USDT - Binance',
    createdAt: '2025-03-05T11:20:00.000Z',
    amountDisplay: formatAmount('10.000'),
    transactionCount: 1,
  },
  {
    id: 'mock-5',
    name: 'Compliance - análise Q1',
    createdAt: '2025-03-01T08:00:00.000Z',
    amountDisplay: formatAmount('0.750'),
    transactionCount: 2,
  },
];
