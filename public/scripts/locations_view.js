function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-locations-view")
    xhr.send();
}

let locationsData = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        if (this.response.data) {
            let data = this.response.data;
            locationsData = data;
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
    let name = document.getElementById('name').value;
    let drones = document.getElementById('drones').value;
    if (locationsData != null) {
        clearTable();
        for (const location of locationsData) {
            if (name != "" && drones == "") {
                if (location.label == name) {
                    clearTable();
                    populateTable(location);
                    continue;
                }
            }
            if (drones != "" && name == "") {
                if (location.num_drones == drones) {
                    populateTable(location);
                    continue;
                }
            }
            if (drones != "" && name != "") {
                if (location.label == name && location.num_drones == drones) {
                    populateTable(location);
                    continue;
                }
            }
            if (name == "" && drones == "") {
                populateTable(location);
            }
        }
    }
    
}

function clearTable() {
    const table = document.getElementById("locationTable");

    for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}


function populateTable(items) {
    const table = document.getElementById("locationTable");

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


document.getElementById('name').onchange = function() {
    filterTable();
};

document.getElementById('drones').onchange = function() {
    filterTable();
};

document.getElementById('clearBtn').onclick = function() {
    document.getElementById('name').value = "";
    document.getElementById('drones').value = "";
    clearTable();
    filterTable();
};

document.addEventListener("DOMContentLoaded", function() {
    displaySelect();
  });

document.getElementById("query_input").addEventListener("click", displaySelect);