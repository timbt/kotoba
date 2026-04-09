import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { client } from "../api/client";
import SearchResults from "./SearchResults";

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

vi.mock("../api/client", () => ({
  client: { request: vi.fn() },
}));

const mockData = (kanji: { literal: string; meanings: string[] }[]) => ({
  search: {
    search_query: "cat",
    kanji,
  },
});

describe("SearchResults", () => {
  it("renders loading state initially", () => {
    vi.mocked(client.request).mockResolvedValue(mockData([]));
    render(<SearchResults searchQuery="cat" />, { wrapper });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state when request fails", async () => {
    vi.mocked(client.request).mockRejectedValue(new Error("Network error"));
    render(<SearchResults searchQuery="cat" />, { wrapper });
    expect(
      await screen.findByText("Error loading search results."),
    ).toBeInTheDocument();
  });

  it("displays the search query in the heading", async () => {
    vi.mocked(client.request).mockResolvedValue(mockData([]));
    render(<SearchResults searchQuery="cat" />, { wrapper });
    expect(await screen.findByText(/Searched for "cat"/)).toBeInTheDocument();
  });

  it('displays "1 result found" in the header and kanji accordion', async () => {
    vi.mocked(client.request).mockResolvedValue(
      mockData([{ literal: "猫", meanings: ["cat"] }]),
    );
    render(<SearchResults searchQuery="cat" />, { wrapper });
    expect(
      await screen.findByRole("heading", { level: 3, name: /1 result found/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /Kanji - 1 result found/ }),
    ).toBeInTheDocument();
  });

  it('displays "N results found" in the header and kanji accordion for multiple results', async () => {
    vi.mocked(client.request).mockResolvedValue(
      mockData([
        { literal: "川", meanings: ["river"] },
        { literal: "河", meanings: ["river"] },
      ]),
    );
    render(<SearchResults searchQuery="river" />, { wrapper });
    expect(
      await screen.findByRole("heading", { level: 3, name: /2 results found/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Kanji - 2 results found/,
      }),
    ).toBeInTheDocument();
  });

  it('displays "0 results found" in the header and kanji accordion when there are no results', async () => {
    vi.mocked(client.request).mockResolvedValue(mockData([]));
    render(<SearchResults searchQuery="cat" />, { wrapper });
    expect(
      await screen.findByRole("heading", { level: 3, name: /0 results found/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Kanji - 0 results found/,
      }),
    ).toBeInTheDocument();
  });
});
