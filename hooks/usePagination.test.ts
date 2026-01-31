import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { usePagination } from "./usePagination";

describe("usePagination", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100 }));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.itemsPerPage).toBe(10);
    expect(result.current.totalPages).toBe(10);
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(10);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);
  });

  it("should handle navigation", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 25, initialItemsPerPage: 10 }),
    );

    expect(result.current.totalPages).toBe(3);

    act(() => {
      result.current.nextPage();
    });
    expect(result.current.currentPage).toBe(2);
    expect(result.current.startIndex).toBe(10);
    expect(result.current.endIndex).toBe(20);

    act(() => {
      result.current.nextPage();
    });
    expect(result.current.currentPage).toBe(3);
    expect(result.current.startIndex).toBe(20);
    expect(result.current.endIndex).toBe(25);

    act(() => {
      result.current.previousPage();
    });
    expect(result.current.currentPage).toBe(2);
  });

  it("should not go out of bounds", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 10, initialItemsPerPage: 10 }),
    );

    act(() => {
      result.current.nextPage();
    });
    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.previousPage();
    });
    expect(result.current.currentPage).toBe(1);
  });

  it("should jump to specific page", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 50, initialItemsPerPage: 10 }),
    );

    act(() => {
      result.current.goToPage(4);
    });
    expect(result.current.currentPage).toBe(4);

    act(() => {
      result.current.goToPage(10); // Out of bounds
    });
    expect(result.current.currentPage).toBe(5);
  });

  it("should change items per page and reset to page 1", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 100, initialPage: 5 }),
    );

    expect(result.current.currentPage).toBe(5);

    act(() => {
      result.current.setItemsPerPage(20);
    });
    expect(result.current.itemsPerPage).toBe(20);
    expect(result.current.currentPage).toBe(1);
  });

  it("should adjust current page when totalItems decreases", async () => {
    const { result, rerender } = renderHook(
      ({ totalItems }) =>
        usePagination({ totalItems, initialPage: 10, initialItemsPerPage: 10 }),
      { initialProps: { totalItems: 100 } },
    );

    expect(result.current.currentPage).toBe(10);

    // Reduce items so that totalPages < current page
    rerender({ totalItems: 50 });

    expect(result.current.totalPages).toBe(5);
    expect(result.current.currentPage).toBe(5);
  });
});
