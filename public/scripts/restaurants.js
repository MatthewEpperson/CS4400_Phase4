function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-restaurants")
    xhr.send();
}

let restaurantData = null;
let droneData = null;
let payloadData = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        console.log(this.response.restaurants);
        if (this.response.restaurants) {
            restaurantData = this.response.restaurants;
            droneData = this.response.drones;
            payloadData = this.response.payloads;
        
            for (let i = 0; i < restaurantData.length; i++) {
                populateTable(restaurantData[i], "restaurantTable");
            }
            for (let i = 0; i < droneData.length; i++) {
                populateTable(droneData[i], "droneTable")
            }
            for (let i = 0; i < payloadData.length; i++) {
                populateTable(payloadData[i], "payloadTable")
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
            colName.innerHTML = items[attribute];
        }
    } else {
        let j = table.rows.length;
        for (let i = 0; i < itemKeys.length; i++) {
            let colName = row.insertCell(j);
            colName.innerHTML = items[attribute]
            j++;
        }
    }

    if (tableName == "payloadTable") {
        let colName = row.insertCell(itemKeys.length)
        let btn = document.createElement("button")
        btn.id = `${items['barcode']} ${items['id']} ${items['tag']}`
        btn.innerText = "Purchase Ingredient"
        btn.onclick = function() {
            purchaseIngredient(btn.id)
        }
        colName.appendChild(btn)
    }
}


function purchaseIngredient(restaurant) {
    let rSplit = restaurant.split(" ")

    let barcode = rSplit[0]
    let droneID = rSplit[1]
    let droneTag = rSplit[2]

    let restaurantName = document.getElementById("inputRestaurant")
    let quantity = document.getElementById("inputQuantity")

    if (quantity.value < 0) {
        alert("Cannot purchase negative quantity of ingredients!")
        return
    }

    let validRName = false
    let droneValid = false
    let droneCapacity = false

    for (let i = 0; i < restaurantData.length; i++) {
        if (restaurantData[i]['long_name'] == restaurantName.value) {
            validRName = true
        }

        for (let j = 0; j < droneData.length; j++) {
            if (droneData[j]['tag'] == droneTag && droneData[j]['id'] == droneID
                && droneData[j]['hover'] == restaurantData[i]['location']) {
                    droneValid = true
                }
        }
    }

    for (let i = 0; i < payloadData.length; i++) {
        if (payloadData[i]['id'] == droneID && payloadData[i]['tag'] == droneTag) {
            if (payloadData[i]['quantity'] >= quantity.value) {
                droneCapacity = true
            }
        }
    }


    if (validRName == false) {
        alert("Restaurant name is invalid or not found!")
        return
    }

    if (droneValid == false) {
        alert("Drone is either not at restaurant location or drone was not found!")
        return
    }

    if (droneCapacity == false) {
        alert("Drone did not have enough items for the amount you wish to purchase!")
        return
    }

    let information = `restaurant=${restaurantName.value}&droneID=${droneID}&droneTag=${droneTag}` +
                        `&barcode=${barcode}&quantity=${quantity.value}`

    purchaseIngredientRequest(information)
    clearTable("payloadTable")
    clearTable("restaurantTable")
    clearTable("droneTable")
    displaySelect()
}


function purchaseIngredientRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", purchaseIngredientResponse)
    url = "/attempt-purchase-ingredient"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}

function purchaseIngredientResponse() {
    
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