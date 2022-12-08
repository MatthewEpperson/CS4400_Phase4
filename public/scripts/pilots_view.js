function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-pilots-view")
    xhr.send();
}

let pilotData = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        if (this.response.data) {
            let data = this.response.data;
            pilotData = data;
            // document.getElementById("select_output").innerText = JSON.stringify(this.response.data)     }
            for (let i = 0; i < data.length; i++) {
                populateTable(data[i]);
            }
        }
    } else {
        console.log("FAILURE");
        console.log(this.response.message);
    }
}


function filterTable() {
    let username = document.getElementById('username').value;
    let licenseID = document.getElementById('licenseID').value;
    if (pilotData != null) {
        clearTable();
        for (const pilot of pilotData) {
            if (username != "" && licenseID == "") {
                if (pilot.username == username) {
                    populateTable(pilot);
                    continue;
                }
            }
            if (licenseID != "" && username == "") {
                if (pilot.licenseID == licenseID) {
                    populateTable(pilot);
                    continue;
                }
            }
            if (licenseID != "" && username != "") {
                if (pilot.licenseID == licenseID && pilot.username == username) {
                    populateTable(pilot);
                    continue;
                }
            }
            if (licenseID == "" && username == "") {
                populateTable(pilot);
            }
        }
    }
    
}


function clearTable() {
    const table = document.getElementById("pilotTable");

    for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}


function populateTable(items) {
    console.log(items);
    const table = document.getElementById("pilotTable");

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
}


document.getElementById('username').onchange = function() {
    filterTable();
};

document.getElementById('licenseID').onchange = function() {
    filterTable();
};

document.getElementById('clearBtn').onclick = function() {
    document.getElementById('username').value = "";
    document.getElementById('licenseID').value = "";
    clearTable();
    filterTable();
};

document.addEventListener("DOMContentLoaded", function() {
    displaySelect();
  });

document.getElementById("query_input").addEventListener("click", displaySelect);