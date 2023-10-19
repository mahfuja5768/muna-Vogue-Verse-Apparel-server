const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.mz3fw7v.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandCollection = client
      .db("Vogue-Verse-Apparel-store")
      .collection("brands");

    const brandProductCollection = client
      .db("Vogue-Verse-Apparel-store")
      .collection("brandsProduct");

    const myCartCollection = client
      .db("Vogue-Verse-Apparel-store")
      .collection("myCart");

    app.get("/brands", async (req, res) => {
      const result = await brandCollection.find().toArray();
      res.send(result);
    });

    app.get("/brandsProduct", async (req, res) => {
      const result = await brandProductCollection.find().toArray();
      res.send(result);
    });

    app.get("/brandsProduct/:brandName", async (req, res) => {
      const name = req.params.brandName;
      const query = { brandName: name };
      const result = await brandProductCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/brandsProduct", async (req, res) => {
      const result = await brandProductCollection.find().toArray();
      res.send(result);
    });

    app.get("/single-product", async (req, res) => {
      const result = await brandProductCollection.find().toArray();
      res.send(result);
    });

    app.get("/single-product/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await brandProductCollection.find(query).toArray();
      res.send(result);
    });

    app.put("/single-product/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      console.log(filter);
      const options = { upsert: true };
      const updatedProduct = req.body;

      const newProduct = {
        $set: {
          image: updatedProduct.image,
          brandName: updatedProduct.brandName,
          name: updatedProduct.name,
          type: updatedProduct.type,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
          description: updatedProduct.description,
        },
      };

      const result = await brandProductCollection.updateOne(
        filter,
        newProduct,
        options
      );
      res.send(result)
    });

    //create product

    app.post("/brandsProduct", async (req, res) => {
      const newProduct = req.body;
      const result = await brandProductCollection.insertOne(newProduct);
      res.send(result);
    });

    //add product to my cart

    app.post("/addProduct", async (req, res) => {
      const newAddedProduct = req.body;
      const result = await myCartCollection.insertOne(newAddedProduct);
      res.send(result);
    });

    app.get("/addProduct", async (req, res) => {
      const result = await myCartCollection.find().toArray();
      res.send(result);
    });

    app.get("/addProduct/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = await myCartCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/addProduct/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = await myCartCollection.deleteOne(query);
      res.send(result);
    });


  } finally {
    // await client.close();
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("server is running....");
});

app.listen(port, () => {
  console.log(` Server is running on ${port}`);
});
