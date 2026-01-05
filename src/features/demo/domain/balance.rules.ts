// features/wallet/domain/balance.rules.ts

export function ensureBalanceNotNegative(balance: number) {
  if (balance < 0) {
    throw new Error("Balance cannot be negative");
  }

  return balance;
}
