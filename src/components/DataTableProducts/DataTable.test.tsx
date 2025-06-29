import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "./DataTable";
import { BrowserRouter } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/interfaces/product";
import { vi, describe, it, expect } from "vitest";

// Mock para react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock para useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useNavigate: () => mockNavigate,
  };
});

const mockAddProduct = vi.fn();
vi.mock("@/context/SelectedProductsContext", () => ({
  useSelectedProducts: () => ({
    addProduct: mockAddProduct,
  }),
}));

// Columnas mínimas para el test
const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: (info) => info.getValue(),
  },
];

// Mock de productos
const data: Product[] = [
  {
    _id: "prod1",
    name: "Producto 1",
    price: 100,
    stock: 10,
    description: "desc",
    category: "cat",
    platformId: "plat",
    status: "available",
    internCode: "INT1",
    imageUrl: "",
  },
];

function renderTable(customData = data) {
  return render(
    <BrowserRouter>
      <DataTable columns={columns} data={customData} />
    </BrowserRouter>
  );
}

describe("DataTableProducts", () => {
  it("should render title and description", () => {
    // Arrange
    renderTable();
    // Expect
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("description")).toBeInTheDocument();
  });

  it("should render a row with product data", () => {
    // Arrange
    renderTable();
    // Expect
    expect(screen.getByText("Producto 1")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should navigate to add product page when clicking add button", async () => {
    // Arrange
    renderTable();
    const user = userEvent.setup();
    const addButton = screen.getByRole("button", { name: /addProduct/i });
    // Act
    await user.click(addButton);
    // Expect
    expect(mockNavigate).toHaveBeenCalledWith("/products/add");
  });

  it("should disable create sale button if no products are selected", () => {
    // Arrange
    renderTable();
    // Expect
    const createSaleButton = screen.getByRole("button", {
      name: /createSale/i,
    });
    expect(createSaleButton).toBeDisabled();
  });
});
