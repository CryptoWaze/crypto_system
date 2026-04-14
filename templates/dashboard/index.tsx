'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AppHeader } from '@/components/common/appHeader';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { DashboardCaseCard } from '@/components/dashboard/dashboard-case-card';
import { Button } from '@/components/ui/button';
import { getUserDashboard } from '@/lib/services/users/get-user-dashboard.service';
import { MOCK_DASHBOARD_CASES } from '@/lib/data/dashboard-mock-cases';
import type { DashboardCaseItem } from '@/lib/types/dashboard-case-item';
import type { UserDashboardCaseEntry } from '@/lib/types/user-dashboard';
import { Loader2, Plus, FolderOpen } from 'lucide-react';

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function formatAmountDisplay(valueUSD: string): string {
  const n = parseFloat(valueUSD);
  if (!Number.isFinite(n)) return valueUSD;
  if (n >= 0.01) return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
  if (n === 0) return '0';
  return valueUSD;
}

function getMonthYearKey(iso: string | undefined): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  } catch {
    return '—';
  }
}

function getMonthYearLabel(iso: string | undefined): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return '—';
  }
}

function mapCaseHistoryToItems(entries: UserDashboardCaseEntry[]): DashboardCaseItem[] {
  return entries.map((e) => ({
    id: e.id,
    name: e.name,
    createdAt: e.createdAt,
    amountDisplay: formatAmountDisplay(e.valueUSD),
    transactionCount: e.transactionCount,
  }));
}

export function DashboardTemplate() {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [meusCasosOpen, setMeusCasosOpen] = useState(false);
  const [cases, setCases] = useState<DashboardCaseItem[]>([]);
  const [stats, setStats] = useState({
    totalCases: 0,
    totalAmount: '0',
    casesThisMonth: 0,
    totalSeeds: 0,
  });
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  const loadDashboard = useCallback(() => {
    const userId = session?.user?.id;
    const token = session?.user?.accessToken;
    if (!userId || !token) {
      setCases(MOCK_DASHBOARD_CASES);
      setStats({
        totalCases: MOCK_DASHBOARD_CASES.length,
        totalAmount: '16.95',
        casesThisMonth: MOCK_DASHBOARD_CASES.length,
        totalSeeds: 7,
      });
      setUseMock(true);
      setLoading(false);
      return;
    }
    getUserDashboard(userId, token).then((result) => {
      setLoading(false);
      if (result.ok) {
        setCases(mapCaseHistoryToItems(result.data.caseHistory));
        setStats({
          totalCases: result.data.totalCases,
          totalAmount: String(result.data.totalTrackedValueUSD),
          casesThisMonth: result.data.casesThisMonth,
          totalSeeds: result.data.totalTrackedTransactions,
        });
        setUseMock(false);
      } else {
        setCases(MOCK_DASHBOARD_CASES);
        setStats({
          totalCases: MOCK_DASHBOARD_CASES.length,
          totalAmount: '16.95',
          casesThisMonth: MOCK_DASHBOARD_CASES.length,
          totalSeeds: 7,
        });
        setUseMock(true);
      }
    });
  }, [session?.user?.id, session?.user?.accessToken]);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    setLoading(true);
    loadDashboard();
  }, [status, loadDashboard]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
        <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }
  if (status === 'unauthenticated') return null;

  const displayName = session?.user?.name ?? session?.user?.email ?? 'usuário';
  const firstName = displayName.split(' ')[0] || displayName;
  const groupedByMonth = (() => {
    if (!cases.length) return new Map<string, DashboardCaseItem[]>();
    const map = new Map<string, DashboardCaseItem[]>();
    for (const item of cases) {
      const key = getMonthYearKey(item.createdAt);
      const arr = map.get(key) ?? [];
      arr.push(item);
      map.set(key, arr);
    }
    const keys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
    const ordered = new Map<string, DashboardCaseItem[]>();
    for (const k of keys) ordered.set(k, map.get(k)!);
    return ordered;
  })();

  return (
    <div className="relative min-h-screen w-full overflow-auto bg-[#090b12]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,rgba(74,126,217,0.14),transparent_58%),radial-gradient(ellipse_70%_55%_at_80%_90%,rgba(99,102,241,0.12),transparent_62%)]" />
      <AppHeader meusCasosOpen={meusCasosOpen} onMeusCasosOpenChange={setMeusCasosOpen} hasCases={loading ? undefined : cases.length > 0} />
      <div className="h-14 shrink-0" aria-hidden />

      <main className="relative mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9">
        <section className="mb-7 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,19,26,0.8),rgba(10,11,16,0.88))] p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] sm:p-6">
          <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-primary/90">
                CENTRAL DE CASOS
              </span>
              <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Olá, {firstName}
              </h1>
              <p className="mt-1.5 text-sm text-white/65">
                Acompanhe seu histórico, inicie novos rastreios e gerencie as investigações em andamento.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="h-11 rounded-[8px] border border-primary/25 bg-primary px-6 text-white shadow-[0_0_28px_-10px_rgba(74,126,217,0.8)] hover:bg-primary/90"
                asChild
              >
                <Link href="/dashboard/rastreio/novo">
                  <Plus className="mr-2 h-5 w-5" aria-hidden />
                  Novo rastreio
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-[8px] border-white/15 bg-white/4 text-foreground hover:bg-white/10"
                onClick={() => setMeusCasosOpen(true)}
              >
                <FolderOpen className="mr-2 h-5 w-5" aria-hidden />
                Meus casos
              </Button>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" aria-hidden />
            <p className="mt-4 text-sm text-muted-foreground">Carregando dashboard...</p>
          </div>
        ) : (
          <>
            <section className="mb-10" aria-labelledby="stats-heading">
              <h2 id="stats-heading" className="sr-only">
                Resumo
              </h2>
              <DashboardStats
                totalCases={stats.totalCases}
                totalAmount={stats.totalAmount}
                casesThisMonth={stats.casesThisMonth}
                totalSeeds={stats.totalSeeds}
              />
            </section>

            <div className="grid grid-cols-1 items-start gap-7">
              <section aria-labelledby="cases-feed-heading">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 id="cases-feed-heading" className="text-lg font-semibold text-foreground">
                    Meus casos
                  </h2>
                  {useMock && (
                    <span className="rounded-full border border-amber-200/25 bg-amber-200/10 px-3 py-1 text-xs font-medium text-amber-200">
                      Dados de exemplo
                    </span>
                  )}
                </div>
                <div className="space-y-5">
                  {Array.from(groupedByMonth.entries()).map(([key, items]) => (
                    <section key={key} className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,19,26,0.65),rgba(10,11,16,0.8))]">
                      <div className="flex items-center justify-between px-4 py-3">
                        <h3 className="text-sm font-semibold text-foreground">
                          {getMonthYearLabel(items[0]?.createdAt)}
                        </h3>
                        <span className="text-xs text-white/50">{items.length} {items.length === 1 ? 'caso' : 'casos'}</span>
                      </div>
                      <div className="mx-4 border-b border-white/10" aria-hidden />
                      <ul className="space-y-3 p-3">
                        {items.map((item) => (
                          <li key={item.id}>
                            <DashboardCaseCard item={item} isMock={useMock} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
