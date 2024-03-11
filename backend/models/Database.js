const { MongoClient } = require("mongodb");

async function saveToMongoDB(title, writer, doiNumber, abstract, section, keywords, article_keywords, date, referans, link, citation_count) {
  try {
    // MongoDB'ye bağlan
    const uri = "mongodb+srv://tuf:twofun1905@cluster0.ci77jcw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
      
    // Veritabanına eriş
    const database = client.db("mydatabase");
    const collection = database.collection("articles");

    // Başlık bilgisini ve site bağlantısını MongoDB'ye kaydet
    await collection.insertOne({ title: title, writer: writer, doiNumber: doiNumber, abstract: abstract, section: section, keywords: keywords, article_keywords: article_keywords, date: date, referans: referans, link:link, citation_count: citation_count});
    
    console.log("MongoDB'ye basariyla kaydedildi.");

    // Bağlantıyı kapat
    await client.close();
  } catch (error) {
    console.log("Hata:", error);
  }
}

module.exports = saveToMongoDB;
