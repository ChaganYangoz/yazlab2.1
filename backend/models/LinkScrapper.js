const axios = require("axios");
const cheerio = require("cheerio");

async function getLink(message) {
  const scrapeLinks =
    "https://dergipark.org.tr/tr/search?q=" + message + "&section=articles";
  try {
    let response = await axios({
      url: scrapeLinks,
      method: "GET",
    });

    if (response.status == 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      const links = [];
      $(
        "#kt_content > div.kt-container.kt-grid__item.kt-grid__item--fluid > div.row > div.col-lg-9.search-results-wrapper > div.article-cards > div > div > h5 > a"
      ).each((index, element) => {
        links.push({
          title: $(element).text(),
          url: $(element).attr("href"),
        });
      });

      return links;
    } else {
      console.warn("Response başarısız oldu.");
    }
  } catch (error) {
    console.log("Hata:", error);
  }
}
module.exports = getLink;
