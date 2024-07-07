// import express from "express";
// import path from "path";

// import mongoose from "mongoose";

// mongoose.connect("mongodb://localhost:27017", {
//     dbName: "backend"
// })
// .then(() => console.log("Database connecetd"))
// .catch((e) => console.log(e));


// const messageSchema = new mongoose.Schema({
//     name: String,
//     email: String,
// })

// const msg = mongoose.model("Message",messageSchema)

// const app = express();

// const users =[];

// app.use(express.static(path.join(path.resolve(), "public")));
// app.use(express.urlencoded({extended: true }));

// app.set("view engine", "ejs");

// app.get("/", (req, res) => {
//     res.render("index",{name: "nothing"});
// })

// app.get("/success", (req, res) => {
//     res.render("success");
// })

// app.post("/contact",async(req,res) => {
    
//     await msg.create({ name: req.body.name, email: req.body.email})
//     res.redirect("/success");
// })

// app.get("/users",(req, res) => {
//     res.json({
//         users
//     })
// })

// app.listen(5000, () => {
//     console.log("Server is running");
// })


//***************************************************************login logout************************************************************** */


import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

mongoose.connect("mongodb://localhost:27017", {
    dbName: "backend"
})
.then(() => console.log("Database connecetd"))
.catch((e) => console.log(e));


const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

const User = mongoose.model("User",UserSchema)

const app = express();



app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
    const {token} = req.cookies;

    if(token){
        const decoded = jwt.verify(token, "secret9957")
        console.log(decoded);

        req.user = await User.findById(decoded._id);
        next();
    }
    else{
    res.redirect("/login");
    }
};

app.get("/",isAuthenticated, (req, res,) => {
  res.render("logout",{name: req.user.name});
});

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/login",async (req, res) => {
    const {email, password} = req.body;
    let user = await User.findOne({email})

    if(!user){
        return res.redirect("/register");
    }

    const isMatch = user.password===password;
    if(!isMatch){
        return res.render("login",{message: "Incorrect password or email-ID"});
    }

    const token = jwt.sign({_id: user._id}, "secret9957")

    res.cookie("token", token,{
    httpOnly: true,
    expires: new Date(Date.now()+60*1000),
   });
   res.redirect("/");
})

app.post("/register", async(req, res) => {
   const {name,email,password} = req.body;

   let user = await User.findOne({email});
   if(user){
    return res.redirect("/login");
   }

    user = await User.create({
    name,
    email,
    password,
   });

   const token = jwt.sign({_id: user._id}, "secret9957")

    res.cookie("token", token,{
    httpOnly: true,
    expires: new Date(Date.now()+60*1000),
   });
   res.redirect("/");
})

app.get("/logout", (req, res) => {
    res.cookie("token", null,{
   
    expires: new Date(Date.now()),
   });
   res.redirect("/");
})











app.listen(5000, () => {
    console.log("Server is running");
})

