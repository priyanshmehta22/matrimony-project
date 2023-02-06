//IMPORTING PACKAGES
const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const ejs=require('ejs');
const _=require('lodash');
require('dotenv').config()

//SETTING UP EXPRESS
const app=express();
app.set('view engine','ejs');
mongoose.set('strictQuery', true);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


//CONNECTING TO MONGODB
// mongoose.connect(process.env.MONGO_URI);
mongoose.connect("localhost:27017/matrimony",{useNewUrlParser:true,useUnifiedTopology:true});

//CREATING SCHEMAS
const userDetailsSchema=new mongoose.Schema({
    name:String,
    age:{type: Number, min: 18, max: 100},
    gender:String,
    email:String,
    password:String,
    city:String,
    country:String,
});


//CREATING MODELS
const userDetailsModel=mongoose.model("userDetail",userDetailsSchema);



//GET REQUESTS
app.get("/",(req,res)=>{
    res.render("homepage");
}
);



//SERVER LISTEN
app.listen(3000 || process.env.PORT,()=>{
    console.log("server started");
}
);
