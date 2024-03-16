const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function downloadPDF(url, destination, title) { // title parametresi ekleniyor
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    const filePath = path.resolve(destination, `${title}.pdf`); // Dosya adı olarak title'ı kullanıyoruz
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    throw new Error("PDF indirme işleminde hata oluştu: " + error.message);
  }
}

module.exports = downloadPDF;
