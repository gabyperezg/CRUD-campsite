var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride= require("method-override");
var campground = require("./models/campground");
var comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var flash = require("connect-flash");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//seedDB();  //seed database

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// conectarse a base de datos
mongoose.connect("mongodb://localhost/yelp_camp_v11", {useNewUrlParser: true});

//use CSS stylesheet
app.use(express.static(__dirname + "/public"));

//use method override for edit route
app.use(methodOverride("_method"));

// execute flash
app.use(flash());

//======================
//      AUTHENTICATION
//======================

//passport configuration
app.use(require("express-session")({
    secret: "Secreto",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//para verificar informacion del usuario  y pasar currentUser en todas las rutas de la aplicacion

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); //importante para que el codigo de la ruta siga corriendo
});


///para usar los archivos de las rutas generadas en el archivo de routes

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);


// Server listen
let PORT = process.env.PORT || 8000
app.listen(PORT, () =>{
    console.log(`Yelp Camp started in port ${PORT}`)
})

