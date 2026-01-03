import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppKitProvider } from "@reown/appkit/react";
import {
  arbitrum,
  mainnet,
  bsc,
  type AppKitNetwork,
} from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import "./index.css";
import App from "./App.tsx";

// =========================SETUP APPKIT=========================
const projectId = "b591e68097b4823a88e3a8bcfd94854f";

const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "https://example.com",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

const definedNetworks = [mainnet] as const satisfies readonly [
  AppKitNetwork,
  ...AppKitNetwork[]
];

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [...definedNetworks];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
    socials: false,
    email: false,
  },
});
// =========================REACT QUERY=========================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppKitProvider projectId={projectId} networks={[mainnet, arbitrum, bsc]}>
      {" "}
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>{" "}
      </WagmiProvider>
    </AppKitProvider>
  </StrictMode>
);
