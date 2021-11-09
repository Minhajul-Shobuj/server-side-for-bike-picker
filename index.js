const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2qgak.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        client.connect();
        const database = client.db('online_shop');
        const productCollection = database.collection('products');

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        })
    }
    finally {
        // client();
    }
};
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('assignment 12 server')
});
app.listen(port, (req, res) => {
    console.log(`listening to port https//localhost:${port}`)
});