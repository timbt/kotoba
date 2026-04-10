import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { graphql, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router";

import { server } from "../test/server";
import KanjiPage from "./KanjiPage";

function renderKanjiPage(literal: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/kanji/${literal}`]}>
        <Routes>
          <Route path="/kanji/:literal" element={<KanjiPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("KanjiPage", () => {
  it("renders loading state initially", () => {
    renderKanjiPage("猫");
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders kanji data from the API", async () => {
    renderKanjiPage("猫");
    expect(await screen.findByText("猫")).toBeInTheDocument();
    expect(screen.getByText(/ねこ/)).toBeInTheDocument();
    expect(screen.getByText(/ビョウ/)).toBeInTheDocument();
    expect(screen.getByText(/cat/)).toBeInTheDocument();
  });

  it("renders not-found message when kanji does not exist", async () => {
    renderKanjiPage("foo");
    expect(await screen.findByText(/no kanji found/i)).toBeInTheDocument();
  });

  it("renders error state when the API request fails", async () => {
    server.use(
      graphql.query("GetKanji", () =>
        HttpResponse.json({ errors: [{ message: "Internal server error" }] }),
      ),
    );
    renderKanjiPage("猫");
    expect(await screen.findByText("Error loading kanji.")).toBeInTheDocument();
  });
});
