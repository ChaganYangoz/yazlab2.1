import "./App.css";
import React, { useState, useEffect, createContext, useContext } from "react";

function App() {
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
    if (message == "") {
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
  return (
    <div className="App">
      <div>
        <input type="text" id="searchbar" />
        <button onClick={handleSubmit}>Search</button>
        <button onClick={filter}>Filter</button>
      </div>
      {datas.map((data) => (
        <div className="articleContainer">
          <a key={data.id} href={"/" + data._id}>
            {data.title}
          </a>
        </div>
      ))}
    </div>
  );
}

export default App;
