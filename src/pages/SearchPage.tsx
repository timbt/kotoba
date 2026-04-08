import { useParams } from "react-router";

import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";

function SearchPage() {
  const { query } = useParams<{ query: string }>();

  return (
    <>
      <SearchBar />
      <SearchResults query={query!} />
    </>
  );
}

export default SearchPage;
