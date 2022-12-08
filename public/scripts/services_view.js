function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-services-view")
    xhr.send();
}

let serviceData = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        if (this.response.data) {
            let data = this.response.data;
            serviceData = data;
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
    let serviceID = document.getElementById('serviceID').value;
    let manager = document.getElementById('serviceManager').value;
    let name = document.getElementById('serviceName').value;
    if (serviceData != null) {
        clearTable();
        for (const service of serviceData) {
            if (serviceID != "" && manager == "" && name == "") {
                if (service.id == serviceID) {
                    populateTable(service);
                    continue;
                }
            }
            if (manager != "" && serviceID == "" && name == "") {
                if (service.manager == manager) {
                    populateTable(service);
                    continue;
                }
            }
            if (name != "" && serviceID == "" && manager == "") {
                if (service.long_name == name) {
                    populateTable(service);
                    continue;
                }
            }
            if (name == "" && serviceID == "" && manager == "") {
                populateTable(service);
            }
        }
    }
    
}


function clearTable() {
    const table = document.getElementById("serviceTable");

    for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}


function populateTable(items) {
    console.log(items);
    const table = document.getElementById("serviceTable");

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


document.getElementById('serviceID').onchange = function() {
    filterTable();
};

document.getElementById('serviceManager').onchange = function() {
    filterTable();
};

document.getElementById('serviceName').onchange = function() {
    filterTable();
};

document.getElementById('clearBtn').onclick = function() {
    document.getElementById('serviceManager').value = "";
    document.getElementById('serviceID').value = "";
    document.getElementById('serviceName').value = "";
    clearTable();
    filterTable();
};

document.addEventListener("DOMContentLoaded", function() {
    displaySelect();
  });

document.getElementById("query_input").addEventListener("click", displaySelect);