const mysql = require("mysql2")
const express = require("express")
const { json } = require("express/lib/response")


const app = express()
let authenticated = false;
let user = {} 

app.use(express.urlencoded({
    extended: false
}))

const connection = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "password",
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
                                authenticated = true;
                                user.username = req.body.username
                                res.json({success: true, message: "successfully added owner", user: user})
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
    if (authenticated) {
        res.json({success: true, message: "User is signed in", user: user})
    } else {
        res.json({success: false, message: "User not signed in"})
    }
})

app.get("/update-authenticated", function(req, res) {
    authenticated = false;
    res.json({success: true})
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


app.get("/display-employee-view", function(req, res) {
    userQuery = "select * from display_employee_view where username in (select username from work_for where binary id = binary ?) and manager_status = 'NO' collate utf8mb4_unicode_ci"
    connection.query(userQuery, ["rr"], function(err, rows) {
        if (err) {
            console.log(err.message)
            res.json({success: false, message:"database query failed for /display-select"})
        } else {
            console.log(userQuery);
            res.json({success: true, data: rows})
        }
    })
})

app.post("/fire-employee", function(req, res) {
    connection.query("select * from employees where username = binary ? collate utf8mb4_unicode_ci;",
    [req.body.username], function(err, rows) {
        if (err) {
            console.log(err.message)
            res.json({success: false, message: "error in finding your employees"})
        } else {
            console.log(JSON.stringify(req.body))
            connection.query("call fire_employee(?, ?);",
            [req.body.username, req.body.id], function(err, rows) {
                if (err) {
                    console.log(err.message)
                    res.json({success: false, message: "error in firing employee"})
                } else {
                    res.json({success: true, message: "successfully fired employee"})
                }
            })
        }
    })
})

app.post("/hire-employee", function(req, res) {
    console.log("in /hire-employee")
    connection.query("select * from users where username = binary ? collate utf8mb4_unicode_ci;",
    [req.body.username], function(err, rows) {
        if (err) {
            console.log(err.message)
            console.log("ERROR IN FINDING EMPLOYEE")
            res.json({success: false, message: `error in finding employee with username=${req.body.username}`})
        } else {
            console.log(JSON.stringify(req.body))
            connection.query("call hire_employee(?, ?)",
            [req.body.username, req.body.id], function(err, rows) {
                if (err) {
                    console.log("ERROR IN HIRING EMPLOYEE")
                    console.log(err.message)
                    res.json({success: false, message: "error in hiring employee"})
                } else {
                    res.json({success: true, message: "successfully firing employee"})
                }
            })
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


app.get("/display-drones", function(req, res) {
    userQuery = "select * from drones"
    ingredientsQuery = "select * from ingredients"
    let drones;
    connection.query(userQuery, function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-select"})
        } else {
            console.log(userQuery);
            drones = rows
            // res.json({success: true, data: rows})
        }
    })

    let ingredients;
    connection.query(ingredientsQuery, function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-select"})
        } else {
            console.log(userQuery);
            // res.json({success: true, ingredients: rows})
            ingredients = rows
            res.json({success: true, ingredients: ingredients, drones: drones})
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

app.get("/display-services-view", function(req, res) {
    userQuery = "select * from display_service_view"
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

app.get("/registration", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "registration.html")
})

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "index.html")
})
app.get("/home", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "home.html")
})
app.get("/login", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "login.html")
})
app.get("/owner", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "owner.html")
})


app.get("/services_view", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "services_view.html");
})

app.get("/owners_view", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "owners_view.html");
})
app.get("/ingredients_view", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "ingredients_view.html");
})

app.get("/owners_view", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "owners_view.html");
})

app.get("/manage_drone", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "manage_drone.html");
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
