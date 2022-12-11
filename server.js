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

app.listen(8080, function() {
    console.log("Listening on port 8080")
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


app.get("/display-drones-view", function(req, res) {
    userQuery = "select * from drones"
    let drones;
    connection.query(userQuery, function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-drones-view"})
        } else {
            drones = rows
            res.json({success: true, drones: drones})
            }
        })
})


app.post("/attempt-refuel", function(req, res) {
    let refuelDrone = 'call refuel_drone(?, ?, ?);'
    console.log(JSON.stringify(req.body))
    console.log(req.body.droneid)
    console.log(req.body.dronetag)
    console.log(req.body.fuel_amount)
    connection.query(refuelDrone, [
        req.body.droneid,
        req.body.dronetag,
        req.body.fuel_amount
    ], function(err, rows){
        if (err) {
            res.json({success: false, message: "database query failed for /attempt_refuel"})
            console.log(`database error for ${req.body.droneid} ${req.body.dronetag}`)
            console.log(err.message)
        } else {
            res.json({success: true, message: "successfully refueled drone"})
        }
    })
})


app.post("/attempt-load-drone", function(req, res) {
    let loadDrone = 'call load_drone(?, ?, ?, ?, ?);'
    console.log(JSON.stringify(req.body))
    connection.query(loadDrone, [
        req.body.droneID,
        req.body.droneTag,
        req.body.barcode,
        req.body.amount,
        req.body.price
    ], function(err, rows){
        if (err) {
            res.json({success: false, message: "database query failed for /attempt_load-drone"})
            console.log(`database error for ${req.body.droneid} ${req.body.dronetag}`)
            console.log(err.message)
        } else {
            res.json({success: true, message: "successfully loaded drone"})
            console.log("Drone got loaded!")
        }
    })
})


app.post("/attempt-fly-drone", function(req, res) {
    let flyDrone = 'call fly_drone(?, ?, ?)'
    console.log(JSON.stringify(req.body))
    connection.query(flyDrone, [
        req.body.droneID,
        req.body.droneTag,
        req.body.location
    ], function(err, rows){
        if (err) {
            res.json({success: false, message: "database query failed for /attempt_fly-drone"})
            console.log(err.message)
        } else {
            res.json({success: true, message: "successfully flown drone"})
            console.log("Drone got flown!")
        }
    })
})


app.post("/attempt-add-drone", function(req, res) {
    let addDrone = 'call add_drone(?, ?, ?, ?, ?, ?)'
    console.log(JSON.stringify(req.body))
    connection.query(addDrone, [
        req.body.droneID,
        req.body.droneTag,
        req.body.droneFuel,
        req.body.droneCapacity,
        req.body.droneSales,
        req.body.droneFlownBy
    ], function(err, rows){
        if (err) {
            res.json({success: false, message: "database query failed for /attempt-add-drone"})
            console.log(err.message)
        } else {
            res.json({success: true, message: "successfully added drone"})
            console.log("Drone added!")
        }
    })
})


app.post("/attempt-join-swarm", function(req, res) {
    let joinSwarm = 'call join_swarm(?, ?, ?)'
    console.log(JSON.stringify(req.body))
    connection.query(joinSwarm, [
        req.body.droneID,
        req.body.droneTag,
        req.body.swarmTag
    ], function(err, rows){
        if (err) {
            res.json({success: false, message: "database query failed for /attempt-join-swarm"})
            console.log(err.message)
        } else {
            res.json({success: true, message: "successfully joined swarm"})
            console.log("Drone joined swarm!")
        }
    })
})


app.post("/attempt-leave-swarm", function(req, res) {
    let leaveSwarm = 'call leave_swarm(?, ?)'
    console.log(JSON.stringify(req.body))
    connection.query(leaveSwarm, [
        req.body.droneID,
        req.body.droneTag
    ], function(err, rows){
        if (err) {
            res.json({success: false, message: "database query failed for /attempt-leave-swarm"})
            console.log(err.message)
        } else {
            res.json({success: true, message: "successfully left swarm"})
            console.log("Drone left swarm!")
        }
    })
})


