//IMPORTING PACKAGES
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
const session = require("express-session");
const passport = require("passport");

const {
    userModel,
    preferencesModel,
    resultModel,
    MatchesModel,
} = require("./schemas.js");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
mongoose.set("strictQuery", true);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

passport.use(userModel.createStrategy());
// passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

//GET REQUESTS

app.get("/", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get("/graph", (req, res) => {
    res.render("graph");
});

app.get("/homepage", function (req, res) {
    console.log(req.user);
    res.render("homepage");
});

app.get("/preferences", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("preferences");
    } else {
        console.log("ERROR");
    }
});

app.post("/", async (req, res) => {
    passport.authenticate("local")(req, res, (err, user) => {
        res.redirect("/preferences");
    });
});

//POST REQUESTS
app.post("/signup", async (req, res) => {
    const user = new userModel({
        username: req.body.email,
        name: req.body.name,
        gender: req.body.gender,
        religion: req.body.religion,
        occupation: req.body.occupation,
        salary: req.body.salary,
        state: req.body.state,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
    });
    const users = await userModel.register(user, req.body.password);
    console.log("User Registered");
    res.redirect("/preferences");
});

app.post("/", (req, res) => {
    userModel.findOne({ email: req.body.Email }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === req.body.Password) {
                    res.render("homepage");
                } else {
                    res.redirect("/");
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
    resultModel.find(
        {
            mother_tongue: preferences.languages,
            permanent_state: preferences.permanent_state,
            gender: preferences.gender,
            occupation: preferences.occupation,
        },
        function (err, foundUser) {
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
                    const { _id: userId } = req.user;
                    const matches = new MatchesModel({
                        userId: userId,
                        matches: matchIds,
                    });
                    matches.save();
                    console.log("done");
                }
            }
            res.redirect("/visu");
        }
    );
});

app.get("/visu", async (req, res) => {
    const matches = await MatchesModel.find({})
        .populate(["matches", "userId"])
        .lean();
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(matches, null, 4));
    console.dir(matches, { depth: null });
});

app.get("/graph-data", async (req, res) => {
    const matches = await MatchesModel.find({}).lean();
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(matches, null, 4));
});

app.get("/user/graph-data", async (req, res) => {
    console.log(req.user);
    const userId = req.user?._id;
    const matches = await MatchesModel.find({ userId: userId }).lean();
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(matches, null, 4));
});

//SERVER LISTEN
app.listen(3000 || process.env.PORT, () => {
    console.log("server started");
});
