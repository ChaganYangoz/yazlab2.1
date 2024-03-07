const { MongoClient } = require("mongodb");

async function saveToMongoDB(title, siteLink) {
  try {
    // MongoDB'ye bağlan
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
      
    // Veritabanına eriş
    const database = client.db("mydatabase");
    const collection = database.collection("titles");

    // Başlık bilgisini ve site bağlantısını MongoDB'ye kaydet
    await collection.insertOne({ title: title, siteLink: siteLink });
    
    console.log("Başlık ve site bağlantısı MongoDB'ye başarıyla kaydedildi.");

    // Bağlantıyı kapat
    await client.close();
  } catch (error) {
    console.log("Hata:", error);
  }
}

module.exports = saveToMongoDB;
