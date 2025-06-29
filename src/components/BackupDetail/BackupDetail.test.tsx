import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BackupDetail from "./BackupDetail";
import { vi, describe, it, expect } from "vitest";
import { after } from "node:test";
import { useProductsQuery } from "@/lib/query/hooks/useProductQuery";
import { useSalesQuery } from "@/lib/query/hooks/useSalesQuery";

const DATA_TEST_ID = "backup-detail-component";

// Mock queries
vi.mock("@/lib/query/hooks/useProductQuery", () => ({
  useProductsQuery: vi.fn(),
}));
vi.mock("@/lib/query/hooks/useSalesQuery", () => ({
  useSalesQuery: vi.fn(),
}));

const mockProducts = (data: unknown[] = [], loading = false, error = false) => {
  (useProductsQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    data,
    isLoading: loading,
    error,
  });
};
const mockSales = (data: unknown[] = [], loading = false, error = false) => {
  (useSalesQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    data,
    isLoading: loading,
    error,
  });
};

const renderBackupDetail = () => {
  render(<BackupDetail />);
};

describe("BackupDetail", () => {
  after(() => {
    vi.restoreAllMocks();
  });

  it("should show loading message if loading", () => {
    // Arrange
    mockProducts([], true, false);
    mockSales([], false, false);
    renderBackupDetail();

    // Expect
    expect(screen.getByText("backupLoading")).toBeInTheDocument();
  });

  it("should show error message if error", () => {
    // Arrange
    mockProducts([], false, true);
    mockSales([], false, false);
    renderBackupDetail();

    // Expect
    expect(screen.getByText("backupError")).toBeInTheDocument();
  });

  it("should render title, description and download button", () => {
    // Arrange
    mockProducts([], false, false);
    mockSales([], false, false);
    renderBackupDetail();
    const title = screen.getByTestId(`${DATA_TEST_ID}-title`);
    const description = screen.getByTestId(`${DATA_TEST_ID}-description`);
    const button = screen.getByTestId(`${DATA_TEST_ID}-button`);

    // Expect
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("should call downloadCSV when clicking download button and there is data", async () => {
    // Arrange
    const products = [{ id: 1, name: "Prod" }];
    const sales = [{ id: 2, total: 100 }];
    mockProducts(products, false, false);
    mockSales(sales, false, false);
    renderBackupDetail();

    // Mock downloadCSV
    const createObjectURLMock = vi.fn(() => "blob:url");
    const revokeObjectURLMock = vi.fn();
    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;

    const appendChildMock = vi.fn();
    const removeChildMock = vi.fn();
    document.body.appendChild = appendChildMock;
    document.body.removeChild = removeChildMock;

    const user = userEvent.setup();
    const downloadBtn = screen.getByRole("button", { name: "backupDownload" });

    // Act
    await user.click(downloadBtn);

    // Expect: a blob is created and createObjectURL is called
    expect(createObjectURLMock).toHaveBeenCalled();
    expect(appendChildMock).toHaveBeenCalled();
    expect(removeChildMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalled();
  });
});
