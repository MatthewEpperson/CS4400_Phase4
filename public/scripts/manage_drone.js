function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-drones")
    xhr.send();
}

let droneData = null;
let ingredientData = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        console.log(this.response.droness);
        if (this.response.drones && this.response.ingredients) {
            let data = this.response.drones;
            let ingredientData = this.response.ingredients;
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
    const table = document.getElementById("locationTable");

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

    let colName = row.insertCell(itemKeys.length);
    let btn = document.createElement("button");
    colName.appendChild(btn);
}


document.addEventListener("DOMContentLoaded", function() {
    displaySelect();
  });

document.getElementById("query_input").addEventListener("click", displaySelect);