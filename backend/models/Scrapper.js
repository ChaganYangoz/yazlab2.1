const axios = require("axios");
const cheerio = require("cheerio");
const { saveToMongoDB } = require("./Database");
async function getEveryone(wantedUrl, searchedWord) {
  try {
    let response = await axios({
      url: wantedUrl,
      method: "GET",
    });

    if (response.status == 200) {
      let $ = cheerio.load(response.data);
      let title = $("title").text();
      let writer = $("#author1898049 > a").text();
      let abstract = $(
        "#article_en > div.article-abstract.data-section > div"
      ).text();
      let section = $(
        "#kt_content > div > div.row > div.col-lg-9.col-md-8 > div:nth-child(2) > div > table > tbody > tr:nth-child(2) > td"
      ).text();
      let article_keywords = $(
        "#article_en > div.article-keywords.data-section > p"
      ).text();
      let date = $(
        "#kt_content > div > div.row > div.col-lg-9.col-md-8 > div:nth-child(2) > div > table > tbody > tr:nth-child(5) > td"
      ).text();
      let referans = $(
        "#article_en > div.article-citations.data-section > div"
      ).text();

      let targetDiv = $(
        "#kt_content > div > div.row > div.col-lg-9.col-md-8 > div:nth-child(4) > div"
      );
      let citation_count = targetDiv.find(".media.cited_by_item").length;

      let doiLink = $("a.doi-link").attr("href");
      let doiNumber = 2; // doiLink.match(/10\.(\d+)/)[1];

      let targetTable = $(
        "#kt_content > div > div.row > div.col-lg-9.col-md-8 > div:nth-child(3) > div > div > div > table > tbody"
      );
      let keywords = [searchedWord];
      targetTable.find(".cite-table-item").each((index, element) => {
        const keyword = $(element).text().trim();
        keywords.push(keyword);
      });

      let link = response.config.url; // Site bağlantısını al

      await saveToMongoDB(
        title,
        writer,
        doiNumber,
        abstract,
        section,
        keywords,
        article_keywords,
        date,
        referans,
        link,
        citation_count
      );
    } else {
      console.warn("Response basarisiz oldu.");
    }
  } catch (error) {
    console.log("Hata:", error);
  }
}

module.exports = getEveryone;
