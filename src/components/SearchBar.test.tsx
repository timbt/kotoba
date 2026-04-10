import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

import SearchBar from "./SearchBar";

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SearchBar", () => {
  beforeEach(() => mockNavigate.mockClear());

  it("renders the search input and button", () => {
    render(<SearchBar />, { wrapper: MemoryRouter });
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("navigates to the search page on submit", async () => {
    const user = userEvent.setup();
    render(<SearchBar />, { wrapper: MemoryRouter });
    await user.type(screen.getByRole("textbox"), "猫");
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(mockNavigate).toHaveBeenCalledWith("/search/猫");
  });

  it("does not navigate when input is empty", async () => {
    const user = userEvent.setup();
    render(<SearchBar />, { wrapper: MemoryRouter });
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
