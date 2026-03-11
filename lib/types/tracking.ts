export interface FlowGraphNode {
  id: string;
  label: string;
  title?: string;
  chainIconUrl?: string;
  endpointExchangeIconUrl?: string;
  position?: { x: number; y: number } | 'default';
}

export interface FlowGraphEdge {
  from: string;
  to: string;
  symbol: string;
  amount: number;
  amountRaw: string;
  txHash: string;
  outcome?: 'SUCCESS' | 'NO_OUTBOUND' | 'MAX_WALLETS_REACHED' | 'EXHAUSTED_OPTIONS';
}

export interface FlowGraph {
  nodes: FlowGraphNode[];
  edges: FlowGraphEdge[];
}

export interface WalletTransfer {
  type: 'native' | 'erc20';
  symbol: string;
  from: string;
  to: string;
  rawAmount: string;
  amount: number;
  timestamp: string;
  txHash: string;
  contract?: string;
  direction: 'IN' | 'OUT';
  counterparty: string;
}

export interface FlowStep {
  fromAddress: string;
  toAddress: string;
  transfer: WalletTransfer;
}

export interface FlowToExchangeSuccess {
  success: true;
  chain: string;
  steps: FlowStep[];
  endpointAddress: string;
  graph: FlowGraph;
}

export interface FlowToExchangeFailure {
  success: false;
  chain: string;
  reason: 'NO_OUTBOUND' | 'MAX_WALLETS_REACHED' | 'EXHAUSTED_OPTIONS';
  lastWallet: string;
  steps: FlowStep[];
  graph: FlowGraph;
  message?: string;
}

export interface ResolveTransfer {
  type: 'native' | 'erc20';
  symbol: string;
  from: string;
  to: string;
  rawAmount: string;
  amount: number;
  timestamp: string;
  contract?: string;
}

export interface TransactionsResolveResponse {
  chain: string;
  transaction: {
    fromAddress: string;
    toAddress: string;
    blockSignedAt: string;
  };
  transfers: ResolveTransfer[];
  seedTransfer: ResolveTransfer | null;
}
export interface FlowTraceProgressPayload {
  message: string;
  depth?: number;
  address?: string;
  stackLength?: number;
  stackRemaining?: number;
  count?: number;
  page?: number;
  totalTransfers?: number;
  nextAddress?: string;
  symbol?: string;
  amount?: number;
  reason?: string;
  lastWallet?: string;
}
