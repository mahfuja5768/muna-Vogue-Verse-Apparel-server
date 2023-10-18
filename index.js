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
  
      const brandCollection = client.db("Vogue-Verse-Apparel-store").collection("brands");
  
      app.get("/brands", async (req, res) => {
        const result = await brandCollection.find().toArray();
        res.send(result);
      });


    } finally {
      // await client.close();
    }
  }
  run().catch(console.log);
  
  app.get("/", (req, res) => {
    res.send("Coffee making server is running....");
  });
  
  app.listen(port, () => {
    console.log(`Coffee making Server is running on ${port}`);
  });