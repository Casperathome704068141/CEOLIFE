export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number, fractionDigits = 0) {
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatDateTime(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatRelative(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  const diff = date.getTime() - Date.now();
  const minutes = Math.round(diff / (60 * 1000));
  if (minutes === 0) return "now";
  if (Math.abs(minutes) < 60) {
    return minutes > 0 ? `in ${minutes}m` : `${Math.abs(minutes)}m ago`;
  }
  const hours = Math.round(minutes / 60);
  return hours > 0 ? `in ${hours}h` : `${Math.abs(hours)}h ago`;
}

