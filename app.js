//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;


mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true, useUnifiedTopology: true})

const userSchema = new mongoose.Schema ({
	email: String,
	password: String
});

//userSchema.plugin(encrypt, {secret: process.env.SECRET,encryptedFields: ['password'] });


const User = new mongoose.model("user",userSchema);

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res) {
	res.render("home");
});

app.get("/login", function(req,res) {
	res.render("login");
});

app.get("/register", function(req,res) {
	res.render("register");
});

app.post("/register", function(req,res) {
	
	bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      const newUser = new User({
				email: req.body.username,
				password: hash
			});
			newUser.save(function(err){
				if (err)
					console.log(err);
				else
					res.render("secrets");
			});
    });
	});
});

app.post("/login", function(req,res) {
	const username = req.body.username;
	const password = req.body.password;
	
	User.findOne({email: username}, function(err,foundUser){
		if(err)
			console.log(err);
		else {
			if (!foundUser)
				console.log(err);
			else {
				bcrypt.compare(password, foundUser.password, function(err, result) {
				if(result == true)
					res.render("secrets");
				else {
					console.log("Wrong password");
					res.render("login")
				}
				});
			}
		}
	});
});



app.listen(3000, function() {
  console.log("Server started successfully...");
});
