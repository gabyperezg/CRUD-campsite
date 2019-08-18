var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


// HOME PAGE route
router.get("/", function(req,res){
   res.render("home");
});

//================
//PASSPORT ROUTES FOR AUTHENTICATION
//================

//SHOW REGISTER FORM
router.get("/register", function(req,res){
    res.render("register");
});

//HANDLE SIGN UP LOGIC
router.post("/register", function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if (err){                  
           req.flash("error",err);
           return res.render ("register");
       } 
       passport.authenticate("local")(req, res, function (){
          req.flash("success","Welcome to YelpCamp " + user.username);
          res.redirect("/campgrounds"); 
       });
    });
    
});

//LOGIN ROUTES

//show login form
router.get("/login", function(req,res){
    res.render("login");
});

//HANDLE LOGIN LOGIC
// app.post("/login", middleware,callbackfunction)
router.post("/login", passport.authenticate //metodo de passport para buscar usuario en base de datos
        ("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req,res){
        
    });

//LOGOUT ROUTE

router.get("/logout", function(req,res){
   req.logout(); //metodo de passport 
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});

//verificar si usuario esta logeado con la funcion isLoggedIn

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next(); //corre siguiente codigo si el usuario esta autenticado
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login"); //redireccionamiento en caso de no estar loggeado
}

module.exports = router;