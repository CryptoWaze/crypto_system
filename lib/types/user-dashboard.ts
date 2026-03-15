export type UserDashboardCaseEntry = {
  id: string;
  name: string;
  createdAt: string;
  valueUSD: string;
  transactionCount: number;
};

export type UserDashboardResponse = {
  totalCases: number;
  totalTrackedValueUSD: number;
  casesThisMonth: number;
  totalTrackedTransactions: number;
  caseHistory: UserDashboardCaseEntry[];
};
