// import { clearTable } from "manage_drone.js";

function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-pilots-page")
    xhr.send();
}


let droneData = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        console.log(this.response.drones);
        if (this.response.drones) {
            let droneData = this.response.drones;
            console.log(droneData)
            for (let i = 0; i < droneData.length; i++) {
                populateTable(droneData[i], "droneTable");
            }
        }
    } else {
        console.log("FAILURE");
        console.log(this.response.message);
    }
}


function populateTable(items, tableName) {
    const table = document.getElementById(tableName);

    let itemKeys = Object.keys(items);
    
    let row = table.insertRow();

    if (table.rows.length >= 2) {
        for (let i = 0; i < itemKeys.length; i++) {
            let colName = row.insertCell(i);
            let attribute = itemKeys[i];
            let droneID = itemKeys[0]
            let droneTag = itemKeys[1]
            colName.innerHTML = items[attribute];
            colName.id = `${items[droneID]} ${items[droneTag]}`
        }
    } else {
        let j = table.rows.length;
        for (let i = 0; i < itemKeys.length; i++) {
            let colName = row.insertCell(j);
            let attribute = itemKeys[i];
            let droneID = itemKeys[0]
            let droneTag = itemKeys[1]
            console.log(droneID)
            colName.innerHTML = items[attribute]
            colName.id = `${items[droneID]} ${items[droneTag]}`
            j++;
        }
    }

    if (tableName == "droneTable") {
        let btnNames = ["flyBtn", "joinBtn", "leaveBtn", "takeoverBtn"]
        let btnText = ["Fly Drone", "Join Swarm", "Leave Swarm", "Takeover Drone"]
        for (let i = 0; i < btnNames.length; i++) {
            let colName = row.insertCell(itemKeys.length + i);
            let btn = document.createElement('button')
            btn.type = 'text'
            btn.innerText = btnText[i]
            btn.id = `${btnNames[i]} ${items['id']} ${items['tag']}`;
            colName.appendChild(btn)

            if (btnNames[i] == "flyBtn") {
                btn.onclick = function() {
                    flyDrone(btn.id)
                }
            }

            if (btnNames[i] == "joinBtn") {
                btn.onclick = function() {
                    joinSwarm(btn.id)
                }
            }

            if (btnNames[i] == "leaveBtn") {
                btn.onclick = function() {
                    leaveSwarm(btn.id)
                }
            }

            if (btnNames[i] == 'takeoverBtn') {
                btn.onclick = function() {
                    takeoverDrone(btn.id)
                }
            }
        }
    }
}


function takeoverDrone(drone) {
    let droneSplit = drone.split(" ")
    let droneID = droneSplit[1]
    let droneTag = droneSplit[2]

    let pilotName = document.getElementById("pilotUsername")

    let information = `pilotUsername=${pilotName.value}&droneID=${droneID}&droneTag=${droneTag}`
    takeoverDroneRequest(information)
    clearTable("droneTable")
    displaySelect()
}


function takeoverDroneRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", takeoverDroneResponse)
    url = "/attempt-takeover-drone"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}

function takeoverDroneResponse() {
    
}


function joinSwarm(drone) {
    let droneSplit = drone.split(" ")
    let droneID = droneSplit[1]
    let droneTag = droneSplit[2]

    let targSwarmTag = document.getElementById("recDroneTag")

    let information = `droneID=${droneID}&droneTag=${droneTag}&swarmTag=${targSwarmTag.value}`
    joinSwarmRequest(information)
    clearTable("droneTable")
    displaySelect()
}


function leaveSwarm(drone) {
    let droneSplit = drone.split(" ")
    let droneID = droneSplit[1]
    let droneTag = droneSplit[2]

    let information = `droneID=${droneID}&droneTag=${droneTag}`
    leaveSwarmRequest(information)
    clearTable("droneTable")
    displaySelect()
}


function flyDrone(drone) {
    let droneSplit = drone.split(" ")
    let droneID = droneSplit[1]
    let droneTag = droneSplit[2]

    let targLocation = document.getElementById("targetLocation")
    
    let information = `droneID=${droneID}&droneTag=${droneTag}&location=${targLocation.value}`
    console.log(information)
    flyDroneRequest(information)
    clearTable("droneTable")
    displaySelect()

}


function joinSwarmRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", joinSwarmResponse)
    url = "/attempt-join-swarm"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}

function joinSwarmResponse() {

}


function leaveSwarmRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", leaveSwarmResponse)
    url = "/attempt-leave-swarm"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}

function leaveSwarmResponse() {

}

function flyDroneRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", flyDroneResponse)
    url = "/attempt-fly-drone"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}

function flyDroneResponse() {

}


function clearTable(tableName) {
    const table = document.getElementById(tableName);

    for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    displaySelect();
  });