const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})

process.on('uncaughtException', (err)=>{
    console.log(err.name,err.message);
    console.log('uncaught exception occurred! Shutting down....')
    process.exit(1);  
 })
const app = require('./app');
//console.log(app.get('env'));
console.log(process.env);
mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
}).then((conn)=>{
    //console.log(conn);
    console.log('DB connection succesfull');

})

const port = process.env.PORT || 3000;
const server = app.listen(port , () =>{
    console.log('Server has started....');
})

process.on('unhandledRejection', (err)=>{
    console.log(err.name,err.message);
    console.log('Unhandler rejection occurred! Shutting down....')
    server.close(()=>{
        process.exit(1);
    })    
 })



