import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Page = () => {
  const location = useLocation();
  const { state } = location;

  const id = state && state.id;
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:8000/getByIDFromMongoDB?articleID=${id}`
      );
      const data = await response.json();
      console.log(data);
      setDatas(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>{datas.title}</div>
      <div>Writer: {datas.writer}</div>
      <div>Date: {datas.date}</div>
      <div>Article Keywords: {datas.article_keywords}</div>
      <div>Keywords: {datas.keywords}</div>
      <div>Link: {datas.link}</div>
      <div>References: {datas.referans}</div>
    </div>
  );
};

export { Page };