app.post("/attempt-remove-drone", function(req, res) {
    let removeDrone = 'call remove_drone(?, ?)'
    console.log(JSON.stringify(req.body))
    connection.query(removeDrone, [
        req.body.droneID,
        req.body.droneTag
    ], function(err, rows){
        if (err) {
            res.json({success: false, message: "database query failed for /attempt-remove-drone"})
            console.log(err.message)
        } else {
            res.json({success: true, message: "successfully removed drone"})
            console.log("Drone removed!")
        }
    })
})


app.post("/attempt-takeover-drone", function(req, res) {
    let takeoverDrone = 'call takeover_drone(?, ?, ?)'
    console.log(JSON.stringify(req.body))
    connection.query(takeoverDrone, [
        req.body.pilotUsername,
        req.body.droneID,
        req.body.droneTag
    ], function(err, rows){
        if (err) {
            res.json({success: false, message: "database query failed for /attempt-takeover-drone"})
            console.log(err.message)
        } else {
            res.json({success: true, message: "successfully tookover drone"})
            console.log("pilot is now flying drone")
        }
    })
})


app.post("/attempt-add-ingredient", function(req, res) {
    let addIngredient = 'call add_ingredient(?, ?, ?)'
    console.log(JSON.stringify(req.body))
    connection.query(addIngredient, [
        req.body.barcode,
        req.body.name,
        req.body.weight
    ], function(err, rows){
        if (err) {
            res.json({success: false, message: "database query failed for /attempt-add-ingredient"})
            console.log(err.message)
        } else {
            res.json({success: true, message: "successfully added ingredient"})
            console.log("ingredient was added")
        }
    })
})


app.post("/attempt-remove-ingredient", function(req, res) {
    let removeIngredient = 'call remove_ingredient(?)'
    connection.query(removeIngredient, [
        req.body.barcode
    ], function(err, rows){
        if (err) {
            res.json({success: false, message: "database query failed for /attempt-remove-ingredient"})
            console.log(err.message)
        } else {
            res.json({success: true, message: "successfully removed ingredient"})
            console.log("ingredient was removed")
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



app.get("/display-ingredients-view", function(req, res) {
    userQuery = "select * from display_ingredient_view"
    ingredientQuery = "select * from ingredients"

    let ingredientView;
    connection.query(userQuery, function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-select"})
        } else {
            ingredientView = rows
            console.log(userQuery);
        }
    })

    let ingredients;
    connection.query(ingredientQuery, function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-select"})
        } else {
            ingredients = rows
            console.log(ingredientQuery);
            res.json({success: true, ingredientView: ingredientView, ingredients: ingredients})
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
    deliverServiceQuery = "select * from delivery_services"
    payloadQuery = "select * from payload"
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
        }
    })
    let deliveryServices;
    connection.query(deliverServiceQuery, function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-select"})
        } else {
            // console.log(userQuery);
            deliveryServices = rows
        }
    })
    let payloads;
    connection.query(payloadQuery, function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-select"})
        } else {
            // console.log(userQuery);
            payloads = rows
            res.json({success: true, ingredients: ingredients, drones: drones, deliveryServices: deliveryServices,
                payload: payloads})
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


app.get("/display-pilots-page", function(req, res) {
    droneQuery = "select * from drones"
    connection.query(droneQuery,function(err, rows) {
        if (err) {
            res.json({success: false, message:"database query failed for /display-pilots-page"})
        } else {
            console.log(droneQuery);
            res.json({success: true, drones: rows})
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

app.get("/drones_view", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "drones_view.html");
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
app.get("/adminPage", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "adminPage.html");
})
app.get("/adminAccess", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "adminAccess.html");
})
app.get("/loginWorker", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "loginWorker.html");
})
app.get("/loginPilot", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "loginPilot.html");
})
app.get("/loginManager", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "loginManager.html");
})
app.get("/loginOwner", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "loginOwner.html");
})
app.get("/workerPage", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "workerPage.html");
})
app.get("/pilotPage", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "pilotPage.html");
})
app.get("/managerPage", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "managerPage.html");
})
app.get("/ownerPage", function(req, res){
    res.sendFile(__dirname + "/public/views/" + "ownerPage.html");
})
