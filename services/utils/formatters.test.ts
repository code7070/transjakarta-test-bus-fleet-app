import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatTimestamp,
  formatRelativeTime,
  formatStatus,
  formatCoordinate,
  formatDirection,
} from "./formatters";

describe("formatters", () => {
  describe("formatTimestamp", () => {
    it('returns "N/A" for empty string', () => {
      expect(formatTimestamp("")).toBe("N/A");
    });

    it("formats ISO string correctly for id-ID locale", () => {
      const iso = "2024-05-20T10:30:00Z";
      // We expect 20 Mei 2024, 17.30 (since default system timezone might vary, but we can check parts)
      const formatted = formatTimestamp(iso);
      expect(formatted).toContain("20");
      expect(formatted).toContain("2024");
    });
  });

  describe("formatRelativeTime", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns empty string for empty input", () => {
      expect(formatRelativeTime("")).toBe("");
    });

    it("returns seconds ago for recent time", () => {
      const now = new Date("2024-05-20T10:00:00Z");
      vi.setSystemTime(now);
      const past = new Date("2024-05-20T09:59:50Z").toISOString();
      expect(formatRelativeTime(past)).toBe("10 detik yang lalu");
    });

    it("returns minutes ago", () => {
      const now = new Date("2024-05-20T10:00:00Z");
      vi.setSystemTime(now);
      const past = new Date("2024-05-20T09:50:00Z").toISOString();
      expect(formatRelativeTime(past)).toBe("10 menit yang lalu");
    });

    it("returns hours ago", () => {
      const now = new Date("2024-05-20T10:00:00Z");
      vi.setSystemTime(now);
      const past = new Date("2024-05-20T07:00:00Z").toISOString();
      expect(formatRelativeTime(past)).toBe("3 jam yang lalu");
    });

    it("returns days ago", () => {
      const now = new Date("2024-05-20T10:00:00Z");
      vi.setSystemTime(now);
      const past = new Date("2024-05-18T10:00:00Z").toISOString();
      expect(formatRelativeTime(past)).toBe("2 hari yang lalu");
    });
  });

  describe("formatStatus", () => {
    it('returns "Unknown" for empty input', () => {
      expect(formatStatus("")).toBe("Unknown");
    });

    it("maps known statuses correctly", () => {
      expect(formatStatus("STOPPED_AT")).toBe("Stopped at");
      expect(formatStatus("IN_TRANSIT_TO")).toBe("Moving toward");
      expect(formatStatus("INCOMING_AT")).toBe("Arriving at");
    });

    it("formats unknown statuses to sentence case", () => {
      expect(formatStatus("VERY_LONG_STATUS")).toBe("Very long status");
      expect(formatStatus("ACTIVE")).toBe("Active");
    });
  });

  describe("formatCoordinate", () => {
    it('returns "-" for null or undefined', () => {
      expect(formatCoordinate(null as any)).toBe("-");
      expect(formatCoordinate(undefined as any)).toBe("-");
    });

    it("formats coordinate to 6 decimal places", () => {
      expect(formatCoordinate(-6.12345678)).toBe("-6.123457");
      expect(formatCoordinate(106.123)).toBe("106.123000");
    });
  });

  describe("formatDirection", () => {
    it('returns "Outbound" for 0', () => {
      expect(formatDirection(0)).toBe("Outbound");
    });

    it('returns "Inbound" for 1', () => {
      expect(formatDirection(1)).toBe("Inbound");
    });

    it('returns "Unknown" for other values', () => {
      expect(formatDirection(2)).toBe("Unknown");
    });
  });
});
