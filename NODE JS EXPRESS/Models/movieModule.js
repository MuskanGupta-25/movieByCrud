const mongoose = require('mongoose');
const fs= require('fs')
const validator = require('validator');
const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required field'],
        unique: true,
        maxlength: [100, 'Movie name must not have more then 100 character'],
        minlength: [4, 'Movie name must have at least 4 characters'], //we can use maxlength and minlength in only string not in number
        trim: true,
       // validate: [validator.isAlpha, "Name should only contain alphabets"]
    },
    description: {
        type: String,
        required: [true, 'Descripition is required field'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required field']
    },
    ratings: {
        type: Number,
        // min: [1, 'Rating must be 1.0 or above'],
        // max: [10, 'Rating must be 10.0 or below']
        validate:{
            validator: function(value){
                return value >=1 && value <= 10;
            },
            message:"Ratings {VALUE} should be shown be above 1 and below 10"
        }
},
totalRating:{
    type: Number   //how many viewer see and like the movie
},
releaseYear:{
    type:Number,
    required:[true, 'Release year is required field!']
},
releaseDate:{
    type: Date
},
createAt:{
    type: Date,
    default:Date.now(),
    select:false //if we use this user cannot see this field
},
genres:{
    type: [String],
    required:[true, 'Genres is required field!'],
    // enum:{
    //     values:["Action", "Adventure", "Sci-Fi", "Thriler", "Crime", "Drama", "Comedy", "Romance", "Biography"],
    // message:"This genre does not exist"}
},
director:{
    type:[String],
    required:[true,'Director is required field!']
},
coverImage:{
    type:[String],
    require:[true,'Cover image is required field!']
},
actors:{
    type:[String],
    require:[true, 'actors is required fiels!']
},
price:{
    type:Number,
    require:[true,'Price is required field!']
},
createdBy: String
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

movieSchema.virtual('durationInHours').get(function(){
    return this.duration/60;
})  //we cannot use this virtual property in query 

//executed beforethe document is saved in db
//.save() or .create() will work
//insertMany, fingByIDAndUpdate will not work
// movieSchema.pre('save',function(next){
//     console.log(this);
//     next();
// })

movieSchema.pre('save',function(next){
    this.createdBy = 'MuskanGupta';
    next();
})

movieSchema.post('save', function(doc,next){
    const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}\n`
fs.writeFileSync('./log/log.txt' , content, {flag:'a'}, (err)=>{
    console.log(err.message);
});
next();
});

movieSchema.pre(/^find/, function(next){
    this.find({releaseDate: {$lte: Date.now()}});
    this.startTime = Date.now();
    next();
});
movieSchema.post(/^find/, function(docs,next){
    this.find({releaseDate: {$lte: Date.now()}});
    this.endTime = Date.now();
    const content = `Query took ${this.endTime- this.startTime} in milliseconds to fetch the documents.`
    fs.writeFileSync('./log/log.txt' , content, {flag:'a'}, (err)=>{
        console.log(err.message);
    });
    next();
});

movieSchema.pre('aggregate' , function(next){
    console.log(this.pipeline().unshift({$match: {releaseDate:{$lte: new Date()}}}));
    next();
})

const Movie = mongoose.model('Movie' , movieSchema); 
module.exports = Movie;