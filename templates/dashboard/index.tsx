'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AppHeader } from '@/components/common/appHeader';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { DashboardCaseCard } from '@/components/dashboard/dashboard-case-card';
import { DashboardResources } from '@/components/dashboard/dashboard-resources';
import { Button } from '@/components/ui/button';
import { getUserDashboard } from '@/lib/services/users/get-user-dashboard.service';
import { MOCK_DASHBOARD_CASES } from '@/lib/data/dashboard-mock-cases';
import type { DashboardCaseItem } from '@/lib/types/dashboard-case-item';
import type { UserDashboardCaseEntry } from '@/lib/types/user-dashboard';
import { Loader2, Plus, FolderOpen } from 'lucide-react';

function formatAmountDisplay(valueUSD: string): string {
  const n = parseFloat(valueUSD);
  if (!Number.isFinite(n)) return valueUSD;
  if (n >= 0.01) return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
  if (n === 0) return '0';
  return valueUSD;
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

  return (
    <div className="min-h-screen w-full overflow-auto bg-background">
      <AppHeader meusCasosOpen={meusCasosOpen} onMeusCasosOpenChange={setMeusCasosOpen} />
      <div className="h-14 shrink-0" aria-hidden />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Olá, {displayName.split(' ')[0] || displayName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aqui está o resumo da sua atividade e seus casos.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              size="lg"
              className="h-11 rounded-[6px] bg-primary px-6 text-primary-foreground hover:bg-primary/90"
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
              className="h-11 rounded-[6px]"
              onClick={() => setMeusCasosOpen(true)}
            >
              <FolderOpen className="mr-2 h-5 w-5" aria-hidden />
              Meus casos
            </Button>
          </div>
        </div>

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

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              <section className="lg:col-span-2" aria-labelledby="cases-feed-heading">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h2 id="cases-feed-heading" className="text-lg font-semibold text-foreground">
                    Meus casos
                  </h2>
                  {useMock && (
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      Dados de exemplo
                    </span>
                  )}
                </div>
                <ul className="space-y-4">
                  {cases.map((item) => (
                    <li key={item.id}>
                      <DashboardCaseCard item={item} isMock={useMock} />
                    </li>
                  ))}
                </ul>
              </section>

              <aside className="lg:col-span-1">
                <DashboardResources />
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
