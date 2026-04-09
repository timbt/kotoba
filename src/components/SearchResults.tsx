import { useQuery } from "@tanstack/react-query";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";

import { client } from "../api/client";
import {
  GET_SEARCH_RESULTS,
  type SearchResults as SearchResultsType,
} from "../api/queries";

interface Props {
  searchQuery: string;
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

  const entries = data.search.kanji.map((item) => {
    const meanings = item.meanings.join(", ");
    return meanings ? (
      <li>
        {item.literal}: {meanings}
      </li>
    ) : (
      <li>{item.literal}</li>
    );
  });

  const formatResultCount = (n: number): string =>
    n == 1 ? "1 result found" : `${n} results found`;

  const kanjiResults = data.search.kanji.length;
  const totalResults = kanjiResults;

  return (
    <Container className="mt-3">
      <h3>
        Searched for "{data.search.search_query}":{" "}
        {formatResultCount(totalResults)}.
      </h3>
      <Accordion defaultActiveKey="kanji">
        <Accordion.Item eventKey="kanji">
          <Accordion.Header>
            Kanji - {formatResultCount(kanjiResults)}
          </Accordion.Header>
          <Accordion.Body>
            <ul>{entries}</ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}

export default SearchResults;
