require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4500;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ybs8l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const reviewCollection = client.db("reviewsDB").collection("reviews");
    const watchListCollection = client.db("watchListsDB").collection("watchLists");

    app.get("/reviews", async(req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    app.get("/reviews/:id", async(req, res) => {
      const id = req.params.id;
      const newId = {_id: new ObjectId(id)};
      const result = await reviewCollection.findOne(newId);
      res.send(result);
    });

    app.post("/reviews", async(req, res) => {
      const addReview = req.body;
      const result = await reviewCollection.insertOne(addReview);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Chill gamer server is running now");
});

app.listen(port, () => {
    console.log(`The Chill gamer server is running on ${port}`);
});