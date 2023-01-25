const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

const bcrypt = require("bcrypt");
const saltRounds = 10;
// middleware

app.use(cors());
const mongoose = require("mongoose");
const User = require("./models/user.model");

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
    const userCollection = database.collection("users");

    //post product
    // users post api
    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.json(result);
    });
    //register
    app.post("/register", async (req, res) => {
      const { firstName, lastName, email, password } = req.body;
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const user = new User({
            firstName,
            lastName,
            email,
            password: hash,
          });
          console.log(user);
          const result = userCollection.insertOne(user);
          res.json(result);
        }
      });
    });

    app.post("/login", async (req, res) => {
      const { name, email, password } = req.body;
      const query = { email: email };
      const userList = await userCollection.findOne(query);
      const data = {
        firstName: userList.firstName,
        lastName: userList.lastName,
        email: userList.email,
        id: userList._id,
        role: userList.role,
      };
      bcrypt.compare(password, userList.password, function (err, result) {
        if (result === true) {
          res.status(200).json(data);
        } else {
          res.status(401).json("Invalid login id or password");
        }
      });
    });

    // set user role
    app.put("/userRole", async (req, res) => {
      const user = req.body;
      console.log("user", user);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: user?.role } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // get all user
    app.get("/user", async (req, res) => {
      const cursor = userCollection.find({});
      const user = await cursor.toArray();
      res.send(user);
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
    app.put("/product", async (req, res) => {
      const product = req.body;
      const filter = { _id: product?._id };
      const updateDoc = { $set: product };
      const options = { upsert: true };
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
