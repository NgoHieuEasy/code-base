// features/wallet/hooks/useWallet.ts

import { calculateBalance } from "../../domain/balance.calculator";
import { ensureBalanceNotNegative } from "../../domain/balance.rules";

export function useWallet() {
  function getBalance(current: number, income: number, expense: number) {
    const balance = calculateBalance(current, income, expense);
    return ensureBalanceNotNegative(balance);
  }

  return { getBalance };
}
