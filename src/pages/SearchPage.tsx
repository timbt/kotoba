import { useParams } from "react-router";

import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";

function SearchPage() {
  const { searchQuery } = useParams<{ searchQuery: string }>();

  return (
    <>
      <SearchBar />
      <SearchResults searchQuery={searchQuery!} />
    </>
  );
}

export default SearchPage;
