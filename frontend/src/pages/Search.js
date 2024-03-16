const Search = () => {
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

  async function filter() {
    const searchItem = document.querySelector("#searchbar");
    let message = searchItem.value;
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
      })
      .catch((error) => {
        // Hata durumunda işlemler
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  return (
    <div>
      <input type="text" id="searchbar" />
      <button onClick={handleSubmit}>Search</button>
      <button onClick={filter}>Filter</button>
    </div>
  );
};

export { Search };
