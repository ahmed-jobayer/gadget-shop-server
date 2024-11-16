const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken")

const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors({
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
}));
app.use(express.json());

// token varification
const verifyJWT = (req, res, next) => {
    co
}

// mongodb

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oapnwos.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(url, {
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

const userCollection = client.db('gadgetShop').collection("users")
const productCollection = client.db('gadgetShop').collection("products")

const dbConnect = async () => {
    try {
        client.connect();
        console.log("Database connected successfully")

        // get user 

        app.get('/user/:email', async ( req, res) => {
            const email = req.params.email;
            const query = {email: email}
            const user = await userCollection.findOne(query)
            res.send(user)
        })

        // insert user 
        
        app.post("/users", async(req, res) => {
            const user = req.body;
            const query = {email : user.email}
            const existingUser = await userCollection.findOne(query)

            if (existingUser) {
                return res.send({message: "User already exists"})
            }

            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        // add product

        app.post('/add-products', async(req, res) => {
            const product = req.body
            const result = await productCollection.insertOne(product)
            res.send(result)
        })


    } catch (error) {
        console.log(error.name, error.message)
    }
}

dbConnect()

// api

app.get("/", (req, res) => {
  res.send("server is running");
});

// jwt

app.post('/authentication', async(req, res)=> {
    const userEmail = req.body
    const token = jwt.sign(userEmail, process.env.ACCESS_KEY_TOKEN, {expiresIn:'10d'});
    res.send({token})
})










app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
