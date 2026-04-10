import { graphql, HttpResponse } from "msw";

import type { KanjiEntry, SearchResults } from "../api/queries";

export const defaultKanji: KanjiEntry = {
  literal: "猫",
  readings_on: ["ビョウ"],
  readings_kun: ["ねこ"],
  meanings: ["cat"],
};

export const defaultSearchResults: SearchResults = {
  search_query: "cat",
  kanji: [defaultKanji],
};

export const handlers = [
  graphql.query("GetKanji", ({ variables }) => {
    if (variables.literal === "猫") {
      return HttpResponse.json({ data: { kanji: defaultKanji } });
    }
    return HttpResponse.json({ data: { kanji: null } });
  }),

  graphql.query("getSearchResults", ({ variables }) => {
    return HttpResponse.json({
      data: {
        search: {
          search_query: variables.searchQuery as string,
          kanji: defaultSearchResults.kanji,
        },
      },
    });
  }),
];
