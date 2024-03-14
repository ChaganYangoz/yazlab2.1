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

async function getAllFromMongoDB() {
  try {
    // MongoDB'ye bağlan
    const uri = "mongodb+srv://tuf:twofun1905@cluster0.ci77jcw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
      
    // Veritabanına eriş
    const database = client.db("mydatabase");
    const collection = database.collection("articles");

    // Tüm verileri al
    const allData = await collection.find({}).toArray();
    
    // Bağlantıyı kapat
    await client.close();

    return allData;
  } catch (error) {
    console.log("Hata:", error);
    return [];
  }
}

async function getPrivateFromMongoDB() {
  try {
    // MongoDB'ye bağlan
    const uri = "mongodb+srv://tuf:twofun1905@cluster0.ci77jcw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
      
    // Veritabanına eriş
    const database = client.db("mydatabase");
    const collection = database.collection("articles");

    const query = { "article_keywords": { $regex: /ai/i } }; // Regex ile "ai" içerenleri ara, "i" ifadesi büyük/küçük harf duyarlı olmayacaktır
    const projection = { _id: 1, title: 1 }; // Sadece id ve title alanlarını al
    const result = await collection.find(query, projection).toArray();
    
    // Bağlantıyı kapat
    await client.close();

    return result.map(item => ({ id: item._id, title: item.title })); // id ve title alanlarını içeren bir dizi döndür
  } catch (error) {
    console.log("Hata:", error);
    return [];
  }
}


module.exports = {
  saveToMongoDB,
  getAllFromMongoDB,
  getPrivateFromMongoDB
};
