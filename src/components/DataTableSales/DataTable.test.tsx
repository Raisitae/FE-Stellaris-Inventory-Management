import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "./DataTable";
import { BrowserRouter } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import type { Sale } from "@/interfaces/sale";

const DATA_TEST_ID = "datatable-sale-component";

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
export function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

// Mock básico de columnas
const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "clientName",
    header: "Cliente",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "_id",
    header: "ID",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "date",
    header: "Fecha",
    cell: (info) =>
      info.getValue() instanceof Date
        ? (info.getValue() as Date).toLocaleDateString()
        : info.getValue(),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: (info) => `$${info.getValue()}`,
  },
  {
    accessorKey: "products",
    header: "Productos",
    cell: (info) => {
      const value = info.getValue();
      return Array.isArray(value) ? value.length : 0;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: () => (
      <button aria-label="open menu" onClick={() => {}}>
        View sale details
      </button>
    ),
  },
];

// Mock de datos
const data: Sale[] = [
  {
    clientName: "Client name",
    _id: "12345id",
    products: [
      {
        _id: "prod1",
        saleId: "1",
        productId: "3",
        quantity: 4,
        unitPrice: 100,
      },
    ],
    date: new Date("2024-01-01"),
    total: 1,
    price: 100,
  },
];

const renderTable = (customData = data) =>
  render(
    <BrowserRouter>
      <DataTable columns={columns} data={customData} />
    </BrowserRouter>
  );

describe("DataTable", () => {
  it("should render title and description", () => {
    // Arrange
    renderTable();
    const title = screen.getByTestId(`${DATA_TEST_ID}.title`);
    const description = screen.getByTestId(`${DATA_TEST_ID}.description`);

    //expect
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it("should render a row with data", () => {
    renderTable();
    expect(screen.getByText("Client name")).toBeInTheDocument();
  });

  it("should display no results if there are no sales", () => {
    // Arrange
    renderTable([]);
    const noResults = screen.getByTestId(`${DATA_TEST_ID}.noResults`);

    // Expect
    expect(noResults).toBeInTheDocument();
  });

  it("should disable the export button if there are no sales selected", () => {
    // Arrange
    renderTable();
    const exportButton = screen.getByTestId(`${DATA_TEST_ID}.export.button`);

    //expect
    expect(exportButton).toBeDisabled();
  });

  it("should open the actions menu when clicking the actions button", async () => {
    // Arrange
    renderTable();
    const user = userEvent.setup();
    const menuButton = screen.getByRole("button", { name: /open menu/i });

    // Act
    await user.click(menuButton);

    // Expect
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveFocus();
  });
});
