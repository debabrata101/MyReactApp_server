const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://debabratacmt:6hSKLrkyYr2aRUL5@cluster0.kegnvjv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const productDB = client.db("productDB");
    const user_DB = client.db("user_DB");
    const shoesCollection = productDB.collection("shoesCollection");
    const userCollection = user_DB.collection("userCollection");
    // product....>
    app.post("/shoes", async (req, res) => {
      const shoeData = req.body;
      const result = await shoesCollection.insertOne(shoeData);
      res.send(result);
    });
    app.get("/shoes", async (req, res) => {
      const shoesData = shoesCollection.find();
      const result = await shoesData.toArray();
      res.send(result);
    });
    app.get("/shoes/:id", async (req, res) => {
      const id = req.params.id;
      const shoesData = await shoesCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(shoesData);
    });
    app.patch("/shoes/:id", async (req, res) => {
      const id = req.params.id;
      const upData = req.body;
      const shoesData = await shoesCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: upData,
        }
      );
      res.send(shoesData);
    });
    app.delete("/shoes/:id", async (req, res) => {
      const id = req.params.id;
      const shoesData = await shoesCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(shoesData);
    });

    //user------------>
    app.post("/user", async (req, res) => {
      const user = req.body;

      const isUserExist = await userCollection.findOne({ email: user?.email });
      if (isUserExist?._id) {
        return res.send({
          status: "success",
          message: "Login success",
        });
      }
      const result = await userCollection.insertOne(user);

      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;

      const result = await userCollection.findOne({ email });
      res.send(result);
    });

    console.log(" Database connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Route is Working");
});

app.listen(port, (req, res) => {
  console.log("App is listening on port :", port);
});
