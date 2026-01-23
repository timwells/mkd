export interface T212CashSummary {
  availableToTrade: number
  reservedForOrders: number
  inPies: number
}
export interface T212InvestmentSummary {
  currentValue: number
  totalCost: number
  realizedProfitLoss: number
  unrealizedProfitLoss: number
}

export interface T212AccountSummary {
  totalValue: number // ← add this
  cash: T212CashSummary
  investments: T212InvestmentSummary
}
