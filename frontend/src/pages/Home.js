import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8000/getAllMongoData");
      const data = await response.json();
      setDatas(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const socket = new WebSocket("ws://localhost:8080");

  socket.addEventListener("open", () => {
    console.log("WebSocket bağlantısı kuruldu.");
  });

  socket.addEventListener("message", (event) => {
    console.log("Sunucudan gelen mesaj:", event.data);
  });

  function handleSubmit() {
    const searchItem = document.querySelector("#searchbar");
    let message = searchItem.value;
    socket.send(message);
    searchItem.value = "";
  }

  async function getAll() {
    const response = await fetch("http://localhost:8000/getAllMongoData");
    const data = await response.json();
    setDatas(data);
  }
  async function filter() {
    const searchItem = document.querySelector("#searchbar");
    let message = searchItem.value;
    if (message === "") {
      getAll();
      return 0;
    }
    fetch(`http://localhost:8000/getPrivateMongoData?degisken=${message}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Alınan verileri kullanma
        console.log(data);
        setDatas(data);
      })
      .catch((error) => {
        // Hata durumunda işlemler
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  const handleSortByDate = () => {
    const sorted = [...datas].sort((a, b) => {
      const yearA = parseInt(a.date.substring(a.date.length - 4));
      const yearB = parseInt(b.date.substring(b.date.length - 4));
      return yearA - yearB;
    });
    setDatas(sorted);
  };

  const handleSortByDateDesc = () => {
    const sorted = [...datas].sort((a, b) => {
      const yearA = parseInt(a.date.substring(a.date.length - 4));
      const yearB = parseInt(b.date.substring(b.date.length - 4));
      return yearB - yearA;
    });
    setDatas(sorted);
  };
  return (
    <>
      <div>
        <input type="text" id="searchbar" />
        <button onClick={handleSubmit}>Search</button>
        <button onClick={filter}>Filter</button>
      </div>
      <button onClick={handleSortByDate}>Sort By Date Oldest First</button>
      <button onClick={handleSortByDateDesc}>Sort By Date Latest First</button>
      {datas.map((data) => (
        <div className="articleContainer">
          <Link to={{ pathname: "/page", state: { id: data._id } }}>
            {data.title}
          </Link>
        </div>
      ))}
    </>
  );
};

export { Home };
