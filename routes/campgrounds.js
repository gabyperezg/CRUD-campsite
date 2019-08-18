var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var middleware = require("../middleware");

//======================
//  CAMPGROUNDS ROUTES
//======================

// INDEX --> All campgrounds route
router.get("/campgrounds", function(req,res){
    // req.user para solicitar informacion de usuario
    //console.log(req.user);
    
   //Get all campgrounds from DB
   campground.find({}, function (err, allcampgrounds){
     if(err){
            console.log(err);
        }else {
        res.render("campgrounds/index", {campgrounds:allcampgrounds});
        }  
   });
   
});

// NEW --> Add new campground route
router.post("/campgrounds", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var des = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCamp = {name: name,price: price, image: image, description: des, author: author};
    //campgrounds.push(newCamp);
//CREATE--> new campground and save to DB
    campground.create(newCamp, function(err, newcreated){
        if(err){
            console.log(err);
        }else {
        // redirect back to campgrounds page
    res.redirect("/campgrounds");
        } 
    });

});

//Form to add new campground
router.get("/campgrounds/new",middleware.isLoggedIn, function(req,res){
   res.render("campgrounds/new");
});

//SHOW --> Route for the show page of each camp site
router.get("/campgrounds/:id", function(req,res){
    //find campground whith obtained id
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
            console.log(err);
        }else {
         //render back to campground id show page
            //console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }   
    });
});



//EDIT campground route
router.get("/campgrounds/:id/edit",middleware.checkOwnership, function(req,res){
     campground.findById(req.params.id, function(err,foundCampground){
         if(err){
         console.log(err);
         }
     res.render("campgrounds/edit", {campground:foundCampground}); 
    });
});


//UPDATE route for edited camground
router.put("/campgrounds/:id", middleware.checkOwnership, function (req,res){
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if (err){
           res.redirect("/campgrounds");
       } else
    res.redirect("/campgrounds/" + req.params.id);
        
    });
    
});

//DELETE campground route- needs method override
router.delete("/campgrounds/:id", middleware.checkOwnership, function(req,res){
    campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
           res.redirect("/campgrounds");
       } else{
       res.redirect("/campgrounds");
       }
    });
});


//middleware-- verificar si usuario esta logeado con la funcion isLoggedIn

//function isLoggedIn(req, res, next){
  //  if(req.isAuthenticated()){
    //    return next(); //corre siguiente codigo si el usuario esta autenticado
//    }
  //  res.redirect("/login"); //redireccionamiento en caso de no estar loggeado
//}


module.exports = router;