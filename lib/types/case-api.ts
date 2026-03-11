export type CaseByIdApiEdge = {
  id: string;
  fromAddress: string;
  toAddress: string;
  transferSymbol: string;
  transferAmountDecimal: string;
  transferAmountRaw: string;
  txHash: string;
  outcome: 'SUCCESS' | 'NO_OUTBOUND' | 'MAX_WALLETS_REACHED' | 'EXHAUSTED_OPTIONS';
  stepIndex: number;
  tokenAddress: string | null;
};

export type CaseByIdApiTransaction = {
  id?: string;
  timestamp?: string;
  txHash?: string;
  fromAddress?: string;
  toAddress?: string;
  amountDecimal?: string;
  amountRaw?: string;
  tokenSymbol?: string;
  tokenAddress?: string | null;
  hopIndex?: number;
  isEndpointHop?: boolean;
  [key: string]: unknown;
};

export type CaseByIdApiFlowWallet = {
  id: string;
  nodeIndex?: number;
  address?: string;
  nickname?: string | null;
  displayLabel?: string | null;
  position?: 'default' | { x: number; y: number };
};

export type CaseByIdApiFlow = {
  id: string;
  chainSlug: string;
  chainIconUrl?: string;
  chainName?: string;
  seedId: string;
  initialWalletAddress: string;
  endpointAddress: string;
  endpointExchangeName?: string;
  endpointExchangeSlug?: string;
  endpointExchangeIconUrl?: string;
  endpointHotWalletLabel?: string;
  endpointIsHotWallet?: boolean;
  endpointReason?: string;
  tokenSymbol?: string;
  tokenAddress?: string | null;
  totalAmountDecimal?: string;
  totalAmountRaw?: string;
  hopsCount?: number;
  edges: CaseByIdApiEdge[];
  transactions?: CaseByIdApiTransaction[];
  wallets?: CaseByIdApiFlowWallet[];
};

export type CaseByIdApiSeed = {
  id: string;
  txHash: string;
  initialWalletAddress?: string;
  initialWalletAddresses?: string[];
  amountDecimal?: string;
  amountRaw?: string;
  chainSlug?: string;
  chainIconUrl?: string;
  chainName?: string;
  tokenSymbol?: string;
  tokenAddress?: string | null;
  timestamp?: string;
};

export type CaseByIdApiResponse = {
  id: string;
  name?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  totalAmountLostDecimal?: string;
  totalAmountLostRaw?: string;
  seeds: CaseByIdApiSeed[];
  flows: CaseByIdApiFlow[];
};

export type CaseHistoryItemSeed = {
  id: string;
  txHash: string;
};

export type CaseHistoryItem = {
  id: string;
  name: string;
  totalAmountLostRaw: string;
  totalAmountLostDecimal: string;
  createdAt?: string;
  seeds?: CaseHistoryItemSeed[];
};
