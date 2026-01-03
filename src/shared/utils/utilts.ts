import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkJwtExpiration = (token: string, minutes: number) => {
  try {
    // Tách payload của JWT
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));

    if (!payload.exp) {
      console.warn("Token không có exp");
      return;
    }

    // exp trong JWT là Unix timestamp (giây)
    const exp = payload.exp * 1000; // chuyển sang ms
    const now = Date.now();

    const diffMinutes = (exp - now) / 1000 / 60;

    if (diffMinutes <= minutes) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Không thể decode token:", err);
  }
};

export const getCountdown = (timestamp: number) => {
  const now = Date.now();
  let diff = Math.floor((timestamp - now) / 1000); // số giây còn lại

  if (diff <= 0) return "00:00:00";

  const hours = Math.floor(diff / 3600);
  diff %= 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  // Định dạng thành chuỗi HH:MM:SS
  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
};

export const formatSymbol = (symbol: string, isOnlySymbol?: boolean) => {
  if (!symbol) return "";
  const isPerp = symbol.includes("PERP");
  try {
    const formatted = symbol.replace("PERP", "").slice(1).replace("_", "-");
    if (isOnlySymbol) {
      return formatted.split("-")[0].toUpperCase();
    }
    if (isPerp) {
      return formatted;
    }
    return symbol;
  } catch (e) {
    return symbol;
  }
};
export const formatTimeframe = (timeframe: string) => {
  if (!isNaN(Number(timeframe))) {
    return Number(timeframe) >= 60
      ? `${Number(timeframe) / 60}h`
      : `${timeframe}m`;
  }
  switch (timeframe) {
    case "1D":
      return "1d";
    case "1W":
      return "1w";
  }
  return timeframe;
};
