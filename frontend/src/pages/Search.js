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

  return (
    <div>
      <input type="text" id="searchbar" />
      <button onClick={handleSubmit}>Search</button>
    </div>
  );
};

export { Search };
