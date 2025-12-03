
// In a real app, this would fetch from multiple Firestore collections
// and aggregate the data. For now, we return mock data.

export type Asset = {
  symbol: string;
  name: string;
  type: 'crypto' | 'stock' | 'cash';
  balance: number;
  price: number;
  delta24h?: number;
  allocation: number;
};

export type Transaction = {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  status: 'posted' | 'pending';
};

export type CashflowData = {
  transactions: Transaction[];
  monthlyBurn: number;
  burnTarget: number;
};

const mockData = {
  assets: [
    { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', balance: 1.24, price: 64200, delta24h: 2.4, allocation: 45 },
    { symbol: 'ETH', name: 'Ethereum', type: 'crypto', balance: 14.5, price: 3400, delta24h: -1.2, allocation: 25 },
    { symbol: 'TSLA', name: 'Tesla Inc', type: 'stock', balance: 50, price: 180, delta24h: 5.1, allocation: 10 },
    { symbol: 'USD', name: 'Cash', type: 'cash', balance: 14000, price: 1, delta24h: 0, allocation: 20 },
  ],
  transactions: [
    { id: '1', merchant: 'Stripe Payout', amount: 1250, date: 'Oct 24', category: 'Income', status: 'posted' },
    { id: '2', merchant: 'AWS Web Services', amount: -64, date: 'Oct 24', category: 'Infra', status: 'posted' },
    { id: '3', merchant: 'Vercel', amount: -20, date: 'Oct 23', category: 'Infra', status: 'posted' },
    { id: '4', merchant: 'Linear', amount: -12, date: 'Oct 23', category: 'Software', status: 'posted' },
    { id: '5', merchant: 'Figma', amount: -45, date: 'Oct 22', category: 'Software', status: 'pending' },
    { id: '6', merchant: 'Consulting Gig', amount: 2500, date: 'Oct 21', category: 'Income', status: 'posted' },
  ],
  monthlyBurn: 4250,
  burnTarget: 6000,
};

export async function getPortfolioData(): Promise<Asset[]> {
  return Promise.resolve(mockData.assets);
}

export async function getCashflowData(): Promise<CashflowData> {
  return Promise.resolve({
    transactions: mockData.transactions,
    monthlyBurn: mockData.monthlyBurn,
    burnTarget: mockData.burnTarget,
  });
}


export async function getFinancialSnapshot(): Promise<{
  assets: Asset[];
  transactions: Transaction[];
  monthlyBurn: number;
  burnTarget: number;
}> {
  return Promise.resolve(mockData);
}
