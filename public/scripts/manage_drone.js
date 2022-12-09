function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-drones")
    xhr.send();
}

let droneData = null;
let ingredientData = null;
let deliveryServiceData = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        console.log(this.response.drones);
        if (this.response.drones && this.response.ingredients && this.response.deliveryServices) {
            let data = this.response.drones;
            let ingredientData = this.response.ingredients;
            deliveryServiceData = this.response.deliveryServices;
            droneData = data;
            for (let i = 0; i < data.length; i++) {
                populateTable(data[i], "droneTable");
            }
            for (let i = 0; i < ingredientData.length; i++) {
                populateTable(ingredientData[i], "ingredientTable");
            }
        }
    } else {
        console.log("FAILURE");
        console.log(this.response.message);
    }
}



function clearTable() {
    const table = document.getElementById("droneTable");

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
        let colName = row.insertCell(itemKeys.length);
        let btn = document.createElement("button");
        let fuelInput = document.createElement("input");
        fuelInput.type = "text";
        fuelInput.id = `${items['id']} ${items['tag']}`;
        btn.innerText = "Refuel Drone";
        btn.onclick = function() {
            refuelDrone(fuelInput.id, items['fuel'], items['hover']);
        };
        colName.appendChild(fuelInput);
        colName.appendChild(btn);
    }
}

function refuelDrone(drone, currAmt, hover) {
    let fuelAmt = document.getElementById(drone);
    let droneSplit = drone.split(" ");
    let droneID = droneSplit[0];
    let droneTag = droneSplit[1];
    console.log(droneID)

    console.log(currAmt);
    let information = `droneid=${droneID}&dronetag=${droneTag}&fuel_amount=${fuelAmt.value}`
    
    let refuelSuccess = false

    if (fuelAmt != null) {
        if (currAmt + parseInt(fuelAmt.value) <= 100) {
            for (let i = 0; i < deliveryServiceData.length; i++) {
                if (deliveryServiceData[i]['id'] == droneID
                    && deliveryServiceData[i]['home_base'] == hover) {
                        console.log(`${fuelAmt.value} ${droneID} ${droneTag}`);
                        refuelRequest(information)
                        clearTable()
                        displaySelect();
                        refuelSuccess = true
                    }
            }
            if (refuelSuccess == false) {
                alert("Drone was not at home base!")
            }
        } else {
            alert("This would put fuel over 100!")
        }
    }
}


// document.addEventListener("click", refuelDrone());

document.addEventListener("DOMContentLoaded", function() {
    displaySelect();
  });

// document.getElementById("query_input").addEventListener("click", displaySelect);

function refuelRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", refuelResponse)
    url = "/attempt-refuel"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}

function refuelResponse() {

}