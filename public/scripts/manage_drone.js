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
let payload = null;

let ingredient_map = new Map()
let payload_map = new Map()
let drone_map = new Map()
let ds_map = new Map()

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        // console.log(this.response.drones);
        if (this.response.drones && this.response.ingredients && this.response.deliveryServices) {
            let data = this.response.drones;
            let ingredientData = this.response.ingredients;
            deliveryServiceData = this.response.deliveryServices;
            // console.log(deliveryServiceData)
            droneData = data;
            payload = this.response.payload

            ds_map.clear()
            for (let i = 0; i < deliveryServiceData.length; i++) {
                ds_map.set(deliveryServiceData[i].id, deliveryServiceData[i].home_base)
            }


            drone_map.clear()
            for (let i = 0; i < data.length; i++) {
                populateTable(data[i], "droneTable");
                drone_map.set(data[i].id + data[i].tag, data[i].capacity)
            }

            ingredient_map.clear()
            for (let i = 0; i < ingredientData.length; i++) {
                populateTable(ingredientData[i], "ingredientTable");
                ingredient_map.set(ingredientData[i].barcode, {iname: ingredientData[i].iname, weight: ingredientData[i].weight})
            }

            
            payload_map.clear()
            for (let i = 0; i < payload.length; i++) {
                populateTable(payload[i], "payloadTable")
                if (payload_map.has((payload[i].id + payload[i].tag))) {
                    payload_map.set((payload[i].id + payload[i].tag), payload_map.get((payload[i].id + payload[i].tag)) + payload[i].quantity)
                } else {
                    payload_map.set((payload[i].id + payload[i].tag), parseInt(payload[i].quantity))

                }

            }
            // console.log(payload_map)
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
        let colName = row.insertCell(itemKeys.length);
        let colName2 = row.insertCell(itemKeys.length + 1);
        let loadBtn = document.createElement("button");
        let packagePriceInput = document.createElement("input")
        let barcodeInput = document.createElement("input")
        let packageAmtInput = document.createElement("input");
        let refuelBtn = document.createElement("button");
        let fuelInput = document.createElement("input");

        packagePriceInput.type = "number"
        barcodeInput.type = "text"
        packageAmtInput.type = "number"
        loadBtn.innerText = "Load Drone"
        loadBtn.id = `${items['hover']}`;
        fuelInput.type = "number";
        fuelInput.placeholder = "Fuel Amount";
        fuelInput.id = `Fuel ${items['id']} ${items['tag']}`;

        packagePriceInput.placeholder = "Price"
        barcodeInput.placeholder = "Barcode"
        packageAmtInput.placeholder = "Amount"
        refuelBtn.innerText = "Refuel Drone";
        packagePriceInput.id = `price ${items['id']} ${items['tag']}`;
        barcodeInput.id = `barcode ${items['id']} ${items['tag']}`;
        packageAmtInput.id = `amount ${items['id']} ${items['tag']}`;

        refuelBtn.onclick = function() {
            refuelDrone(fuelInput.id, items['fuel'], items['hover']);
        };

        loadBtn.onclick = function() {
            loadDrone(fuelInput.id, loadBtn.id)
        }

        colName.appendChild(fuelInput);
        colName.appendChild(refuelBtn);
        colName2.appendChild(barcodeInput)
        colName2.appendChild(packageAmtInput)
        colName2.appendChild(packagePriceInput)
        colName2.appendChild(loadBtn)
    }
}

function loadDrone(drone, location) {
    let droneSplit = drone.split(" ");
    // console.log(location)
    let droneID = droneSplit[1]
    let droneTag = droneSplit[2]
    let barcode = document.getElementById(`barcode ${droneID} ${droneTag}`)

    if (!ingredient_map.has(barcode.value)) {
        alert("invalid ingredient")
        return
    }
    
    let amount = document.getElementById(`amount ${droneID} ${droneTag}`)
    if ((parseInt(amount.value) + payload_map.get(droneID + droneTag)) > drone_map.get(droneID + droneTag)) {
        alert("too heavy for drone to carry")
        return
    }

    // get hover location from table

    if (location != ds_map.get(droneID)) {
        alert("drone is not at its homebase")
        return
    }

    let price = document.getElementById(`price ${droneID} ${droneTag}`)

    // console.log(`${barcode.value} ${price.value} ${amount.value} ${droneID} ${droneTag}`)

    let information = `droneID=${droneID}&droneTag=${droneTag}&barcode=${barcode.value}` +
                    `&amount=${parseInt(amount.value)}&price=${parseInt(price.value)}`

              
    loadDroneRequest(information)
    
    
}


function refuelDrone(drone, currAmt, hover) {
    let fuelAmt = document.getElementById(drone);
    let droneSplit = drone.split(" ");
    let droneID = droneSplit[1];
    let droneTag = droneSplit[2];

    console.log(droneID)
    // console.log(currAmt)
    
    let information = `droneid=${droneID}&dronetag=${droneTag}&fuel_amount=${fuelAmt.value}`
    
    let refuelSuccess = false

    if (fuelAmt != null) {
        if (currAmt + parseInt(fuelAmt.value) <= 100) {
            for (let i = 0; i < deliveryServiceData.length; i++) {
                if (deliveryServiceData[i]['id'] == droneID
                    && deliveryServiceData[i]['home_base'] == hover) {
                        console.log(`${fuelAmt.value} ${droneID} ${droneTag}`);
                        refuelRequest(information)
                        
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

function loadDroneRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", loadDroneResponse)
    url = "/attempt-load-drone"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}

function loadDroneResponse() {
    clearTable("droneTable")
    clearTable("ingredientTable")
    clearTable("payloadTable");
    displaySelect()
}

function refuelResponse() {
    clearTable("droneTable")
    clearTable("ingredientTable")
    clearTable("payloadTable");
    displaySelect()
}