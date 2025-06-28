import "@testing-library/jest-dom";
import { vi } from "vitest";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

// Mock para react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => Promise.resolve(),
    },
  }),
}));

// Helper para envolver con QueryClientProvider en tests
export function renderWithQueryClient(ui: React.ReactElement, options = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, ui),
    options
  );
}
