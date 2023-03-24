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
// SETTING UP MONGOOSE
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });



//CREATING SCHEMAS
const userSchemaRegister = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    phone: { type: Number },
    age: { type: Number },
    religion: { type: String },
    
    occupation: { type: String },
    gender: { type: String }
});

const userSchemaPreferences = new mongoose.Schema({
    height: { type: Number },
    age: { type: Number },
    languages: { type: String },
    disabilities: { type: String },
    highestEducation: { type: String },
    income: { type: String },
    state: { type: String },
    employmentStatus: { type: String },
    occupation: { type: String },
    religion: { type: String },
    lookingForGender: { type: String }
});



const userModel = mongoose.model("User", userSchemaRegister);
const preferencesModel = mongoose.model("Preference", userSchemaPreferences);
const resultModel = mongoose.model("Dataset", userSchemaPreferences);



//GET REQUESTS

app.get("/", (req, res) => {
    res.render("login");

});
app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/homepage", function (req, res) {
    res.render("homepage")
});

app.get("/preferences", function (req, res) {
    res.render("preferences")
});


//POST REQUESTS
app.post("/signup", (req, res) => {

    const users = new userModel({
        name: req.body.Name,
        gender: req.body.Gender,
        religion: req.body.religion,
        occupation: req.body.occupation,
        salary: req.body.salary,
        state: req.body.state,
        email: req.body.Email,
        password: req.body.Password,
        phone: req.body.Phone,
        age: req.body.age
    });
    users.save();
    console.log(users.hobbies);
    console.log("User Registered");
    res.redirect("/homepage");
});



app.post("/", (req, res) => {
    userModel.findOne({ email: req.body.Email }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === req.body.Password) {
                    res.render("homepage");
                }
                else {
                    res.redirect("/")
                }
            }
        }
    });
});

app.post("/preferences", (req, res) => {

    const preferences = new preferencesModel({
        income: req.body.income,
        languages: req.body.languages,
        highestEducation: req.body.highestEducation,
        state: req.body.state,
        disabilities: req.body.disabilities,
        employmentStatus: req.body.employmentStatus,
        lookingForGender: req.body.gridRadios,
        occupation: req.body.occupation,
        religion: req.body.religion,
        height: req.body.height,
        age: req.body.age,
       
    });
    preferences.save();
    console.log(preferences);
    console.log("Finding People...");
    resultModel.find({
        $or: [
            { religion: preferences.religion },
            { occupation: preferences.occupation },
            { income: preferences.income },
            { state: preferences.state },
            { employmentStatus: preferences.employmentStatus },
            { lookingForGender: preferences.lookingForGender },
            { height: preferences.height },
            { age: preferences.age }
        ]
    }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                for (var i = 0; i < foundUser.length; i++) {
                    //export name to result.ejs
                    // res.render("result", { name: name });
                    console.log("NAME: " + foundUser[i].name);
                    console.log("AGE: " + foundUser[i].age);
                    console.log("RELIGION: " + foundUser[i].religion);
                    console.log("OCCUPATION: " + foundUser[i].occupation);
                    console.log("INCOME: " + foundUser[i].income);
                    console.log("STATE: " + foundUser[i].state);
                    console.log("EMPLOYMENT STATUS: " + foundUser[i].employmentStatus);
                    console.log(" ");
                    // console.log(foundUser.occupation);
                }
            }
        }
    });
});

//SERVER LISTEN
app.listen(3000 || process.env.PORT, () => {
    console.log("server started");
}
);
