import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { graphql, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router";

import { server } from "../test/server";
import SearchPage from "./SearchPage";

function renderSearchPage(searchQuery: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/search/${searchQuery}`]}>
        <Routes>
          <Route path="/search/:searchQuery" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("SearchPage", () => {
  it("renders loading state initially", () => {
    renderSearchPage("cat");
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders search results from the API", async () => {
    renderSearchPage("cat");
    expect(await screen.findByText(/Searched for "cat"/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /猫/ })).toBeInTheDocument();
  });

  it("renders 0 results when the API returns an empty list", async () => {
    server.use(
      graphql.query("getSearchResults", () =>
        HttpResponse.json({
          data: { search: { search_query: "xyz", kanji: [] } },
        }),
      ),
    );
    renderSearchPage("xyz");
    expect(
      await screen.findByRole("heading", { level: 3, name: /0 results found/ }),
    ).toBeInTheDocument();
  });

  it("renders error state when the API request fails", async () => {
    server.use(
      graphql.query("getSearchResults", () =>
        HttpResponse.json({ errors: [{ message: "Internal server error" }] }),
      ),
    );
    renderSearchPage("cat");
    expect(
      await screen.findByText("Error loading search results."),
    ).toBeInTheDocument();
  });
});
