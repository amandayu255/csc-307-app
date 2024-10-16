import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  async function removeOneCharacter(id) {
    try {
      const response = await fetch(`http://localhost:8000/users/${id}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        const updated = characters.filter((character) => character.id !== id);
        setCharacters(updated);
      } else if (response.status === 404) {
        console.error("User not found:", response.status);
      } else {
        console.error("Failed to delete user:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function fetchUsers() {
    return fetch("http://localhost:8000/users");
  }

  const postUser = async (person) => {
    try {
      const response = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });

      if (response.status === 201) {
        const newUser = await response.json(); 
        setCharacters((prevCharacters) => [...prevCharacters, newUser]); 
      } else {
        console.error("Failed to add user:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function updateList(person) {
    postUser(person).catch((error) => {
      console.log(error);
    });
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />

      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
