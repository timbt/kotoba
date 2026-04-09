import { useQuery } from "@tanstack/react-query";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";

import { client } from "../api/client";
import {
  GET_SEARCH_RESULTS,
  type SearchResults as SearchResultsType,
} from "../api/queries";
import KanjiSearchResult from "./KanjiSearchResult";

interface Props {
  searchQuery: string;
}

function formatResultCount(n: number): string {
  return n == 1 ? "1 result found" : `${n} results found`;
}

function SearchResults({ searchQuery }: Props) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () =>
      client.request<{ search: SearchResultsType }>(GET_SEARCH_RESULTS, {
        searchQuery: searchQuery,
      }),
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error loading search results.</p>;

  const totalResultsCount = data.search.kanji.length;

  return (
    <Container className="mt-3">
      <h3>
        Searched for "{data.search.search_query}":{" "}
        {formatResultCount(totalResultsCount)}.
      </h3>
      <Accordion defaultActiveKey="kanji">
        <Accordion.Item eventKey="kanji">
          <Accordion.Header>
            Kanji - {formatResultCount(data.search.kanji.length)}
          </Accordion.Header>
          <Accordion.Body>
            <Stack direction="horizontal" gap={2} className="flex-wrap">
              {data.search.kanji.map((k) => (
                <KanjiSearchResult key={k.literal} kanji={k} />
              ))}
            </Stack>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}

export default SearchResults;
