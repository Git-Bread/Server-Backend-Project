//-------------------------------------------------- IMPORTS AND SETUP ------------------------------------------------------//
//import { auth } from "./auth";
import validator from "./validator.js";

//express imports to facilitate the webbapp
import express, { json } from "express";
const app = express();
app.use(json());

//mongo db and dotenv stuff
import dotenv from "dotenv";
dotenv.config({path: "values.env"});

//opens to cross origin
import cors from "cors";
app.use(cors());

//prefered port or 27017
const port = process.env.port | 27017;

//database connection
const url = process.env.DB_HOST + ":" + port + "/DatabasProject";

//listening check
let apiPort = 3000;
app.listen(apiPort, () => {console.log("listening")});

//-------------------------------------------------- MONGODB ------------------------------------------------------//

//mongoose for schema and stuff
import { connect, Schema, model } from "mongoose";
connect(url)
    .then(() => {console.log("connected!")})
    .catch((error) => console.log("ERROR: " + error));

//schema
const loginSchema = Schema({
    username: String,  //email
    password: String,
    name: String,
    number: Number,
    booked: Object
});

//model
const login = model("login", loginSchema);

//-------------------------------------------------- Hashing/JWT ------------------------------------------------------//
/*
//hashing
import { genSalt, hash } from "bcrypt";
const salt = genSalt(10);

//JWT
import jwt from "jsonwebtoken";

//hashes password before adding it
loginSchema.pre('save', async function(next){
    this.password = hash(this.password, salt); 
    console.log(hash(this.password, salt));
    next()
})
*/
//-------------------------------------------------- Operations ------------------------------------------------------//

//register acount
app.post("/register", async (req, res) => {
    //Error handling
    try {
        let val = await validator(req, 2, login)
        if(val != "") {
            res.status(400).send({error: val});
            return;
        } 
    } catch (error) {
        res.status(400).send({error: error});
    }

    let newUser = new login({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        number: req.body.number,
        booked: false
    });  
    
    newUser.save();
    res.status(200).send({message: "Account registered"});
})

