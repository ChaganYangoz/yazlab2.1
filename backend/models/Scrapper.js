const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const { saveToMongoDB } = require("./Database");
const downloadPDF = require("./DownloadPdf");

async function getEveryone(wantedUrl = "https://dergipark.org.tr/tr/pub/gujs/issue/69788/967981", searchedWord) {

  try {
    let response = await axios({
      url: wantedUrl,
      method: "GET",
    });

    if (response.status == 200) {
      let $ = cheerio.load(response.data);
      let title = $("title").text();
      let writer = $("#author1898049 > a").text();
      let abstract = $("#article_en > div.article-abstract.data-section > div").text();
      let section = $("#kt_content > div > div.row > div.col-lg-9.col-md-8 > div:nth-child(2) > div > table > tbody > tr:nth-child(2) > td").text();
      let article_keywords = $("#article_en > div.article-keywords.data-section > p").text();
      let date = $("#kt_content > div > div.row > div.col-lg-9.col-md-8 > div:nth-child(2) > div > table > tbody > tr:nth-child(5) > td").text();
      let referans = $("#article_en > div.article-citations.data-section > div").text();

      let targetDiv = $("#kt_content > div > div.row > div.col-lg-9.col-md-8 > div:nth-child(4) > div");
      let citation_count = targetDiv.find(".media.cited_by_item").length;

      let doiLink = $("a.doi-link").attr("href");
      let doiNumber = 2; // doiLink.match(/10\.(\d+)/)[1];

      let targetTable = $("#kt_content > div > div.row > div.col-lg-9.col-md-8 > div:nth-child(3) > div > div > div > table > tbody");
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

      const pdfButtonLink = $("#article-toolbar > a.btn.btn-sm.float-left.article-tool.pdf.d-flex.align-items-center").attr("href");
      if (pdfButtonLink) {
        const pdfUrl = new URL(pdfButtonLink, wantedUrl).href;
        const downloadDir = path.join(__dirname, "downloads");
        if (!fs.existsSync(downloadDir)) {
          fs.mkdirSync(downloadDir);
        }
        try {
          await downloadPDF(pdfUrl, downloadDir, title); // title'ı downloadPDF fonksiyonuna iletiyoruz
          console.log("PDF indirildi ve downloads klasörüne kaydedildi.");
        } catch (error) {
          console.error("PDF indirme işleminde hata oluştu:", error);
        }
      } else {
        console.warn("PDF indirme bağlantısı bulunamadı.");
      }
    }
  } catch (error) {
    console.error("Hata oluştu:", error);
  }
}


module.exports = getEveryone;
