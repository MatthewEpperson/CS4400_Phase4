const mysql = require("mysql2")
const express = require("express")
const { json } = require("express/lib/response")


const app = express()

app.use(express.urlencoded({
    extended: false
}))

const connection = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "asdqwe123",
    database: "restaurant_supply_express"

})

app.use(express.json())
app.use(express.static("public"))

connection.connect(function(err) {
    if (err) {
        console.log(err)
        console.log("Database connection failed")
    } else {
        console.log("Database connection successful")
    }
})

app.listen(3000, function() {
    console.log("Listening on port 3000")
})

// Database successfully established after this point

app.get("/display-select", function(req, res) {
    console.log("received request for /display-select")
    userQuery = "select * from users"
    connection.query(userQuery, function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-select"})
        } else {
            res.json({success: true, quote: rows[0].username})
        }
    })
})

app.get("/main", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "index.html");
})
