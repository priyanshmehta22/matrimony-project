//IMPORTING PACKAGES
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const _ = require('lodash');
require('dotenv').config()

//SETTING UP EXPRESS
const app = express();
app.set('view engine', 'ejs');
mongoose.set('strictQuery', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//GET REQUESTS
app.get("/login", (req, res) => {
    res.render("login");
}
);

app.get("/",function(req,res){
    res.render("homepage")
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

//SERVER LISTEN
app.listen(3000 || process.env.PORT, () => {
    console.log("server started");
}
);
