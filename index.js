import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const port = 3000;

const url =
  "mongodb+srv://batmnkhrdn:dYlNifuyakxr9jF0@cluster0.c706r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url);

let collection;

async function connectDB() {
  try {
    await client.connect();
    console.log("Өгөгдлийн сантай амжилттай холбогдлоо!");

    const db = client.db("sample_mflix");
    collection = db.collection("movies");
  } catch (err) {
    console.error("Өгөгдлийн сантай холбогдоход алдаа гарлаа:", err);
  }
}

app.get("/", async (req, res) => {
  try {
    const movies = await collection
      .find({})
      .project({ title: 1, year: 1, _id: 0 })
      .limit(5)
      .toArray();

    res.send(movies);
  } catch (err) {
    res.status(500).send("Кино мэдээлэл татахад алдаа гарлаа.");
  }
});

app.get("/task1", async (req, res) => {
  try {
    const { title } = req.query;
    const movie = await collection.findOne({ title: title });

    res.send(movie || "Кино олдсонгүй.");
  } catch (err) {
    res.status(500).send("Кино хайх явцад алдаа гарлаа.");
  }
});

app.get("/task2", async (req, res) => {
  try {
    const { genre, page = 1, limit = 10 } = req.query;

    const movies = await collection
      .find({ genres: genre })
      .project({ genres: 1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .toArray();

    res.send(movies);
  } catch (err) {
    res.status(500).send("Кино жагсаалт татахад алдаа гарлаа.");
  }
});

app.get("/task3", async (req, res) => {
  try {
    const { imdbID } = req.query;
    const movie = await collection.findOne({ imdbID: imdbID }).toArray();

    res.send(movie.length ? movie : "Кино олдсонгүй.");
  } catch (err) {
    res.status(500).send("IMDB ID ашиглан кино хайхад алдаа гарлаа.");
  }
});

app.get("/task4", async (req, res) => {
  try {
    const { year } = req.query;

    if (!year || isNaN(parseInt(year))) {
      return res.status(400).send("Зөв жилийн утга оруулна уу.");
    }

    const movies = await collection
      .find({ year: parseInt(year) }) // Жилийг тоо болгон хөрвүүлэв
      .toArray();

    res.send(movies.length ? movies : "Кино олдсонгүй.");
  } catch (err) {
    res.status(500).send("Кино жагсаалт татахад алдаа гарлаа.");
  }
});
app.get("/task5", async (req, res) => {
  try {
    const { rating } = req.query;

    if (!rating || isNaN(parseInt(rating))) {
      return res.status(400).send(".....");
    }

    const movies = await collection
      .find({ year: parseInt(rating) }) // Жилийг тоо болгон хөрвүүлэв
      .toArray();

    res.send(movies.length ? movies : "Кино олдсонгүй.");
  } catch (err) {
    res.status(500).send("Кино жагсаалт татахад алдаа гарлаа.");
  }
});

app.get("/task5", async (req, res) => {
  try {
    const { rating } = req.query;

    if (!rating || isNaN(parseFloat(rating))) {
      return res.status(400).send("Зөв рейтингийн утга оруулна уу.");
    }

    const movies = await collection
      .find({ "movie.rating": { $gte: parseFloat(rating) } }) // >= өгөгдсөн үнэлгээ
      .project({ title: 1, "imdb.rating": 1, _id: 0 })
      .toArray();

    res.send(movies.length ? movies : "Кино олдсонгүй.");
  } catch (err) {
    res.status(500).send("Кино жагсаалт татахад алдаа гарлаа.");
  }
});

app.get("/task6", async (req, res) => {
  try {
    const { votes } = req.query;

    if (!votes || isNaN(parseInt(votes))) {
      return res.status(400).send("Зөв саналын (votes) утга оруулна уу.");
    }

    const movies = await collection
      .find({ "imdb.votes": { $gte: parseInt(votes) } }) // Саналаар шүүх
      .project({ title: 1, "imdb.rating": 1, "imdb.votes": 1, _id: 0 }) // Харуулах талбарууд
      .limit(5) // Зөв 10 кино буцаах
      .toArray();

    res.send(movies.length ? movies : "Кино олдсонгүй.");
  } catch (err) {
    res.status(500).send("Саналын тоогоор кино хайхад алдаа гарлаа.");
  }
});

app.get("/task7", async (req, res) => {
  try {
    const { runtime } = req.query;

    if (!runtime || isNaN(parseInt(runtime))) {
      return res.status(400).send("Зөв хугацааны (runtime) утга оруулна уу.");
    }

    const movies = await collection
      .find({ runtime: { $gte: parseInt(runtime) } }) // Хугацаагаар шүүх
      .project({ title: 1, runtime: 1, _id: 0 }) // Харуулах талбарууд
      .limit(5) // Зөвхөн 5 кино буцаах
      .toArray();

    res.send(movies.length ? movies : "Кино олдсонгүй.");
  } catch (err) {
    res.status(500).send("Хугацаагаар кино хайхад алдаа гарлаа.");
  }
});

app.get("/task8", async (req, res) => {
  try {
    const { director } = req.query;

    if (!director || typeof director !== "string") {
      return res
        .status(400)
        .send("Зөв найруулагчийн (director) нэр оруулна уу.");
    }

    const movies = await collection
      .find({ director: director }) // Найруулагчаар хайх
      .project({ title: 1, director: 1, _id: 0 }) // Харуулах талбарууд
      .limit(5) // Зөвхөн 5 кино буцаах
      .toArray();

    res.send(movies.length ? movies : "Кино олдсонгүй.");
  } catch (err) {
    res.status(500).send("Найруулагчаар кино хайхад алдаа гарлаа.");
  }
});

app.listen(port, async () => {
  await connectDB();
  console.log(`Сервер ${port} дээр ажиллаж байна.`);
});
