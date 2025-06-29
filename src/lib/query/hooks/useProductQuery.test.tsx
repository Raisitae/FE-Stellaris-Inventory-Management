import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useProductQuery,
  useProductsQuery,
  useProductsByIds,
  useSaleWithProducts,
} from "./useProductQuery"; // ajusta la ruta si es necesario

vi.mock("@/lib/config", () => ({
  API_BASE_URL: "http://localhost/api",
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // desactivamos retries en tests para control manual
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useProductQuery", () => {
  const mockProduct = { id: "1", name: "Product 1" };

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches product data successfully for a single product", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProduct,
    });

    const { result } = renderHook(() => useProductQuery("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockProduct);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch error", async () => {
    (global.fetch as Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      });

    const { result } = renderHook(() => useProductQuery("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error), {
      timeout: 3000,
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});

describe("useProductsQuery", () => {
  const mockProducts = [
    { id: "1", name: "Product 1" },
    { id: "2", name: "Product 2" },
  ];

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches all products successfully", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    const { result } = renderHook(() => useProductsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch error", async () => {
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

    const { result } = renderHook(() => useProductsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error), {
      timeout: 3000,
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});

describe("useProductsByIds", () => {
  const mockProducts = [
    { id: "1", name: "Product 1" },
    { id: "2", name: "Product 2" },
  ];

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches multiple products by ids successfully", async () => {
    // Mock fetch para cada id
    (global.fetch as Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts[0],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts[1],
      });

    const { result } = renderHook(() => useProductsByIds(["1", "2"], true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockProducts);
    expect(result.current.error).toBeUndefined();
  });

  it("handles fetch error when fetching multiple products", async () => {
    (global.fetch as Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      });

    const { result } = renderHook(() => useProductsByIds(["1", "2"], true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true), {
      timeout: 3000,
    });
    expect(result.current.data).toEqual([undefined, undefined]);
    expect(result.current.error).toBeDefined();
  });
});

describe("useSaleWithProducts", () => {
  const mockSale = {
    id: "sale1",
    products: [
      { productId: "1", quantity: 1 },
      { productId: "2", quantity: 2 },
    ],
  };

  const mockProducts = [
    { id: "1", name: "Product 1" },
    { id: "2", name: "Product 2" },
  ];

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches sale and its products successfully", async () => {
    // Mock para fetch sale
    (global.fetch as Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSale,
      })
      // Mock para cada product
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts[0],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts[1],
      });

    const { result } = renderHook(() => useSaleWithProducts("sale1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.sale).toEqual(mockSale);
    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeUndefined();
  });

  it("handles error in sale fetch", async () => {
    (global.fetch as Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      });

    const { result } = renderHook(() => useSaleWithProducts("sale1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.error).toBeDefined(), {
      timeout: 3000,
    });
    expect(result.current.sale).toBeUndefined();

    // Products should be undefined since sale fetch failed
    expect(result.current.sale).toEqual(undefined);
    expect(result.current.isLoading).toBe(false);
  });

  it("handles error in products fetch", async () => {
    // Sale fetch ok
    (global.fetch as Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSale,
      })
      // Products fetch fallan
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      });

    const { result } = renderHook(() => useSaleWithProducts("sale1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.error).toBeDefined(), {
      timeout: 3000,
    });
    expect(result.current.sale).toEqual(mockSale);
    expect(result.current.products).toEqual([undefined, undefined]);
    expect(result.current.isLoading).toBe(false);
  });
});
