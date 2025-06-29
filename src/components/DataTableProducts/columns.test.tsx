import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { columns } from "./columns";
import { vi, describe, it, expect } from "vitest";
import type { Product } from "@/interfaces/product";
import { SelectedProductsProvider } from "@/context/SelectedProductsContext";

// Mocks
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: () => Promise.resolve() },
  }),
}));

const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useNavigate: () => navigateMock,
  };
});

const mockProducts: Product[] = [
  {
    _id: "prod-123",
    name: "Producto Test",
    price: 200,
    stock: 5,
    description: "desc",
    category: "cat",
    platformId: "plat",
    status: "available",
    internCode: "INT1",
    imageUrl: "",
  },
];

function renderTable() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SelectedProductsProvider>
          <DataTable columns={columns} data={mockProducts} />
        </SelectedProductsProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

import { DataTable } from "./DataTable";

describe("DataTableProducts actions column", () => {
  it("should copy the product id", async () => {
    // Arrange
    renderTable();
    const user = userEvent.setup();
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);

    const writeTextMock = vi.fn();
    const copyItem = screen.getByText("Copy product ID");

    //Act
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
        read: vi.fn(),
        readText: vi.fn(),
      },
      writable: true,
    });
    await user.click(copyItem);

    // Expect
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("prod-123");
  });

  it("should navigate to the product details page", async () => {
    // Arrange
    renderTable();
    const user = userEvent.setup();

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);

    const viewDetailsItem = screen.getByText("View product details");
    await user.click(viewDetailsItem);

    // Expect
    expect(navigateMock).toHaveBeenCalledWith({
      to: "/products/$id",
      params: { id: "prod-123" },
    });
  });
});
