const mysql = require("mysql2")
const express = require("express")
const { json } = require("express/lib/response")


const app = express()
authenticated = false;

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

app.get("/attempt-login", function(req, res) {
    userQuery = "select * from users where username = ?"
    connection.query(userQuery, [req.body.username],function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /attempt_login"})
        } else {
            if (rows.length == 0) {
                res.json({sucess: false, message: "user not found in database"})
            } else if (rows.length == 1) {
                res.json({success: true, message: "database query successful for /attempt-login"})
            } else {
                res.json({success: false, message: "too many users with that username found"})
            }
        }
    })
})


app.post("/attempt-register", function(req, res){
    query = "select * from users where username = ?"
    connection.query(query, [req.body.username], function(err, rows) {
        if (err) {
            res.json({success: false, message: "database query failed for /attempt_register"})
            console.log(`database error for ${req.body.username}`)
        } else {
            if (rows.length == 1) {
                res.json({success: false, message: "username already taken"})
                console.log(`username already taken error for ${req.body.username}`)

            } else if (rows.length == 0) {
                // TODO implement the registration page form
                if (req.body.type === "Employee") {
                    insertUser = 'call add_employee(?, ?, ?, ?, ?, ?, null, ?, null);'
                    connection.query(insertUser, [
                        req.body.username,
                        req.body.fname,
                        req.body.lname,
                        req.body.address,
                        req.body.bdate,
                        req.body.taxID,
                        req.body.experience
                        ], function(err, rows) {
                            if (err) {
                                console.log(err.message)
                                res.json({success: false, message: "database insert failed for /attempt_register (employee)"})
                            } else {
                                res.json({success: true, message: "successfully added employee"})
                            }
                        })

                } else if (req.body.type === 'Owner') {
                    insertUser = 'call add_owner(?, ?, ?, ?, ?);'
                    connection.query(insertUser, [
                        req.body.username,
                        req.body.fname,
                        req.body.lname,
                        req.body.address,
                        req.body.bdate,
                        ], function(err, rows) {
                            if (err) {
                                console.log(err.message)
                                res.json({success: false, message: "database insert failed for /attempt_register (owner)"})
                            } else {
                                res.json({success: true, message: "successfully added owner"})
                            }
                        })
                } else {
                    res.json({success: false, message: `Type invalid`})
                }
            }
        }
    })    
})

app.get("/checkedLoggedIn", function(req, res) { 
    // console.log("Server received POST to /checkedLoggedIn...");
    if (authenticated) {
        res.json({success: true, message: "User is signed in", user: currUser})
    } else {
        res.json({success: false, message: "User not signed in"})
    }
})

app.get("/update-authenticated", function(req, res) {
    authenticated = false;
    res.json({success: true})
})

app.get("/display-pilot-vew", function(req, res) {
    userQuery = "select * from?"
    connection.query(userQuery, req,function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-select"})
        } else {
            res.json({success: true, message: "database query successful for /display-select"})
        }
    })
})

app.get("/main", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "index.html");
})

app.get("/registration", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "registration.html")
})

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "index.html")
})



