//IMPORTING PACKAGES
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const _ = require('lodash');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config()


const app = express();
app.set('view engine', 'ejs');
mongoose.set('strictQuery', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });



//CREATING SCHEMAS
const userSchemaRegister = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    phone: { type: Number },
    age: { type: Number },
    religion: { type: String },
    salary: { type: Number },
    state: { type: String },
    occupation: { type: String },
    gender: { type: String }
});

const userSchemaPreferences = new mongoose.Schema({
    member_id: { type: String },
    height: { type: Number },
    age: { type: Number },
    languages: { type: String },
    disabilities: { type: String },
    highestEducation: { type: String },
    income: { type: String },
    permanent_state: { type: String },
    employed: { type: String },
    occupation: { type: String },
    maritalStatus: { type: String },
    gender: { type: String }
});

const resultSchema = new mongoose.Schema({
    mother_tongue: { type: String },
    permanent_state: { type: String },
    gender: { type: String },
    occupation: { type: String }
});

const MatchSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dataset' }]
});

userSchemaPreferences.plugin(passportLocalMongoose);
const userModel = mongoose.model("User", userSchemaRegister);
const preferencesModel = mongoose.model("Preference", userSchemaPreferences);
const resultModel = mongoose.model("Dataset", resultSchema);
const MatchesModel = mongoose.model("Output", MatchSchema);

passport.use(preferencesModel.createStrategy());
passport.use(new LocalStrategy(preferencesModel.authenticate()));



passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


//GET REQUESTS

app.get("/", (req, res) => {

    res.render("preferences");

});
app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/homepage", function (req, res) {
    res.render("homepage")
});

app.get("/preferences", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("preferences")
    }
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

app.post("/preferences", async (req, res) => {
    const preferences = new preferencesModel({
        income: req.body.income,
        languages: req.body.languages,
        highestEducation: req.body.highestEducation,
        permanent_state: req.body.state,
        disabilities: req.body.disabilities,
        employmentStatus: req.body.employmentStatus,
        gender: req.body.gridRadios,
        occupation: req.body.occupation,
        maritalStatus: req.body.maritalStatus,
        height: req.body.height,
        age: req.body.age,
    });
    preferences.save();
    console.log(preferences);
    console.log("Finding People...");
    resultModel.find({
        mother_tongue: preferences.languages,
        permanent_state: preferences.permanent_state,
        gender: preferences.gender,
        occupation: preferences.occupation
    }
        , function (err, foundUser) {
            if (err) {
                console.log(err);
            } else {
                if (foundUser) {
                    const matchIds = [];
                    for (var i = 0; i < foundUser.length; i++) {
                        console.log(foundUser[i]);
                        matchIds.push(foundUser[i]._id);
                        console.log(" ");
                    }
                    const matches = new MatchesModel({
                        userId: mongoose.Types.ObjectId("641f3ff6d83138b4ac26503f"),
                        matches: matchIds
                    });
                    matches.save();
                    console.log("done");
                }
            }

            res.redirect("/visu");
        });
});

app.get("/visu", async (req, res) => {
    const matches = await MatchesModel.find({}).populate(['matches', 'userId']).lean()
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(matches, null, 4));
    console.dir(matches, { depth: null });


})




//SERVER LISTEN
app.listen(3000 || process.env.PORT, () => {
    console.log("server started");
});
