const express = require('express');

const morgan = require('morgan');

const movieRouters = require('./Routes/movieRouters')

const CustomError = require('./utils/CustomError')
const globalErroeHandler = require('./Controllers/errorController')
let app = express();

const logger = function(req,res,next){
    console.log('Custom middleware called');
    next();
}
app.use(express.json());
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev')); 
}
app.use(express.static('./public'));
app.use(logger); 
app.use((req,res,next)=>{
    req.requestedAt = new Date().toISOString();
    next();
})

app.use('/api/v1/movies' , movieRouters)

app.all('*', (req,res,next)=>{  
const err = new CustomError(`Cant't find ${req.originalUrl} on the server!`, 404);
next(err); //if we pass err in next or any value the express stop all the middleware and call the global error handler
});

app.use(globalErroeHandler);
module.exports = app;


