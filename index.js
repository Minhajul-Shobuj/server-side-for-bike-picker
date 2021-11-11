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
        const database = client.db('Bike_picker');
        const bikeCollection = database.collection('bikes');
        const orderCollection = database.collection('orders');
        const userCollection = database.collection('users');

        app.get('/bikes', async (req, res) => {
            const cursor = bikeCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        });
        app.get('/users/:email', async (req, res) => {
            const email=req.params.email;
            const query = {email: email};
            const user = await userCollection.findOne(query);
            let isAdmin= false;
            if(user?.role ==='admin'){
                isAdmin= true;
            }
            res.json({admin: isAdmin});
        });
        
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        });
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        });
        app.post('/users', async (req, res) => {
            const order = req.body;
            const result = await userCollection.insertOne(order);
            res.json(result)
        });
        app.put('/users/admin', async (req, res) => {
           const user= req.body;
           const filter= {email: user.email};
        const updateDoc= {$set: {role: 'admin'}};
        const result=await userCollection.updateOne(filter,updateDoc);
        res.json(result);
        });
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