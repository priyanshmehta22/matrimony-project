const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
//CREATING SCHEMAS
const userSchemaRegister = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: Number },
  age: { type: Number },
  religion: { type: String },
  salary: { type: Number },
  state: { type: String },
  occupation: { type: String },
  gender: { type: String },
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
  gender: { type: String },
});

const resultSchema = new mongoose.Schema({
  mother_tongue: { type: String },
  permanent_state: { type: String },
  gender: { type: String },
  occupation: { type: String },
});

const MatchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dataset" }],
});

userSchemaRegister.plugin(passportLocalMongoose);
const userModel = mongoose.model("User", userSchemaRegister);
const preferencesModel = mongoose.model("Preference", userSchemaPreferences);
const resultModel = mongoose.model("Dataset", resultSchema);
const MatchesModel = mongoose.model("Output", MatchSchema);

module.exports = { userModel, preferencesModel, resultModel, MatchesModel };
