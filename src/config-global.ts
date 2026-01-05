export type ConfigValue = {
  appName: string;
  viteServerUrl: string;
  viteClientUrl: string;
  viteWsPublicUrl: string;
  viteWsPrivateUrl: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: "402 FE",
  viteServerUrl: import.meta.env.VITE_SERVER_URL ?? "",
  viteClientUrl: import.meta.env.VITE_CLIENT_URL ?? "",
  viteWsPublicUrl: import.meta.env.VITE_WS_PUBLIC_URL ?? "",
  viteWsPrivateUrl: import.meta.env.VITE_WS_PRIVATE_URL ?? "",
};
