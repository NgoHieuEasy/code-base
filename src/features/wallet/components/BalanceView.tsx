import { useWallet } from "../hooks/local/useWallet";

export function Balance() {
  const { getBalance } = useWallet();

  const balance = getBalance(1000, 200, 150);

  return <div>Balance: {balance}</div>;
}
