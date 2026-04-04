import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Route, Routes } from "react-router";

import KanjiPage from "./pages/KanjiPage";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <Container>
      <Navbar>
        <Container>
          <Navbar.Brand href="/kotoba/">kotoba</Navbar.Brand>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/kanji/:literal" element={<KanjiPage />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Container>
  );
}

export default App;
