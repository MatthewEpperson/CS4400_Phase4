function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-pilots-view")
    xhr.send();
}

let pilotData = null;
let droneData = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        if (this.response.pilots) {
            pilotData = this.response.pilots
            droneData = this.response.drones
            // document.getElementById("select_output").innerText = JSON.stringify(this.response.data)     }
            for (let i = 0; i < pilotData.length; i++) {
                populateTable(pilotData[i], "pilotTable");
            }

            for (let i = 0; i < droneData.length; i++) {
                populateTable(droneData[i], "droneTable")
            }
        }
    } else {
        console.log("FAILURE");
        console.log(this.response.message);
    }
}



function clearTable(tableName) {
    const table = document.getElementById(tableName);

    for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
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
            colName.innerHTML = items[attribute];
        }
    } else {
        let j = table.rows.length;
        for (let i = 0; i < itemKeys.length; i++) {
            let colName = row.insertCell(j);
            let attribute = itemKeys[i];
            colName.innerHTML = items[attribute];
            j++;
        }
    }

    if (tableName == "droneTable") {
        let colName = row.insertCell(itemKeys.length)
        let btn = document.createElement("button")
        btn.type = "text"
        btn.innerText = "Remove Drone"
        btn.id = `${items['id']} ${items['tag']}`
        btn.onclick = function() {
            removeDrone(btn.id)
        }
        colName.appendChild(btn)
    }
}


function addDrone(droneID, droneTag, droneFuel, droneCapacity, droneSales, droneFlownBy) {
    if (droneID == "" || droneTag == "") {
        alert("DroneID or droneTag were empty!")
        return
    }
    let information = `droneID=${droneID}&droneTag=${droneTag}&droneFuel=${droneFuel}&droneCapacity=${droneCapacity}` +
                        `&droneSales=${droneSales}&droneFlownBy=${droneFlownBy}`
    addDroneRequest(information)

}


function removeDrone(drone) {
    let droneSplit = drone.split(" ")
    let droneID = droneSplit[0]
    let droneTag = droneSplit[1]

    let information = `droneID=${droneID}&droneTag=${droneTag}`
    console.log(information)
    removeDroneRequest(information)
    // clearTable("droneTable")
    // displaySelect()
}


function addDroneRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", addDroneResponse)
    url = "/attempt-add-drone"

    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}


function addDroneResponse() {
    clearTable("droneTable")
    clearTable("pilotTable")
    displaySelect()
}


function removeDroneRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", removeDroneResponse)
    url = "/attempt-remove-drone"

    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}


function removeDroneResponse() {
    clearTable("droneTable")
    clearTable("pilotTable")
    displaySelect()
}

// document.getElementById('clearBtn').onclick = function() {
//     document.getElementById('username').value = "";
//     document.getElementById('licenseID').value = "";
//     clearTable("droneTable")
//     clearTable("pilotTable")
//     displaySelect()
// };


document.getElementById("addDroneBtn").onclick = function() {
    let droneID = document.getElementById("inputDroneID")
    let droneTag = document.getElementById("inputDroneTag")
    let droneFuel = document.getElementById("inputDroneFuel")
    let droneCapacity = document.getElementById("inputDroneCapacity")
    let droneSales = document.getElementById("inputDroneSales")
    let droneFlownBy = document.getElementById("inputFlownBy")
    addDrone(droneID.value, droneTag.value, droneFuel.value, droneCapacity.value,
                droneSales.value, droneFlownBy.value)
}


document.getElementById("removeDroneBtn").onclick = function() {
    let droneID = document.getElementById("inputDroneID")
    let droneTag = document.getElementById("inputDroneTag")

    removeDrone(`${droneID.value} ${droneTag.value}`)
}

document.addEventListener("DOMContentLoaded", function() {
    displaySelect();
  });

// document.getElementById("query_input").addEventListener("click", displaySelect);