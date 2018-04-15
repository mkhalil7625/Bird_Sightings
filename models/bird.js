//require mongoose library
var mongoose=require('mongoose');
//require mongoose unique validator and use the uniqueCaseInsensitive to the name
var uniqueValidator=require('mongoose-unique-validator');
//create the birdSchema
var birdSchema=new mongoose.Schema({
    name:{type:String, required:[true,'Bird name is required.']
        ,unique:true, uniqueCaseInsensitive:true,
        //add a validation to name must be 2 or more letters
    validate:{
        validator:function (n) {
            return n.length>=2;
            },message:'{VALUE} is not valid, bird name must be at least 2 letters'
        }
    },
    description:{type:String},
    averageEggs:{type:Number, min:[1, 'Should be at least 1 egg.'], max:[50, 'should not be more than 50 eggs']},
    endangered:{type:Boolean, default:false},
    datesSeen:[
        {
            type:Date,
            required:[true,'A date is required to add a new sighting'],
            validate:{
                validator:function (date) {
                    return date.getTime()<=Date.now();
                },message:'Date must be in the past or now'
            }
        }
        ],
    nest:{
        location:String,
        materials:String
    }
});
var Bird=mongoose.model('Bird',birdSchema);
birdSchema.plugin(uniqueValidator);
//export Bird Schema
module.exports=Bird;