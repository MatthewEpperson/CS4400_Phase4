function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-services-view")
    xhr.send();
}

let serviceData = null;
let serviceTable = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        if (this.response.services) {
            serviceData = this.response.serviceViewData
            serviceTable = this.response.services
            // document.getElementById("select_output").innerText = JSON.stringify(this.response.data)     }
            for (let i = 0; i < serviceData.length; i++) {
                populateTable(serviceData[i], "serviceTable");
            }
            for (let i = 0; i < serviceTable.length; i++) {
                populateTable(serviceTable[i], "serviceTable2")
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
        clearTable("serviceTable");
        for (const service of serviceData) {
            if (serviceID != "" && manager == "" && name == "") {
                if (service.id == serviceID) {
                    populateTable(service, "serviceTable");
                    continue;
                }
            }
            if (manager != "" && serviceID == "" && name == "") {
                if (service.manager == manager) {
                    populateTable(service, "serviceTable");
                    continue;
                }
            }
            if (name != "" && serviceID == "" && manager == "") {
                if (service.long_name == name) {
                    populateTable(service, "serviceTable");
                    continue;
                }
            }
            if (name == "" && serviceID == "" && manager == "") {
                populateTable(service, "serviceTable");
            }
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
    console.log(items);
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
    clearTable("serviceTable");
    filterTable();
};

document.addEventListener("DOMContentLoaded", function() {
    displaySelect();
  });


document.getElementById("addServiceBtn").onclick = function() {
    let serviceID = document.getElementById("serviceID")
    let serviceName = document.getElementById("serviceName")
    let homeBase = document.getElementById("homebaseInput")
    let manager = document.getElementById("serviceManager")

    addService(serviceID.value, serviceName.value, homeBase.value, manager.value)
}


function addService(serviceID, serviceName, homeBase, manager) {
    let information = `serviceID=${serviceID}&serviceName=${serviceName}&homeBase=${homeBase}&manager=${manager}`
    addServiceRequest(information)
}

function addServiceRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", addServiceResponse)
    url = "/attempt-add-service"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
    clearTable("serviceTable2")
    displaySelect()
}

function addServiceResponse() {

}

document.addEventListener("DOMContentLoaded", displaySelect);