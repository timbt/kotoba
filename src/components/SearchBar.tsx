import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Search } from "react-bootstrap-icons";
import { useNavigate } from "react-router";

function SearchBar() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (value) navigate(`/search/${value}`);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          as="input"
          type="text"
          placeholder="Search for something... (eg. 'cat' or '猫')"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type="submit" aria-label="Search">
          <Search />
        </Button>
      </InputGroup>
    </Form>
  );
}

export default SearchBar;
