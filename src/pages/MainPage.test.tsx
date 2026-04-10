import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";

import MainPage from "./MainPage";
import SearchPage from "./SearchPage";

function renderMainPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/search/:searchQuery" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("MainPage", () => {
  it("renders the search bar", () => {
    renderMainPage();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("navigates to search results on submit", async () => {
    const user = userEvent.setup();
    renderMainPage();
    await user.type(screen.getByRole("textbox"), "cat");
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(await screen.findByText(/Searched for "cat"/)).toBeInTheDocument();
  });
});
