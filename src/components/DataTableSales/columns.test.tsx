import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { columns } from "./columns";
import { DataTable } from "./DataTable";
import type { Sale } from "@/interfaces/sale";
import { vi, describe, it, expect } from "vitest";

// Mock para react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: () => Promise.resolve() },
  }),
}));

// Mock para useNavigate
const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useNavigate: () => navigateMock,
  };
});

// Mock de ventas
const mockSales: Sale[] = [
  {
    _id: "sale-123",
    clientName: "Juan Pérez",
    total: 150,
    date: new Date("2024-06-30T12:00:00Z"),
    products: [
      {
        _id: "item-1",
        saleId: "sale-123",
        productId: "prod-1",
        quantity: 2,
        unitPrice: 50,
      },
      {
        _id: "item-2",
        saleId: "sale-123",
        productId: "prod-2",
        quantity: 1,
        unitPrice: 50,
      },
    ],
  },
];

function renderTable() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DataTable columns={columns} data={mockSales} />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe("DataTableSales actions column", () => {
  it("should copy the product id", async () => {
    renderTable();
    const user = userEvent.setup();

    // Abre el menú de acciones
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);

    // Mock clipboard
    const writeTextMock = vi.fn();
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
        read: vi.fn(),
        readText: vi.fn(),
      },
      writable: true,
    });

    // Click en "Copy product ID"
    const copyItem = screen.getByText("Copy product ID");
    await user.click(copyItem);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("sale-123");
  });

  it("should navigate to the sale details page", async () => {
    // Arrange
    renderTable();
    const user = userEvent.setup();

    // Open action menu
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);

    // Click on "view sale details"
    const viewSaleItem = screen.getByText("View sale details");
    await user.click(viewSaleItem);

    // Expect
    expect(navigateMock).toHaveBeenCalledWith({
      to: "/sales/$id",
      params: { id: "sale-123" },
    });
  });
});
