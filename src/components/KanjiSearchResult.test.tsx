import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

import KanjiSearchResult from "./KanjiSearchResult";

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const kanjiWithMeaning = {
  literal: "猫",
  readings_on: ["ビョウ"],
  readings_kun: ["ねこ"],
  meanings: ["cat", "feline"],
};

const kanjiWithoutMeaning = {
  literal: "猫",
  readings_on: [],
  readings_kun: [],
  meanings: [],
};

describe("KanjiSearchResult", () => {
  beforeEach(() => mockNavigate.mockClear());

  it("renders the kanji literal", () => {
    render(<KanjiSearchResult kanji={kanjiWithMeaning} />, {
      wrapper: MemoryRouter,
    });
    expect(screen.getByText("猫")).toBeInTheDocument();
  });

  it("renders the first meaning when present", () => {
    render(<KanjiSearchResult kanji={kanjiWithMeaning} />, {
      wrapper: MemoryRouter,
    });
    expect(screen.getByText("cat")).toBeInTheDocument();
  });

  it("does not render a second meaning", () => {
    render(<KanjiSearchResult kanji={kanjiWithMeaning} />, {
      wrapper: MemoryRouter,
    });
    expect(screen.queryByText("feline")).not.toBeInTheDocument();
  });

  it("renders no meaning text when meanings are empty", () => {
    render(<KanjiSearchResult kanji={kanjiWithoutMeaning} />, {
      wrapper: MemoryRouter,
    });
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });

  it("navigates to the kanji page when clicked", async () => {
    const user = userEvent.setup();
    render(<KanjiSearchResult kanji={kanjiWithMeaning} />, {
      wrapper: MemoryRouter,
    });
    await user.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/kanji/猫");
  });
});