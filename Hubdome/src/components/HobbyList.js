import React, { useState, useEffect } from "react";
import axios from "axios";

const HobbyList = () => {
  const [hobbies, setHobbies] = useState([]);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const response = await axios.get("/api/hobbies");
        setHobbies(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHobbies();
  }, []);

  return (
    <div>
      {hobbies.map((hobby) => (
        <div key={hobby._id}>
          <h3>{hobby.name}</h3>
          <p>{hobby.description}</p>
        </div>
      ))}
    </div>
  );
};

export default HobbyList;
