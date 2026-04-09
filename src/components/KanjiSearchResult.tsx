import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router";

import { type KanjiEntry } from "../api/queries";

interface Props {
  kanji: KanjiEntry;
}

function KanjiSearchResult({ kanji }: Props) {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(`/kanji/${kanji.literal}`)}
      className="d-flex flex-column align-items-center"
    >
      <span>{kanji.literal}</span>
      {kanji.meanings[0] && <small>{kanji.meanings[0]}</small>}
    </Button>
  );
}

export default KanjiSearchResult;
