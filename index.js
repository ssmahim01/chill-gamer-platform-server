require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4500;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Chill gamer server is running now");
});

app.listen(port, () => {
    console.log(`The Chill gamer server is running on ${port}`);
});