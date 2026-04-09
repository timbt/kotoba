import { useQuery } from "@tanstack/react-query";

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

  return <ul>{entries}</ul>;
}

export default SearchResults;
