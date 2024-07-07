import express from "express";
import path from "path";

import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017", {
    dbName: "backend"
})
.then(() => console.log("Database connecetd"))
.catch((e) => console.log(e));


const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
})

const msg = mongoose.model("Message",messageSchema)

const app = express();



app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("login");
})

app.get("/login", (req, res) => {
    res.cookie("token", "iamin");
    res.redirect("/");
})



app.post("/contact",async(req,res) => {
    
    await msg.create({ name: req.body.name, email: req.body.email})
    res.redirect("/success");
})



app.listen(5000, () => {
    console.log("Server is running");
})