import { useCallback, useEffect, useRef } from "react";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useDisconnect,
} from "@reown/appkit/react";
import type { Views } from "@reown/appkit/react";
import { useConnect, useSignMessage } from "wagmi";
import ArbLogo from "@/assets/images/header/arb-logo.svg";
import EthLogo from "@/assets/images/header/eth-logo.svg";
import BscLogo from "@/assets/images/header/bsc-logo.svg";
import type { ChainNamespace } from "@reown/appkit/networks";
import apiClient from "@/axios/api-client";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants";

const COIN_LOGO = {
  BscScan: BscLogo,
  Etherscan: EthLogo,
  Arbiscan: ArbLogo,
} as const;
type ExplorerName = keyof typeof COIN_LOGO;
export function useWalletManager() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const { caipNetwork } = useAppKitNetwork();
  const { open: openAppKit, close: closeAppKit } = useAppKit();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { connect } = useConnect();
  const { address, isConnected } = useAppKitAccount();

  // 🔒 Chỉ sign 1 lần cho mỗi lần connect
  const hasSignedRef = useRef(false);
  const signingRef = useRef(false);

  // ===========================
  // 🪪 Sign + Verify
  // ===========================
  const signIn = useCallback(async () => {
    if (!isConnected || !address) return;
    if (hasSignedRef.current || signingRef.current) return;

    signingRef.current = true;

    try {
      const { data } = await apiClient.post("auth/nonce", { address });

      const signature = await signMessageAsync({
        message: data.nonce,
      });

      const { data: user } = await apiClient.post("auth/verify", {
        address,
        signature,
        message: data.nonce,
        chainId: caipNetwork?.id,
      });
      localStorage.setItem(ACCESS_TOKEN, user.accessToken);
      localStorage.setItem(REFRESH_TOKEN, user.refreshToken);
      hasSignedRef.current = true;
    } catch (error) {
      console.error("❌ Sign failed:", error);
      hasSignedRef.current = false;
      disconnect();
    } finally {
      signingRef.current = false;
    }
  }, [isConnected, address, signMessageAsync, caipNetwork?.id, disconnect]);

  // ===========================
  // 🔁 Auto sign khi connect
  // ===========================
  useEffect(() => {
    if (isConnected && address && !accessToken) {
      signIn();
    }
  }, [isConnected, address, signIn]);

  // ===========================
  // 🔄 Reset khi disconnect / đổi ví
  // ===========================
  useEffect(() => {
    if (!isConnected) {
      hasSignedRef.current = false;
      signingRef.current = false;
    }
  }, [isConnected]);

  // ===========================
  // 🔌 Open wallet modal
  // ===========================
  const openConnectModal = ({
    view,
    namespace,
  }: {
    view: Views;
    namespace?: ChainNamespace;
  }) => {
    try {
      openAppKit({ view, namespace });
    } catch (e) {
      console.log(e);
    }
  };

  // ===========================
  // 🔄 Auto close modal khi đổi network
  // ===========================
  useEffect(() => {
    if (caipNetwork) closeAppKit();
  }, [caipNetwork, closeAppKit]);

  // ===========================
  // 🪙 Explorer & logo
  // ===========================
  const explorerName = caipNetwork?.blockExplorers?.default?.name;
  const safeKey = explorerName as ExplorerName | undefined;
  const coinLogo = safeKey ? COIN_LOGO[safeKey] : null;

  return {
    address,
    isConnected,
    connect,
    disconnect,
    signIn,
    openConnectModal,
    caipNetwork,
    explorerName,
    coinLogo,
  };
}
