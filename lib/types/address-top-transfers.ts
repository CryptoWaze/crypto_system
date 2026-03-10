export type WalletTransfer = {
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
};

export type GetAddressTopTransfersResult = {
  [chain: string]: { transfers: WalletTransfer[] };
};
