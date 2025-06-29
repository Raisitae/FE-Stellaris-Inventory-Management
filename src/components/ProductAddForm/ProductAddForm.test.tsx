import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { usePostProduct } from "@/lib/query/hooks/useProductMutation";
import { usePlatformsQuery } from "@/lib/query/hooks/usePlatformQuery";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import ProductAddForm from "./ProductAddForm";
import { afterEach } from "node:test";
import userEvent from "@testing-library/user-event";

const DATA_TEST_ID = "product-add-form-component";
// Mocks necesarios
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/lib/query/hooks/useProductMutation", () => ({
  usePostProduct: vi.fn(),
}));

vi.mock("@/lib/query/hooks/usePlatformQuery", () => ({
  usePlatformsQuery: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderProductForm = () => {
  render(
    <BrowserRouter>
      <ProductAddForm />
    </BrowserRouter>
  );
};
describe("ProductAddForm", () => {
  const mockCreateProduct = vi.fn();

  beforeEach(() => {
    (usePostProduct as Mock).mockReturnValue({
      mutate: mockCreateProduct,
      isPending: false,
      isSuccess: false,
      data: {},
    });

    (usePlatformsQuery as Mock).mockReturnValue({
      data: [
        { _id: "1", name: "PlayStation" },
        { _id: "2", name: "Xbox" },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar todos los campos del formulario", () => {
    // Arrange
    renderProductForm();
    const name = screen.getByTestId(`${DATA_TEST_ID}-name-label`);
    const price = screen.getByTestId(`${DATA_TEST_ID}-price-label`);
    const stock = screen.getByTestId(`${DATA_TEST_ID}-stock-label`);
    const description = screen.getByTestId(`${DATA_TEST_ID}-description-label`);
    const category = screen.getByTestId(`${DATA_TEST_ID}-category-label`);
    const platform = screen.getByTestId(`${DATA_TEST_ID}-platform-label`);
    const status = screen.getByTestId(`${DATA_TEST_ID}-status-label`);
    const internCode = screen.getByTestId(`${DATA_TEST_ID}-internCode-label`);

    // Expect
    expect(name).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(stock).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(category).toBeInTheDocument();
    expect(platform).toBeInTheDocument();
    expect(status).toBeInTheDocument();
    expect(internCode).toBeInTheDocument();
  });

  it("should show errors if the form is incomplete", async () => {
    // Arrange
    renderProductForm();
    const category = screen.getByTestId(`${DATA_TEST_ID}-category-select`);
    const platform = screen.getByTestId(`${DATA_TEST_ID}-platform-select`);
    const status = screen.getByTestId(`${DATA_TEST_ID}-status-select`);
    const button = screen.getByTestId(`${DATA_TEST_ID}-button`);

    // Act
    fireEvent.change(category, {
      target: {
        value:
          (category as HTMLSelectElement).options.length > 1
            ? (category as HTMLSelectElement).options[1].value
            : "",
      },
    });
    fireEvent.change(platform, {
      target: {
        value:
          (platform as HTMLSelectElement).options.length > 1
            ? (platform as HTMLSelectElement).options[1].value
            : "",
      },
    });
    fireEvent.change(status, {
      target: {
        value:
          (status as HTMLSelectElement).options.length > 1
            ? (status as HTMLSelectElement).options[1].value
            : "",
      },
    });

    fireEvent.click(button);

    // Expect
    expect(await screen.findByText(/name.*required/i)).toBeInTheDocument();
    expect(await screen.findByText(/price.*required/i)).toBeInTheDocument();
  });

  it("should send the form data when all fields are filled", async () => {
    renderProductForm();
    const nameInput = screen.getByTestId(`${DATA_TEST_ID}-name-input`);
    const priceInput = screen.getByTestId(`${DATA_TEST_ID}-price-input`);
    const stockInput = screen.getByTestId(`${DATA_TEST_ID}-stock-input`);
    const descriptionInput = screen.getByTestId(
      `${DATA_TEST_ID}-description-input`
    );
    const status = screen.getByTestId(`${DATA_TEST_ID}-status-select`);
    const category = screen.getByTestId(`${DATA_TEST_ID}-category-select`);
    const platform = screen.getByTestId(`${DATA_TEST_ID}-platform-select`);

    const internCodeInput = screen.getByTestId(
      `${DATA_TEST_ID}-internCode-input`
    );
    const button = screen.getByTestId(`${DATA_TEST_ID}-button`);

    fireEvent.change(nameInput, {
      target: { value: "Juego Test" },
    });
    fireEvent.change(priceInput, {
      target: { value: "49.99" },
    });
    fireEvent.change(stockInput, {
      target: { value: "20" },
    });
    fireEvent.change(descriptionInput, {
      target: { value: "Un juego de prueba" },
    });

    fireEvent.change(category, {
      target: { value: (category as HTMLSelectElement).options[1].value },
    });

    fireEvent.change(platform, {
      target: { value: (platform as HTMLSelectElement).options[1].value },
    });

    fireEvent.change(status, {
      target: { value: (status as HTMLSelectElement).options[1].value },
    });

    fireEvent.change(internCodeInput, {
      target: { value: "TEST123" },
    });

    await userEvent.click(button);

    // Verifica que el botón esté en foco después del click
    expect(button).toHaveFocus();

    expect(button).toHaveFocus();

    expect(mockCreateProduct).toHaveBeenCalledWith({
      name: "Juego Test",
      price: 49.99,
      description: "Un juego de prueba",
      imageUrl: "",
      category: "juegos",
      platformId: "1",
      stock: 20,
      status: "nuevo",
      internCode: "TEST123",
    });
  });
});
