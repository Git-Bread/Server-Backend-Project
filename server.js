//-------------------------------------------------- IMPORTS AND SETUP ------------------------------------------------------//
import validate, * as validator from "./validator.js";

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

//hashing
import { hash } from "bcrypt";

//JWT
import jwt from "jsonwebtoken";
const { sign } = jwt;

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

const menuSchema = Schema({
    image: String,
    name: String,
    price: Number,
    allergies: Array
});


//hashes password before adding it
loginSchema.pre('validate', async function(next){
    let pass = this.password;
    this.password = await hash(pass, 10); 
    next()
})

//model
const login = model("login", loginSchema);
const menu = model("menu", menuSchema);

//-------------------------------------------------- Operations ------------------------------------------------------//

//register acount
app.post("/register", async (req, res) => {
    //Error handling
    try {
        let val = await validator.default(req, 2, login)
        if(val != "") {
            res.status(400).send({error: val});
            return;
        } 
    } catch (error) {
        res.status(400).send({error: error});
        return;
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

//Login
app.post("/login", async (req, res) => {
    //validate for input errors
    try {
        let val = await validator.default(req, 1, login)
        if (val != "") {
            res.status(400).send({error: val});
            return
        }
    } catch (error) {
        res.status(400).send({error: error});
    }

    //checks for correct information and returns auth token
    let val = await validator.loginValidation(req, login);
    if (val) {
        const payload = {username: req.username};
        const token = sign(payload, process.env.STANDARD_TOKEN, {expiresIn: '2h' })
        console.log(token);
        res.status(200).send({message: "Confirmed Login", token: token});
    }
    else {
        res.status(400).send({error: ["Wrong password please try again"]});
    }
})

app.post("/adminLoginPage", async (req, res) => {
    //validate for input errors
    if (req.body.username != process.env.ADMIN_NAME && req.body.password != process.env.ADMIN_PASSWORD) {
        res.status(400).send({error: "invalid username or password, try again and contact your supervisor if issue persist"})
    }
    const payload = {username: req.username};
    const token = sign(payload, process.env.STANDARD_TOKEN, {expiresIn: '20m' })
    console.log(token);
    res.status(200).send({message: "Confirmed Login", token: token});
})

app.post("/uploadMenuItem", async (req, res) => {
    let newItem = new menu({
        image: req.body.image,
        name: req.body.name,
        price: req.body.price,
        allergies: req.body.allergies
    });  
    /*  VALIDATION NEEDED
    if (validator) {
        
    }
    */
   newItem.save();
})

