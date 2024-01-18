const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Movie = require('./../Models/movieModule');

dotenv.config({path: './config.env'});

//CONNECT TO MONGOOSE
mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
}).then((conn)=>{
    //console.log(conn);
    console.log('DB connection succesfull');
}).catch((error)=>{
    console.log('some error has occured')
})

//READ MOVIE.JSON FILE
const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));

//DELETE EXISTING MOVIE DOCUMENTS FROM COLLECTION
const deleteMovies = async()=>{
    try{
        await Movie.deleteMany();
        console.log('Data succesfully Deleted');
    }catch(err){
        console.log(err.message);
    }
    process.exit();
}

//IMPORT MOVIES DATA TO MONGOOSE COLLECTION 
const importMovies = async()=>{
    try{
        await Movie.create(movies);
        console.log('Data succesfully Impoted');
    }catch(err){
        console.log(err.message);
    }
    process.exit();
}

if(process.argv[2]==='--import'){
    importMovies();
}
if(process.argv[2]==='--delete'){
    deleteMovies();
}

// first we delete the exist document then we import
//to run in cmd we can write   node data/import-dev-data --import
//                             node data/import-dev-data --delete