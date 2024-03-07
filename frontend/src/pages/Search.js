const Search = () => {
  function handleSubmit() {
    const searchItem = document.querySelector("#searchbar");
    console.log(searchItem.value);
  }

  return (
    <div>
      <input type="text" id="searchbar" />
      <button onClick={handleSubmit}>Search</button>
    </div>
  );
};

export { Search };
