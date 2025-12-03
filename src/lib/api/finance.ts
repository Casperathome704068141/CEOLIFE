import { Asset } from "@/components/capital/capital-terminal";

export async function getPortfolioData(): Promise<Asset[]> {
  return [
    { symbol: "BTC", name: "Bitcoin", type: "crypto", balance: 1.24, price: 64200, delta24h: 2.4, allocation: 45 },
    { symbol: "ETH", name: "Ethereum", type: "crypto", balance: 14.5, price: 3400, delta24h: -1.2, allocation: 25 },
    { symbol: "NVDA", name: "NVIDIA", type: "stock", balance: 50, price: 920, delta24h: 5.1, allocation: 20 },
    { symbol: "USD", name: "Liquidity", type: "cash", balance: 14000, price: 1, delta24h: 0, allocation: 10 },
  ];
}

export async function getCashflowData(): Promise<{
  burnRate: number;
  runwayDays: number;
  bills: Array<{ id: string; label: string; amount: number }>;
}> {
  return {
    burnRate: 4250,
    runwayDays: 128,
    bills: [
      { id: "bill-aws", label: "AWS Services", amount: -64 },
      { id: "bill-rent", label: "Launchpad Lease", amount: -1800 },
      { id: "bill-card", label: "Amex Auto-pay", amount: -940 },
    ],
  };
}
