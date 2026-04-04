import { useParams } from "react-router";

import SearchBar from "../components/SearchBar";

function SearchPage() {
  const { searchValue } = useParams<{ searchValue: string }>();

  return (
    <>
      <SearchBar />
      <div>{searchValue}</div>
    </>
  );
}

export default SearchPage;
