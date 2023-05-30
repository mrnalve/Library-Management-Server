const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000
require('dotenv').config()
// middleware
app.use(cors())
app.use(express.json())

// mongodb code

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://libraryManagement:QVeDoWxNKkel8Leu@cluster0.c9irx2a.mongodb.net/?retryWrites=true&w=majority`;

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


        const bookCollection = client.db("booksDb").collection("book");
        const borrowedCollection = client.db("booksDb").collection("borrowed");
        // post book data 
        app.post('/addBook', async (req, res) => {
            const bookCard = req.body
            const result = await bookCollection.insertOne(bookCard)
            res.send(result)
        })
        // post borrowed data 
        app.post('/borrowed', async (req, res) => {
            const borrowedCard = req.body
            const result = await borrowedCollection.insertOne(borrowedCard)
            res.send(result)
        })
        // get all menu data
        app.get('/addBook', async (req, res) => {
            const result = await bookCollection.find().toArray();
            res.send(result)
        })
        // get all menu data
        app.get('/borrowed', async (req, res) => {
            const result = await borrowedCollection.find({ email: req.query.email }).toArray();
            res.send(result)
        })
        // get single data 
        app.get('/addBook/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await bookCollection.find(query).toArray()
            res.send(result)
        })
        // Update book quantity
        app.put('/borrowed/:id', async (req, res) => {
            const bookId = req.params.id;
            const filter = { _id: new ObjectId(bookId) }
            const { bookQuantity } = req.body;
            console.log(bookQuantity);
            // Update the book quantity
            const result = await bookCollection.updateOne(filter,
                { $set: { bookQuantity } }
            );
            res.send(result);
        });



        // DELETE request to return borrowed book
        app.delete('/borrowed/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await borrowedCollection.deleteOne(query)
            res.send(result)
        });
        // DELETE request to delete added books
        app.delete('/addBook/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bookCollection.deleteOne(query)
            res.send(result)
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



app.get('/', (req, res) => {
    res.send('Library Management Running')
})

app.listen(port, () => {
    console.log(`Library Management running on the port ${port}`);
})