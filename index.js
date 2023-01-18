const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
// middleware

app.use(cors());
app.use(express.json());
// require("./index.js");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c8lf0v2.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("primeDatabase");
    const productCollection = database.collection("products");

    //post product
    // users post api
    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.json(result);
    });
    // get single product
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const question = await productCollection.findOne(query);
      res.json(question);
    });
    // get all product
    app.get("/product", async (req, res) => {
      const cursor = productCollection.find({});
      const user = await cursor.toArray();
      res.send(user);
    });

    // update product
    app.put("/users", async (req, res) => {
      const product = req.body;
      const filter = { _id: ObjectId(product?._id) };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //delete product

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("prime server two is running");
});

app.listen(port, () => {
  console.log("server running at port ", port);
});
