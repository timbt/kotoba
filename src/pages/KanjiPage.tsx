import { useParams } from "react-router";

import Kanji from "../components/Kanji";
import SearchBar from "../components/SearchBar";

function KanjiPage() {
  const { literal } = useParams<{ literal: string }>();
  return (
    <>
      <SearchBar />
      <div className="mt-3">{literal && <Kanji literal={literal} />}</div>
    </>
  );
}

export default KanjiPage;
