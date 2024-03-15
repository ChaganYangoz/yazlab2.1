import "./App.css";
import { Search } from "./pages/Search";
import React, { useState, useEffect } from "react";

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
  }, []); // Boş bağımlılık dizisi, bileşen ilk defa render edildiğinde yalnızca bir kez çalışmasını sağlar

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Search />
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
