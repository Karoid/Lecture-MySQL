const express = require('express');

// create express app
const app = express();

// Configuring the database
const mysql = require("mysql2/promise");

// Connecting to the database
let pool = mysql.createPool({
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
})

app.set('pool', pool);

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
