//-------------------------------------------------- IMPORTS AND SETUP ------------------------------------------------------//
import * as validator from "./validator.js";
import * as authorization from "./auth.js";

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
    name: String,
    description: String,
    price: Number,
    allergies: Array
});


//hashes password before adding it
loginSchema.pre('validate', async function(next){
    let pass = this.password;
    this.password = await hash(pass, process.env.STANDARD_TOKEN); 
    next()
})

//model
const login = model("login", loginSchema);
const menu = model("menu", menuSchema);

//-------------------------------------------------- Operations ------------------------------------------------------//

//User login functionaliy, Axed Content
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

//User login functionaliy, Axed Content
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
        res.status(200).send({message: "Confirmed Login", token: token});
    }
    else {
        res.status(400).send({error: "Wrong password please try again"});
    }
})

app.post("/managment/adminLoginPage", async (req, res) => {
    //validate for input errors
    if (req.body.username != process.env.ADMIN_NAME || req.body.password != process.env.ADMIN_PASSWORD) {
        res.status(401).send({error: "invalid username or password, try again and contact your supervisor if issue persist"})
        return
    }
    let auth = "admin";
    const payload = {access: auth};
    const token = sign(payload, process.env.STANDARD_TOKEN, {expiresIn: '2h' })
    res.status(200).send({message: "Confirmed Login", token: token});
    console.log("logged in successfully");
})

app.post("/management/adminCheck", async (req, res) => {
    let response = await authorization.adminAuth(req);
    if(response) {
        res.status(200).send(true);
        return true;
    }
    res.status(200).send(false);
    return false;
})

app.post("/managment/addMenuItem", async (req, res) => {
    let test = await validator.menuItemValidation(req);
    if (test != false) {
        res.status(400).send({error: test})
        return;
    }
    if (!req.body.allergies) {
        req.body.allergies = "no allergies";
    }
    let newItem = new menu({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        allergies: req.body.allergies
    });  

    console.log(newItem);
    newItem.save();
    res.status(201).send({information: "menuitem created"});
})

//todo
app.put("/managment/editMenuItem", async (req, res) => {
    let val = await validator.menuItemValidation(req);
    console.log(req.body);
    if (val != false) {
        res.status(400).send({error: val})
    }
    await menu.updateOne({_id: req.body.id},{name: req.body.name, description: req.body.description, price: req.body.price, allergies: req.body.allergies})
    res.json({message: "updated item"});   
})

//todo
app.delete("/managment/removeMenuItem", async (req, res) => {
    if (menu.size < 1) {
        console.log("no items found");
        return;
    }
    try {
        await menu.deleteOne({_id: req.body.id});   
        res.status(200).send({information: "deleted"});
    } catch (error) {
        res.status(400).send({error: "invalid json"});
    }
})

app.get("/menuItems", async (req, res) => {
    res.status(200).send(await menu.find());
})


