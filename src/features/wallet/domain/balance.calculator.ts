// features/wallet/domain/balance.calculator.ts

export function calculateBalance(
  current: number,
  income: number,
  expense: number
) {
  return current + income - expense;
}
