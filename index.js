const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middilewere
app.use(cors())
app.use(express.json())


// mongodb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0kobzro.mongodb.net/?retryWrites=true&w=majority`;

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
//     await client.connect();

const foodCollection = client.db('foodCollection').collection('food');
const availableFood = client.db('availableFood').collection('available');
const requestCollection = client.db('requestCollection').collection('request');

app.get('/request',async(req,res)=>{
  const cursor = requestCollection.find()
 const result =await cursor.toArray()
 res.send(result)
})


app.post('/request',async(req,res)=>{
  const request =req.body;
  const result =await requestCollection.insertOne(request)
  res.send(result)
})


app.get('/food',async (req,res)=>{
 const cursor = foodCollection.find()
 const result =await cursor.toArray()
 res.send(result)
})

app.get('/food/:id',async(req,res)=>{
  const id = req.params.id;
  const query ={_id : new ObjectId(id)}
  const options = {
    // Include only the `title` and `imdb` fields in the returned document
    projection: { name: 1, image: 1,quantity:1,location:1,date:1,notes:1},
  };
  const result =await foodCollection.findOne(query,options);
  res.send(result)
})


app.get('/available',async (req,res)=>{
  // Filter http://localhost:5000/available?foodName=Egg
  // sort http://localhost:5000/available?sortField=expiredDate&sortOrder=asc
let query ={}
let sort ={}
const foodName= req.query.foodName
const sortField = req.query.sortField
const sortOrder = req.query.sortOrder

if(foodName){
  query.foodName =foodName
}
if(sortField && sortOrder){
  sort [sortField] =sortOrder
}

const cursor = availableFood.find(query).sort(sort)
const result = await cursor.toArray()
res.send(result)
})

app.get('/available/:id',async(req,res)=>{
  const id = req.params.id ;
  const query ={_id : new ObjectId(id)};
  const options = {
    // Sort matched documents in descending order by rating
    // sort: { "imdb.rating": -1 },
    // Include only the `title` and `imdb` fields in the returned document
    projection: {foodName: 1, donerEmail :1,
  foodImage: 1,donatorName:1,donatorImage:1,foodQuantity:1,location:1,
  expiredDate:1,additionalNotes:1 },
  };
  const result = await availableFood.findOne(query,options)
  res.send(result)
})
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
 res.send('food forward is running')
})
app.listen(port,()=>{
 console.log(`food forward is running on port ${port}`);
})