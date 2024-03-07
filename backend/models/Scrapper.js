const axios = require("axios");
const cheerio = require("cheerio");
const saveToMongoDB = require("./saveToMongoDB"); // saveToMongoDB fonksiyonunu içeren dosya

async function getTitleAndLink() {
  try {
    let response = await axios({
      url: "https://dergipark.org.tr/tr/pub/gujs/issue/69788/967981",
      method: "GET",
    });

    if (response.status == 200) {
      let $ = cheerio.load(response.data);
      let title = $("title").text(); // Başlık etiketini seç ve içeriğini al
      let siteLink = response.config.url; // Site bağlantısını al

      // MongoDB'ye kaydet
      await saveToMongoDB(title, siteLink);
    } else {
      console.warn("Response başarısız oldu.");
    }
  } catch (error) {
    console.log("Hata:", error);
  }
}

getTitleAndLink();
