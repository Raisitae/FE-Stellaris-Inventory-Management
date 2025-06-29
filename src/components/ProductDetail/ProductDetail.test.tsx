import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";

import { useDeleteProduct } from "@/lib/query/hooks/useProductMutation";
import { useLocation, useNavigate } from "@tanstack/react-router";
import userEvent from "@testing-library/user-event";
import { useProductQuery } from "@/lib/query/hooks/useProductQuery";
import ProductDetail from "./ProductDetail";

// Mocks
const mockNavigate = vi.fn();
const mockMutate = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/lib/query/hooks/useProductQuery");
vi.mock("@/lib/query/hooks/useProductMutation");

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-router")>(
    "@tanstack/react-router"
  );
  return {
    ...actual,
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
  };
});

const renderProductDetail = () => {
  render(<ProductDetail />);
};

describe("ProductDetail", () => {
  beforeEach(() => {
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockNavigate
    );
    (useLocation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pathname: "/products/abc123",
    });

    (useProductQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      error: null,
      data: {
        _id: "abc123",
        name: "Test Product",
        description: "This is a test product.",
        price: 100.5,
        category: "Action",
        platformId: "ps5",
        stock: 15,
        status: "available",
        internCode: "INT123",
      },
    });

    (useDeleteProduct as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockMutate,
      isSuccess: false,
    });

    mockMutate.mockClear();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it("should show the product details", async () => {
    // Arrange
    renderProductDetail();

    // Expect
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("This is a test product.")).toBeInTheDocument();
    expect(screen.getByText("$100.50")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("ps5")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("available")).toBeInTheDocument();
    expect(screen.getByText("INT123")).toBeInTheDocument();
    expect(screen.getByText("abc123")).toBeInTheDocument();
  });

  it("should navigate to the edit page when edit button is clicked", async () => {
    // Arrange
    renderProductDetail();
    const user = userEvent.setup();
    const editButton = screen.getByRole("button", { name: /edit/i });

    // Act
    await user.click(editButton);

    // Expect
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/products/edit/$id",
      params: { id: "abc123" },
    });
  });

  it("should call mutate when confirming deletion", async () => {
    // Arrange
    window.confirm = vi.fn(() => true);
    renderProductDetail();
    const user = userEvent.setup();
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    // Act
    await user.click(deleteButton);

    // Expect
    expect(mockMutate).toHaveBeenCalledWith("abc123");
  });

  it("should not call mutate if deletion is cancelled", async () => {
    // Arrange
    window.confirm = vi.fn(() => false);
    renderProductDetail();
    const user = userEvent.setup();
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    // Expect
    expect(deleteButton).toBeInTheDocument();

    // Act
    await user.click(deleteButton);

    // Expect
    expect(window.confirm).toHaveBeenCalled();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should show loading message if isLoading is true", () => {
    // Arrange
    (
      useProductQuery as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValueOnce({
      isLoading: true,
      error: false,
    });

    // Act
    renderProductDetail();

    // Expect
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should show error message if loading fails", () => {
    // Arrange
    (
      useProductQuery as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValueOnce({
      isLoading: false,
      error: true,
    });

    // Act
    renderProductDetail();

    // Expect
    expect(screen.getByText("Error loading product")).toBeInTheDocument();
  });
});
