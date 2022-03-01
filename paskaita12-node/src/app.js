const express = require("express")
const app = express()
// const cors = require('cors')
const mongoose = require('mongoose')
const session = require("express-session")
require('dotenv').config()


const server = require('http').createServer(app)
const {Server} = require("socket.io")


async function connectDatabase(){
    try{
        await mongoose.connect(process.env.MONGO_KEY)
    } catch (e) {
        return console.log(e)
    }
    console.log()
} connectDatabase()

// app.use(cors())
app.use(express.json())
app.listen(4000)
app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))



const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

server.listen(4001, () => {
    console.log("Sockets server listening on port " + 4001)
})

module.exports.ioObject = io





const router = require("../routes/main")
app.use("/", router)




