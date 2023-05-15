const express = require ('express')
const cors = require ('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_username}:${process.env.DB_password}@cluster0.cgd8j5r.mongodb.net/?retryWrites=true&w=majority`;

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

    const newCoffeeCollection = client.db('coffeeDB').collection('coffee')

    //data read
    app.get('/coffee', async (req, res)=>{
      const cursor = newCoffeeCollection.find();
      const result = await cursor.toArray()
      res.send(result);
    })

    //update coffee
    app.get('/coffee/:id', async (req, res)=>{
       const id = req.params.id;
       const query ={_id: new ObjectId(id)}
       const result = await newCoffeeCollection.findOne(query)
       res.send(result);
    })


    app.put('/coffee/:id', async (req, res)=>{
       const id = req.params.id;
       const filter = {_id: new ObjectId(id)};
       const options = { upsert: true };
       const updateCoffee = req.body;
       const coffee ={
        $set:{
          name:updateCoffee.name, 
          supplier: updateCoffee.supplier, 
          teste: updateCoffee.teste, 
          categories: updateCoffee.categories, 
          detail:updateCoffee.detail, 
          photo: updateCoffee.photo, 
          quantity: updateCoffee.quantity
        }
       }
      const result = await newCoffeeCollection.updateOne(filter, coffee, options)
      res.send(result)
    })



    //get data from client side
    app.post('/coffee', async (req, res)=>{
      const newCoffee = req.body
      console.log(newCoffee);
      const result = await newCoffeeCollection.insertOne(newCoffee)
      res.send(result)
    })



    
    //delete data from database
    app.delete('/coffee/:id', async (req, res)=>{
       const id = req.params.id;
       const query = {_id: new ObjectId(id)}
       const result = await newCoffeeCollection.deleteOne(query)
       res.send(result)
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




app.get('/', (req, res)=>{
    res.send('coffee hut is running')
})


app.listen(port, ()=>{
    console.log(`coffee hut server is running: ${port}`)
})