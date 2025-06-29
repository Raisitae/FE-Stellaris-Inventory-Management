import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSaleQuery, useSalesQuery } from "./useSalesQuery";

vi.mock("@/lib/config", () => ({
  API_BASE_URL: "http://localhost/api",
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useSalesQuery", () => {
  const mockSales = [
    { id: "1", total: 100 },
    { id: "2", total: 200 },
  ];

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches sales data successfully", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSales,
    });

    const { result } = renderHook(() => useSalesQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockSales);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch error", async () => {
    // Mock para 2 intentos: falla ambos
    (global.fetch as Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

    const { result } = renderHook(() => useSalesQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.error).toBeInstanceOf(Error);
      },
      { timeout: 3000 }
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});

describe("useSaleQuery", () => {
  const mockSale = { id: "1", total: 100 };

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches single sale successfully", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSale,
    });

    const { result } = renderHook(() => useSaleQuery("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockSale);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch error for single sale", async () => {
    // Mock para 2 intentos fallidos (retry 1)
    (global.fetch as Mock)
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(new Response(null, { status: 404 }));

    const { result } = renderHook(() => useSaleQuery("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.error).toBeInstanceOf(Error);
      },
      { timeout: 3000 }
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
