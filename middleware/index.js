//all middleware is here 

var campground = require("../models/campground");
var comment = require("../models/comment");
var middlewareObject = {};

middlewareObject.checkOwnership= function(req, res, next){
     if(req.isAuthenticated()){
                campground.findById(req.params.id, function(err,foundCampground){
               if (err){
                   req.flash("error","OOPS!! Campground not found");
                   res.redirect("/campgrounds");
               } else {
                 // does user own campground?
                     if (foundCampground.author.id.equals(req.user._id)) {
                       next(); 
                   }else{
                       req.flash("error","You cant do that, you do not own this Campground!!");
                       res.redirect("back");
                   }
               }
            }); 
        }else {
            req.flash("error","You have to Log In First!!");
            res.redirect("back");
        }
};


middlewareObject.checkCommentOwnership = function(req, res, next){
     if(req.isAuthenticated()){
                comment.findById(req.params.comment_id, function(err,foundComment){
               if (err){
                   res.redirect("back");
               } else {
                 // does user own comment?
                   if (foundComment.author.id.equals(req.user._id)) {
                       next(); 
                   }else{
                       req.flash("error","You cant do that, you do not own this comment!!");
                       res.redirect("back");
                   }
               }
                      
            }); 
        }else{
            req.flash("error","You have to Log In First!!");
            res.redirect("back");
        }
};


middlewareObject.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next(); //corre siguiente codigo si el usuario esta autenticado
    }
    req.flash("error","You have to Log In First!!");
    res.redirect("/login"); //redireccionamiento en caso de no estar loggeado
};

module.exports = middlewareObject;
