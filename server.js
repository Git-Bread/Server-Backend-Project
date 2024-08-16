//-------------------------------------------------- IMPORTS AND SETUP ------------------------------------------------------//
//express imports to facilitate the webbapp
const express = require("express");
const app = express();
app.use(express.json());

//mongo db and dotenv stuff
require("dotenv").config({path: "values.env"});

//opens to cross origin
const cors = require("cors");
app.use(cors());

//hashing
const bcrypt = require("bcrypt");
const salt = bcrypt.genSalt(10);

//JWT
const jwt = require("jsonwebtoken");

//prefered port or 27017
const port = process.env.port | 27017;

//database connection
const url = process.env.DB_HOST + ":" + port + "/DatabasProject";

//listening check
let apiPort = 3000;
app.listen(apiPort, () => {console.log("listening")});

//-------------------------------------------------- MONGODB ------------------------------------------------------//

//mongoose for schema and stuff
const mongoose = require("mongoose");
mongoose
    .connect(url)
    .then(() => {console.log("connected!")})
    .catch((error) => console.log("ERROR: " + error));

//schema
const loginSchema = mongoose.Schema({
    username: String,  //email
    password: String,
    name: String
});

//hashes password before adding it
loginSchema.pre('save', async function(next){
    this.password = bcrypt.hash(this.password, salt); 
    console.log(bcrypt.hash(this.password, salt));
    next()
})

//model
const login = mongoose.model("login", loginSchema);