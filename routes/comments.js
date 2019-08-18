var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var comment = require("../models/comment");
var middleware = require("../middleware");

//==========================
// COMMENTS ROUTES
//==========================

//CREATE NEW COMMENT
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res){
    campground.findById(req.params.id, function(err,campground){
        if (err){
            console.log(err);
        }else
            res.render("comments/new",{campground: campground});
    }); 
});

//POST NEW COMMENT
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
    campground.findById(req.params.id, function(err,campground){
        if (err){
            res.redirect("/campgrounds");
        }else
        comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            }else{ 
            // Aqui se agrega usuario y id al comentario
            comment.author.id = req.user._id;  //comment author .id viene del modelo de comment
            comment.author.username = req.user.username;
            //Para guardar comentario
            comment.save();
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campgrounds/"+ campground._id);
            } 
        });
    });
});



// EDIT comment 

router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
   comment.findById(req.params.comment_id, function(err, foundComment){
       if (err){
           res.redirect("back");
       }else {
           res.render("comments/edit", {campground_id: req.params.id, comment:foundComment}); 
       }
   });
   
});

//UPDATE comment

router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req,res){
   comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if (err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});


//DELETE comment
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req,res){
   comment.findByIdAndRemove(req.params.comment_id, function (err){
       if (err){
           res.redirect("back");
       }else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});



module.exports = router;