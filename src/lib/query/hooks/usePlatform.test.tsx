import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePlatformQuery, usePlatformsQuery } from "./usePlatformQuery";

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

describe("usePlatformQuery", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches platform data successfully", async () => {
    const mockPlatform = { id: "1", name: "Platform A" };
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlatform,
    });

    const { result } = renderHook(() => usePlatformQuery("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockPlatform);
      expect(result.current.error).toBeNull();
    });
  });

  it("handles fetch error", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const { result } = renderHook(() => usePlatformQuery("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.data).toBeUndefined();
    });
  });
});

describe("usePlatformsQuery", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches platforms data successfully", async () => {
    const mockPlatforms = [
      { id: "1", name: "Platform A" },
      { id: "2", name: "Platform B" },
    ];
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlatforms,
    });

    const { result } = renderHook(() => usePlatformsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockPlatforms);
      expect(result.current.error).toBeNull();
    });
  });

  it("handles fetch error", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const { result } = renderHook(() => usePlatformsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.data).toBeUndefined();
    });
  });
});
