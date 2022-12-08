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


app.get("/display-employee-view", function(req, res) {
    userQuery = "select * from display_employee_view"
    connection.query(userQuery, function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-select"})
        } else {
            console.log(userQuery);
            res.json({success: true, data: rows})
        }
    })
})

app.get("/display-ingredients-view", function(req, res) {
    userQuery = "select * from display_ingredient_view"
    connection.query(userQuery, function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-select"})
        } else {
            console.log(userQuery);
            res.json({success: true, data: rows})
        }
    })
})

app.get("/display-locations-view", function(req, res) {
    userQuery = "select * from display_location_view"
    connection.query(userQuery, function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-select"})
        } else {
            console.log(userQuery);
            res.json({success: true, data: rows})
        }
    })
})


app.get("/display-owners-view", function(req, res) {
    userQuery = "select * from display_owner_view"
    connection.query(userQuery, function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-select"})
        } else {
            console.log(userQuery);
            res.json({success: true, data: rows})
        }
    })
})

app.get("/display-pilots-view", function(req, res) {
    userQuery = "select * from display_pilot_view"
    connection.query(userQuery, function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-select"})
        } else {
            console.log(userQuery);
            res.json({success: true, data: rows})
        }
    })
})


app.get("/main", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "index.html");
})

app.get("/ingredients_view", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "ingredients_view.html");
})

app.get("/owners_view", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "owners_view.html");
})

app.get("/pilots_view", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "pilots_view.html");
})

app.get("/locations_view", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "locations_view.html");
})

app.get("/employees_view", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "employees_view.html");
})
