const express = require('express');

require('dotenv').config();
const PORT = process.env.PORT || 2000;
const {Pool} = require('pg');
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');

const pool = new Pool({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT || 2000,
    max: 20, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established


});
//set template engine
const app = express();
app.set("views",path.join(__dirname,'views') );
app.set("view engine", "ejs");

app.use(session({secret: "cats", resave: false, saveUninitialized: false}));
app.use(passport.session());
app.use(express.urlencoded({extended:false}));



//middleware


//routes
app.use('/',(req, res)=>{

    res.render("index");

});




//listening
app.listen(PORT, () => {

console.log(`Server is running on ${PORT}`);

})