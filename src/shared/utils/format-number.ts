export function fNumber(
  value: string | number,
  minimumFractionDigits: number = 2
): string {
  if (value === null || value === undefined || value === "") return "0";

  const num = Number(value);

  if (isNaN(num)) return "0";

  const [integerPart, decimalPart = ""] = String(value).split(".");

  // Cắt phần thập phân (KHÔNG làm tròn)
  const truncatedDecimal =
    minimumFractionDigits > 0
      ? decimalPart
          .padEnd(minimumFractionDigits, "0")
          .slice(0, minimumFractionDigits)
      : "";

  // Format phần nguyên với dấu phẩy
  const formattedInteger = Number(integerPart).toLocaleString("en-US");

  return truncatedDecimal
    ? `${formattedInteger}.${truncatedDecimal}`
    : formattedInteger;
}
export const getPrecision = (tickerSize: string): number => {
  if (!tickerSize.includes(".")) return 0;
  return tickerSize.split(".")[1].replace(/0+$/, "").length;
};
export const cutByStepSize = (value: number, stepSize: string): number => {
  const decimalIndex = stepSize.indexOf(".");
  const firstNonZero = stepSize.indexOf("1", decimalIndex);
  const precision = firstNonZero > -1 ? firstNonZero - decimalIndex : 0;

  const factor = 10 ** precision;
  return Math.floor(value * factor) / factor;
};


export const formatVolume = (volume: number) => {
  if (volume >= 1e9) return (volume / 1e9).toFixed(2) + "B";
  if (volume >= 1e6) return (volume / 1e6).toFixed(2) + "M";
  if (volume >= 1e3) return (volume / 1e3).toFixed(2) + "K";
  return volume.toFixed(2);
};