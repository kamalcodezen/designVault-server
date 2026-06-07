const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 8000
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const uri = process.env.MONGO_DB_URI;


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

        const db = client.db("designVault")
        const ideasCollection = db.collection("ideas")

        // all ideas data api
        app.get("/ideas", async (req, res) => {
            const result = await ideasCollection.find().toArray()
            res.json(result)
        })

        // ideas post (add-idea)
        app.post("/ideas", async (req, res) => {
            const ideasData = req.body
            const result = await ideasCollection.insertOne(ideasData);
            res.json(result)
        })

        // ideas details data id only one data read
        app.get("/ideas/:id", async (req, res) => {
            const { id } = req.params
            const result = await ideasCollection.findOne({ _id: new ObjectId(id) })
            res.json(result)
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




app.get("/", (req, res) => {
    res.send("designVault server is running fine~!")
})

app.listen(port, () => {
    console.log(`Server is running ${port}`)
})