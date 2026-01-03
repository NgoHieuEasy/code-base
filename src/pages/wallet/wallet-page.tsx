import { WalletView } from "@/features/wallet";

const metadata = { title: `Perpetual  - Demo` };

export default function Page() {
  return (
    <>
      <div>
        <title>{metadata.title}</title>
      </div>
      <WalletView />;
    </>
  );
}
