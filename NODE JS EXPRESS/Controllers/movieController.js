const Movie = require('./../Models/movieModule');
const fs = require('fs');
const Apifeatures = require('./../utils/ApiFeatures');
const asyncErrorHandler = require('./../utils/asyncErrorHandler')
const CustomError = require('./../utils/CustomError')
let movies = JSON.parse(fs.readFileSync('./data/movies.json'));
exports.getHighestRated = (req, res ,next)=>{
    req.query.limit = '5',
    req.query.sort ='-ratings';
    next();
}
exports.getHighestPrice = (req,res,next)=>{
    req.query.limit ='5',
    req.query.sort = '-price';
    next();
}
exports.getAllMovies = asyncErrorHandler( async(req,res) =>{  
    const features = new Apifeatures(Movie.find(),req.query).filter().sort().limitFields().paginate();
    let movies = await features.query;
    res.status(200).json({
        status:"success",
        length:movies.length,
        data: {
            movies
        }
    })
})

exports.getMovie = asyncErrorHandler( async(req,res) =>{
    const movie = await Movie.findById(req.params.id);
    if(!movie){
        const error = new CustomError('Movie with that ID is not found!', 404);
        return next(error);
    }
        res.status(200).json({
            status:"success",
            data: {
                movie
            }
        });
})



exports.createMovie = asyncErrorHandler( async(req,res)=>{
    const movie = await Movie.create(req.body);
        res.status(201).json({
            status:'success',
            data:{
                movie
            }
        })
});

exports.updateMovie = asyncErrorHandler( async (req,res)=>{
    const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true
    });
    if(!updateMovie){
        const error = new CustomError('Movie with that ID is not found!', 404);
        return next(error);
    }
    res.status(200).json({
      status:"success",
      data:{
        movie:updateMovie
    }
    });
})
exports.deleteMovie = asyncErrorHandler( async(req,res)=>{
    const deleteMovie = await Movie.findByIdAndDelete(req.params.id);
    if(!deleteMovie){
        const error = new CustomError('Movie with that ID is not found!', 404);
        return next(error);
    }
        res.status(204).json({
          status:"success",
          data:null
        });   
})
//aggregation pipeline
exports.getMovieStats = asyncErrorHandler( async (req,res)=>{
    const stats = await Movie.aggregate([
       
         {$match:{ratings:{$gte:4.5}}},
         {$group: {
             _id: '$releaseYear',
             avgRating:{$avg: '$ratings'},
             avgPrice:{$avg: '$price'},
             minPrice:{$min: '$price'},
             maxPrice:{$max:'$price'},
             totalPrice:{$sum: '$price'},
             movieCount: {$sum: 1}
         }},
         {$sort:{
             minPrice:1
         }},
     ]);
     res.status(200).json({
         status:"success",
         count:stats.length,
         data:{
             stats
         }
       });
})

exports.getMovieByGenre = asyncErrorHandler( async(req,res)=>{
     const genre = req.params.genre;
        const movies = await Movie.aggregate([
           // {$match: {releaseDate: {$lte : new Date()}}},
            {$unwind: '$genres'},
            {$group: {
                _id:'$genres',
                movieCount: {$sum : 1},
                movies: {$push:'$name' },
            }},
            {$addFields: {genre:'$_id'}},
            {$project: {_id:0}},
            {$sort:{movieCount:-1}},
           // {$limit: 6}
           {$match:{genre:genre}}
        ]);
        res.status(200).json({
            status:"success",
            count:movies.length,
            data:{
                movies
            }
          })
})

