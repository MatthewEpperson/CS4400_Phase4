function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-employee-view")
    xhr.send();
}

let employeeData = null;
let workerData = null;
let pilotData = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        if (this.response.employees) {
            employeeData = this.response.employees
            workerData = this.response.workers
            pilotData = this.response.pilots
            // document.getElementById("select_output").innerText = JSON.stringify(this.response.data)     }
            for (let i = 0; i < employeeData.length; i++) {
                populateTable(employeeData[i], "employeeTable");
            }

            for (let i = 0; i < workerData.length; i++) {
                populateTable(workerData[i], "workerTable")
            }

            for (let i = 0; i < pilotData.length; i++) {
                populateTable(pilotData[i], "pilotTable")
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
                    clearTable("employeeTable");
                    populateTable(employee);
                    break;
                }
            }
            if (taxID != "" && username == "") {
                if (employee.taxID == taxID) {
                    clearTable("employeeTable");
                    populateTable(employee);
                    break;
                }
            }
            if (taxID != "" && username != "") {
                if (employee.taxID == taxID && employee.username == username) {
                    clearTable("employeeTable");
                    populateTable(employee);
                    break;
                }
            }
            populateTable(employee);
        }
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
    if (tableName == 'employeeTable') {
        for (let i = 0; i < itemKeys.length; i++) {
            let colName = row.insertCell(i);
            let attribute = itemKeys[i];
            if (attribute == "hired") {
                colName.innerHTML = items[attribute].substring(0, 10);
                continue;
            }
            colName.innerHTML = items[attribute];
        }
    } else {
        for (let i = 0; i < itemKeys.length; i++) {
            let colName = row.insertCell(i);
            let attribute = itemKeys[i];
            colName.innerHTML = items[attribute];
        }
    }
}

document.getElementById("addPilotRole").onclick = function() {
    let username = document.getElementById("username")
    let licenseID = document.getElementById("inputLicenseID")
    let experience = document.getElementById("inputExperience")

    addPilotRole(username.value, licenseID.value, experience.value)
    clearTable("pilotTable")
    clearTable("workerTable")
    displaySelect()
}


function addPilotRole(username, licenseID, experience) {
    let information = `username=${username}&licenseID=${licenseID}&experience=${experience}`
    addPilotRoleRequest(information)
}


function addPilotRoleRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", addPilotRoleResponse)
    url = "/attempt-add-pilot-role"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}


function addPilotRoleResponse() {

}


function removePilotRole(username) {
    let information = `username=${username}`
    removePilotRoleRequest(information)
}

function removePilotRoleRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", removePilotRoleResponse)
    url = "/attempt-remove-pilot-role"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}

function removePilotRoleResponse() {

}


document.getElementById("removePilotRole").onclick = function() {
    let username = document.getElementById("username")

    removePilotRole(username.value)
    clearTable("pilotTable")
    clearTable("workerTable")
    displaySelect()
}


document.getElementById("addWorkerRole").onclick = function() {
    let username = document.getElementById("username")

    addWorkerRole(username.value)
    clearTable("workerTable")
    clearTable("pilotTable")
    displaySelect()
}


function addWorkerRole(username) {
    let information = `username=${username}`
    addWorkerRoleRequest(information)
}


function addWorkerRoleRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", addWorkerRoleResponse)
    url = "/attempt-add-worker-role"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}

function addWorkerRoleResponse(information) {
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
    document.getElementById('inputLicenseID').value = "";
    document.getElementById('inputExperience').value = "";
    clearTable("employeeTable");
    clearTable("workerTable")
    clearTable("pilotTable")
    displaySelect()
    filterTable();
};

document.addEventListener("DOMContentLoaded", function() {
    displaySelect();
  });

// document.getElementById("query_input").addEventListener("click", displaySelect);