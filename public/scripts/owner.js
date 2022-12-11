function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-owner")
    xhr.send();
}

let restaurantData = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        console.log(this.response.restaurants);
        if (this.response.restaurants) {
            let restaurantData = this.response.restaurants;
            for (let i = 0; i < restaurantData.length; i++) {
                populateTable(restaurantData[i], "restaurantTable");
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
            colName.id = items['long_name']
        }
    } else {
        let j = table.rows.length;
        for (let i = 0; i < itemKeys.length; i++) {
            let colName = row.insertCell(j);
            colName.innerHTML = items[attribute]
            j++;
        }
    }

    let colName = row.insertCell(itemKeys.length)

    let btn = document.createElement("button")
    btn.innerText = "Fund"
    btn.id = items['long_name']
    btn.onclick = function() {
        fundRestaurant(btn.id)
    }
    colName.appendChild(btn)
}


function fundRestaurant(restaurant) {
    let ownerName = document.getElementById("inputOwner")
    let information = `owner=${ownerName.value}&longName=${restaurant}`
    fundRestaurantRequest(information)
    clearTable("restaurantTable")
    displaySelect()
}


function fundRestaurantRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", fundRestaurantResponse)
    url = "/attempt-fund-restaurant"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}

function fundRestaurantResponse() {
    
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