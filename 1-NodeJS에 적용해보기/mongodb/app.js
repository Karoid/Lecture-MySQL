const express = require('express');

// create express app
const app = express();

// Configuring the database
const dbURL = 'mongodb://'+process.env.mongo_host+':'+process.env.mongo_port
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbURL, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// parse requests of content-type - application/json
app.use(express.json())

//router 가져오기
const noteRouter = require("./routes/note");

app.use('/api', express.urlencoded({ extended: false }), [ 
    noteRouter,
]);


// listen for requests
app.listen(process.env.node_port, process.env.node_host,() => {
    console.log("Server is listening on port ",process.env.node_port);
});
