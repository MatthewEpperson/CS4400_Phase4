function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-employee-view")
    xhr.send();
}

let employeeData = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        if (this.response.data) {
            let data = this.response.data;
            employeeData = data;
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
    let taxID = document.getElementById('taxID').value;
    if (employeeData != null) {
        for (const employee of employeeData) {
            console.log(employee);
            if (username != "" && taxID == "") {
                if (employee.username == username) {
                    clearTable();
                    populateTable(employee);
                    break;
                }
            }
            if (taxID != "" && username == "") {
                if (employee.taxID == taxID) {
                    clearTable();
                    populateTable(employee);
                    break;
                }
            }
            if (taxID != "" && username != "") {
                if (employee.taxID == taxID && employee.username == username) {
                    clearTable();
                    populateTable(employee);
                    break;
                }
            }
            populateTable(employee);
        }
    }
    
}


function clearTable() {
    const table = document.getElementById("employeeTable");

    for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}



function populateTable(items) {
    const table = document.getElementById("employeeTable");

    let itemKeys = Object.keys(items);
    
    let row = table.insertRow();
    for (let i = 0; i < itemKeys.length; i++) {
        let colName = row.insertCell(i);
        let attribute = itemKeys[i];
        if (attribute == "hired") {
            colName.innerHTML = items[attribute].substring(0, 10);
            continue;
        }
        colName.innerHTML = items[attribute];
    }
}


document.getElementById('username').onchange = function() {
    filterTable();
};

document.getElementById('taxID').onchange = function() {
    filterTable();
};

document.getElementById('clearBtn').onclick = function() {
    document.getElementById('username').value = "";
    document.getElementById('taxID').value = "";
    clearTable();
    filterTable();
};

document.addEventListener("DOMContentLoaded", function() {
    displaySelect();
  });

document.getElementById("query_input").addEventListener("click", displaySelect);