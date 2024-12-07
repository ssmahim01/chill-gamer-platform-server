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
    // await client.connect();

    const reviewCollection = client.db("reviewsDB").collection("reviews");
    const watchListCollection = client.db("watchListsDB").collection("watchLists");

    // Database of Reviews

    app.get("/reviews", async(req, res) => {
      const {email, sortBy, genres} = req.query;
      // console.log(sortBy);
      const filter = email ? {email} : {};
      const genresFilter = genres ? {genres} : {};

      let sortedItems = {};
      
      if(sortBy == "rating"){
       sortedItems = {rating:1};
      };

      if(sortBy == "publishingYear"){
        sortedItems = {publishingYear:-1};
      };

      // console.log(sortedItems);
      const result = await reviewCollection.find(filter || genresFilter).sort(sortedItems).toArray();
      res.send(result);
    });

    app.get("/genres", async(req, res) => {
      const genresResult = await reviewCollection.find().toArray();
     res.send(genresResult);
    });

    app.get("/reviews/highest-rated", async(req, res) => {
      const result = await reviewCollection.find({}).sort({rating: -1}).limit(6).toArray();
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

    app.patch("/reviews/:id", async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateInfo = req.body;

      const reviewUpdate = {
        $set: {
          gameCover: updateInfo.gameCover,
          gameTitle: updateInfo.gameTitle,
          reviewDescription: updateInfo.reviewDescription,
          rating: updateInfo.rating,
          publishingYear: updateInfo.publishingYear,
          genres: updateInfo.genres,
          email: updateInfo.email,
          name: updateInfo.name,
          photo: updateInfo.photo,
        }
      };

      const updateResult = await reviewCollection.updateOne(filter, reviewUpdate);

      res.send(updateResult);
    });

    app.delete("/reviews/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const deleteResult = await reviewCollection.deleteOne(query);
      res.send(deleteResult);
    });

    // Database of WatchList

    app.get("/watchLists", async(req, res) => {
      const {email} = req.query;
      const watchListFilter = email ? {userEmail:email} : {};
      const result = await watchListCollection.find(watchListFilter).toArray();
      res.send(result);
    });

    app.get("/watchLists/:id", async(req, res) => {
      const id = req.params.id;
      const watchListId = {_id: new ObjectId(id)};
      const findResult = await watchListCollection.findOne(watchListId);
      res.send(findResult);
    });

    app.post("/watchLists", async(req, res) => {
      const addWatchList = req.body;
      const result = await watchListCollection.insertOne(addWatchList);
      res.send(result);
    });

    app.delete("/watchLists/:id", async(req, res) => {
      const id = req.params.id;
      const watchListQuery = {_id: new ObjectId(id)};
      const deleteResult = await watchListCollection.deleteOne(watchListQuery);
      res.send(deleteResult);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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