const express = require('express');

require('dotenv').config();
const PORT = process.env.PORT || 2000;
const {Pool} = require('pg');
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const path = require('path');

//authentication
//strategy is a method for authenticating requests
passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = rows[0];
  
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch(err) {
        return done(err);
      }
    })
  );
  /////////////////////////////////////////////////////////
  //serializer
  //what user data will be stored in the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  //retrieves users info from the db
  passport.deserializeUser(async (id, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      const user = rows[0];
  
      done(null, user);
    } catch(err) {
      done(err);
    }
  });

  //sessions







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
app.use(express.urlencoded({extended:false}));//parses form encoded data to body to be used



//middleware


//routes
app.get('/',(req, res)=>{

    res.render("index", {user: req.user});

});

app.get("/sign-up", (req,res)=>{
    res.render("sign-up-form")
});

app.post("/sign-up", async(req, res, next)=>{

    try{
        await pool.query("INSERT INTO users(username, password) VALUES ($1, $2)",
        [req.body.username,req.body.password,]);
        res.redirect("/");

    }catch(err){

        return next(err);
    }
});
//log in
//looks for username and password then runs localStrategy
app.post(
    "/log-in",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/"
    })
  );

  app.get("/log-out", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });




//listening
app.listen(PORT, () => {

console.log(`Server is running on ${PORT}`);

})