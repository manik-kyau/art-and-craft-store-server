const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jm3t3oc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // const database = client.db("sample_mflix");
    const craftCollection = client.db("craftsDB").collection("crafts");
    const userCollection = client.db("usersDB").collection("users");

    // get craft data
    app.get('/crafts',async(req,res)=>{
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // post craft
    app.post('/crafts',async(req,res)=>{
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result)
    })

    // read data for My Craft list
    app.get("/myArtAndCraft/:userEmail",async(req,res)=>{
      console.log(req.params.email);
      // const userEmail = req.params.email;
      const result = await craftCollection.find({email:req.params.email}).toArray();
      res.send(result)
    })

    // Update craft data
    app.get("/singleCraft/:id",async(req,res)=>{
      const result = await craftCollection.findOne({_id: new ObjectId(req.params.id)})
      console.log("fokira website",result);
      res.send(result);
    })

    app.put("/updateCraft/:id",async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const inputData = req.body;
      const updateCraft = {
        $set: {
          itemName:inputData.itemName,
          subName:inputData.subName,
          photo:inputData.photo,
          description:inputData.description,
          price:inputData.price,
          rating:inputData.rating,
          time:inputData.time,
          stockstatus:inputData.stockstatus,
          customization:inputData.customization,
        },
      };
      const result = await craftCollection.updateOne(filter, updateCraft, options);
      console.log(result);
      res.send(result);
    })

     // delete craft
     app.delete('/crafts/:id',async(req,res)=>{
      const id =req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })


    // User related API
    app.post('/users',async(req,res)=>{
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send("Art and Craft Store server is running.")
})

app.listen(port,()=>{
    console.log(`Art and Craft Store server running on port ${port}`);
})