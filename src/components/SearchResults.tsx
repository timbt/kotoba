interface Props {
  query: string;
}

function SearchResults({ query }: Props) {
  return <div>{query}</div>;
}

export default SearchResults;
