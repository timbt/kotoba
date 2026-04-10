import { gql } from "graphql-request";

export interface KanjiEntry {
  literal: string;
  readings_on: string[];
  readings_kun: string[];
  meanings: string[];
}

export interface SearchResults {
  search_query: string;
  kanji: KanjiEntry[];
}

export const KANJI_FIELDS = gql`
  fragment KanjiFields on Kanji {
    literal
    readings_on
    readings_kun
    meanings
  }
`;

export const GET_KANJI = gql`
  query GetKanji($literal: String!) {
    kanji(literal: $literal) {
      literal
      readings_on
      readings_kun
      meanings
    }
  }
`;

export const GET_SEARCH_RESULTS = gql`
  query getSearchResults($searchQuery: String!) {
    search(searchQuery: $searchQuery) {
      search_query
      kanji {
        literal
        readings_on
        readings_kun
        meanings
      }
    }
  }
`;
