//IMPORTING PACKAGES
const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const ejs=require('ejs');
const _=require('lodash');
const { min } = require('lodash');
require('dotenv').config()

//SETTING UP EXPRESS
const app=express();
app.set('view engine','ejs');
mongoose.set('strictQuery', true);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("styling"));


//CONNECTING TO MONGODB
mongoose.connect(process.env.MONGO_URI);

//CREATING SCHEMAS
const userDetailsSchema=new mongoose.Schema({
    name:String,
    age:{Number, min:18, max:100},
    gender:String,
    email:String,
    password:String,
    city:String,
    country:String,
});


//CREATING MODELS
const userDetailsModel=mongoose.model("userDetail",userDetailsSchema);

userDetailsModel.insertOne({'name':'Priyansh', age:19, 'gender':'male','email':'priyansh9571mehta@gmail.com','password':'123456','city':'Mumbai','country':'India'},
(err)=>{
    if(err){
        console.log(err);
    }
else{
    console.log("inserted");
 }});
//SERVER LISTEN
app.listen(3000 || process.env.PORT,()=>{
    console.log("server started");
}
);
