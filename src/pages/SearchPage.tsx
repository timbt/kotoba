import { useParams } from "react-router";

import SearchBar from "../components/SearchBar";

function SearchPage() {
  const { query } = useParams<{ query: string }>();

  return (
    <>
      <SearchBar />
      <div>{query}</div>
    </>
  );
}

export default SearchPage;
