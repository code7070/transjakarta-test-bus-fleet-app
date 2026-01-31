export const formatTimestamp = (isoString: string): string => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRelativeTime = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
};

export const formatStatus = (status: string): string => {
  if (!status) return "Unknown";

  const statusMap: Record<string, string> = {
    STOPPED_AT: "Stopped at",
    IN_TRANSIT_TO: "Moving toward",
    INCOMING_AT: "Arriving at",
  };

  if (statusMap[status]) return statusMap[status];

  // Fallback: Sentence case (e.g., "Very long status" instead of "Very Long Status")
  const cleaned = status.replace(/_/g, " ").toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

export const formatCoordinate = (val: number): string => {
  if (val === undefined || val === null) return "-";
  return val.toFixed(6);
};

export const formatDirection = (directionId: number): string => {
  if (directionId === 0) return "Outbound";
  if (directionId === 1) return "Inbound";
  return "Unknown";
};
