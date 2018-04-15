var express = require('express');
var router = express.Router();
// require birdSchema
var Bird = require('../models/bird');
/* GET home page. */
//modify home page to find all bird documents and display them after sorting
router.get('/', function(req, res, next) {
  //query to fetch all documents, just get the name fields, sort by name
    //also get the description
    Bird.find().select({name:1,description:1}).sort({name:1})
        .then((birdDocs)=>{
          console.log('All birds', birdDocs);
          //use index view, update title, display birdDocs by updating birds place holder.
          res.render('index', {title:'All Birds', birds:birdDocs})
        }).catch((err)=>{
          next(err);
    })
});
//POST to rout /addBird to create new bird document
router.post('/addBird', function (req, res, next) {
    //use form data in req.body to create new Bird
    var bird=Bird(req.body);
    //modify to add nest information. forms don't nest data, so rearrange attributes to match the schema
    bird.nest={
        location: req.body.nestLocation,
        materials:req.body.nestMaterials
    };
    //save the Bird object to DB as new bird document
    bird.save().then((birdDoc)=>{
      console.log(birdDoc);
      //redierect to home homepage
      res.redirect('/');
    }).catch((err)=>{
        if (err.name=='ValidationError'){
            req.flash('error',err.message);
            res.redirect('/');
            //if error is duplicate entry
            //remove after the use of unique validator
        // }else if(err.code===11000){
        //     req.flash('error',`${req.body.name} is already in the database`);
        //     res.redirect('/');
        }else {
            next(err);//send errors to error handlers
        }
    });
});
//Get info about one bird using router /bird/:_id
router.get('/bird/:_id',function (req, res, next) {
    //get the _id of the bird from req.params
    //query db to get the bird's document
    Bird.findOne({_id:req.params._id})
        .then((birdDoc)=>{
          if (birdDoc){//if a bird with this id is found
            console.log(birdDoc);
            //sort date data by adding sort function. not desired in our program. option 2 would be in /addSighting
            //   birdDoc.datesSeen.sort(function (a,b) {
            //       return a.getTime()<b.getTime()
            //   });
            //send to view birdinfo update title and bird placeholders
            res.render('birdinfo', {title:birdDoc.name, bird:birdDoc});
          }else{
            var err=Error('Bird not found');
            err.status=404;
            throw err;
          }
        }).catch((err)=>{
          next(err);
    });
});
//post a new sighting of a bird /addSighting
router.post('/addSighting', function (req, res, next) {
    //when recieve new data, find the _id and update the document
    //push the new date to the end of the datesSeen array
    //Switch on runValidators to do date validations
    Bird.findByIdAndUpdate(
        {_id:req.body._id},
        {$push:{datesSeen:{$each:[req.body.date],$sort:-1}}},
        {runValidators:true})
        .then((updatedBirdDoc)=>{
            if(updatedBirdDoc){
                res.redirect(`/bird/${req.body._id}`)//redierct to the bird's info page
            }else {
                var err=Error("Adding sighting error, bird not found");
                err.status=404;
                throw err;
            }
        }).catch((err)=>{
            //if updating specify if validators run or not
        //check for CastError; handle invalid structure dates
        //check for validation error:for dates in the future
          if (err.name==='CastError'){
              req.flash('error','Date must be in a valid format');
              res.redirect(`/bird/${req.body._id}`)
              }else if (err.name==='ValidationError'){
              req.flash('error', err.message);
              res.redirect(`/bird/${req.body._id}`);
          }else {
              next(err);
          }
    });
});
//POST to /delete for the new button
router.post('/delete', function (req, res, next) {
    //find the document for the _id and delete
    Bird.findByIdAndRemove(req.body._id)
        .then((deletedDoc)=>{
            if (deletedDoc){//if true redierect to home page
                res.redirect('/');
            }else{
                var error=new Error('Document not found')
                error.status=404;
                next(error);
            }
        }).catch((err)=>{
            next(err);
    })
})
module.exports = router;
