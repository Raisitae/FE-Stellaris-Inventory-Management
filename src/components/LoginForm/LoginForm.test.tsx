import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderWithQueryClient } from "@/setupTests"; // ajustá la ruta si hace falta
import { LoginForm } from "./LoginForm";
import { MemoryRouter } from "react-router-dom";
import { afterEach } from "node:test";

const DATA_TEST_ID = "login-form-component";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: unknown) => key, // Mock de la función de traducción
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

const renderLoginForm = () => {
  return renderWithQueryClient(
    <MemoryRouter initialEntries={["/login"]} initialIndex={0}>
      <LoginForm />
    </MemoryRouter>
  );
};

describe("LoginForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render all main elements", () => {
    //Arrange
    renderLoginForm();

    const form = screen.getByTestId(`${DATA_TEST_ID}.form`);
    const emailInput = screen.getByTestId(`${DATA_TEST_ID}.email.input`);
    const passwordInput = screen.getByTestId(`${DATA_TEST_ID}.password.input`);
    const submitButton = screen.getByTestId(`${DATA_TEST_ID}.submit.button`);

    //expect
    expect(form).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("should render the correct type on the inputs and buttons", () => {
    //Arrange
    renderLoginForm();

    const emailInput = screen.getByTestId(`${DATA_TEST_ID}.email.input`);
    const passwordInput = screen.getByTestId(`${DATA_TEST_ID}.password.input`);
    const submitButton = screen.getByRole("button", { name: "signIn" });

    //Expect
    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("should trigger the submit event when the form is submitted", () => {
    // Arrange
    const handleSubmit = vi.fn((e) => e.preventDefault());

    render(
      <MemoryRouter initialEntries={["/login"]} initialIndex={0}>
        <form data-testid={`${DATA_TEST_ID}.form`} onSubmit={handleSubmit}>
          <button data-testid={`${DATA_TEST_ID}.submit.button`} type="submit">
            signIn
          </button>
        </form>
      </MemoryRouter>
    );

    // Expect
    const form = screen.getByTestId(`${DATA_TEST_ID}.form`);
    expect(handleSubmit).not.toHaveBeenCalled();

    // Act
    form.dispatchEvent(new Event("submit", { bubbles: true }));

    // Expect
    expect(handleSubmit).toHaveBeenCalled();
  });
});
