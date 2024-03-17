const { MongoClient, ObjectId } = require('mongodb');

async function saveToMongoDB(
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
) {
  try {
    // MongoDB'ye bağlan
    const uri =
      "mongodb+srv://tuf:twofun1905@cluster0.ci77jcw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri);
    await client.connect();

    // Veritabanına eriş
    const database = client.db("mydatabase");
    const collection = database.collection("articles");

    const existingDocument = await collection.findOne({ title: title });

    // Eğer belge bulunursa, ekstra olarak eklemeyi engelle ve hata mesajı yazdır
    if (existingDocument) {
      console.log("Belge zaten mevcut, ekstra olarak eklenmedi.");
    } else {
      // Belgeyi MongoDB'ye kaydet
      await collection.insertOne({
        title: title,
        writer: writer,
        doiNumber: doiNumber,
        abstract: abstract,
        section: section,
        keywords: keywords,
        article_keywords: article_keywords,
        date: date,
        referans: referans,
        link: link,
        citation_count: citation_count,
      });
      console.log("MongoDB'ye başarıyla kaydedildi.");
    }

    // Bağlantıyı kapat
    await client.close();
  } catch (error) {
    console.log("Hata:", error);
  }
}

async function getByIDFromMongoDB(articleID) {
  try {
    // MongoDB'ye bağlan
    const uri = "mongodb+srv://tuf:twofun1905@cluster0.ci77jcw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri);
    await client.connect();

    // Veritabanına eriş
    const database = client.db("mydatabase");
    const collection = database.collection("articles");

    // İlgili ID ile belgeyi bul
    const result = await collection.findOne({ _id: new ObjectId(articleID) });

    // Bağlantıyı kapat
    await client.close();

    return result; // Belgeyi döndür
  } catch (error) {
    console.log("Hata:", error);
    return null; // Hata durumunda null döndür
  }
}

async function getAllFromMongoDB() {
  const uri =
    "mongodb+srv://tuf:twofun1905@cluster0.ci77jcw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    // MongoDB'ye bağlan

    await client.connect();
    console.log("MongoDB'ye başarıyla bağlandı.");

    // Veritabanına eriş
    const database = client.db("mydatabase");
    const collection = database.collection("articles");

    // Tüm verileri al
    const allData = await collection.find({}).toArray();
    console.log("Tüm veriler başarıyla alındı:", allData);

    return allData;
  } catch (error) {
    console.error("Hata:", error);
    throw error; // Hatanın yönetimini çağıran kod parçasına iletmek için hatayı yeniden fırlat
  } finally {
    // Bağlantıyı kapat
    await client.close();
    console.log("MongoDB bağlantısı kapatıldı.");
  }
}

async function getPrivateFromMongoDB(filterWord) {
  try {
    // MongoDB'ye bağlan
    const uri =
      "mongodb+srv://tuf:twofun1905@cluster0.ci77jcw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri);
    await client.connect();

    // Veritabanına eriş
    const database = client.db("mydatabase");
    const collection = database.collection("articles");

    const regexPattern = new RegExp(filterWord, "i"); // 'i' ifadesi büyük/küçük harf duyarlı olmayacaktır
    const query = { keywords: { $regex: regexPattern } };
    const projection = { _id: 1, title: 1 }; // Sadece id ve title alanlarını al
    const result = await collection.find(query, projection).toArray();

    // Bağlantıyı kapat
    await client.close();

    return result.map((item) => ({ id: item._id, title: item.title })); // id ve title alanlarını içeren bir dizi döndür
  } catch (error) {
    console.log("Hata:", error);
    return [];
  }
}

module.exports = {
  saveToMongoDB,
  getAllFromMongoDB,
  getPrivateFromMongoDB,
  getByIDFromMongoDB
};
