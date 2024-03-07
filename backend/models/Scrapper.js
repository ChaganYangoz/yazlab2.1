const axios = require("axios");
const cheerio = require("cheerio");

async function getHTML() {
  try {
    let response = await axios({
      url: "https://dergipark.org.tr/tr/pub/gujs/issue/69788/967981",
      method: "GET",
    });

    if (response.status == 200) {
      let $ = cheerio.load(response.data);
      console.log($);
    } else {
      console.warn("Response doesnt succesfull");
    }
  } catch (error) {
    console.log(error);
  }
}

getHTML();
