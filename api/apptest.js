require("dotenv").config(); 
const {path,handler} = require('./index')
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors")
const app = express()

var corsOptions = {exposedHeaders: 'x-auth'}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(path,handler);
port="3000"
app.listen(port,()=>{
   console.log(`Started up apptest port:${port}`);
});
//for test {path,app}
module.exports = { path,app };