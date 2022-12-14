function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-employee-view")
    xhr.send();
}

document.getElementById("hireSubmit").addEventListener("click", submitHandler)

function submitHandler() {

    let prospective_element = document.getElementById("username_hire")
    let prospective = prospective_element.value
    if (prospective == 0) {
    } else {
        hireEmployee()
        prospective_element.value = ""
    }

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
            console.log(workerData)
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


// function filterTable() {
//     let username = document.getElementById('username').value;
//     let taxID = document.getElementById('taxID').value;
//     if (employeeData != null) {
//         for (const employee of employeeData) {
//             console.log(employee);
//             if (username != "" && taxID == "") {
//                 if (employee.username == username) {
//                     clearTable("employeeTable");
//                     populateTable(employee);
//                     break;
//                 }
//             }
//             if (taxID != "" && username == "") {
//                 if (employee.taxID == taxID) {
//                     clearTable("employeeTable");
//                     populateTable(employee);
//                     break;
//                 }
//             }
//             if (taxID != "" && username != "") {
//                 if (employee.taxID == taxID && employee.username == username) {
//                     clearTable("employeeTable");
//                     populateTable(employee);
//                     break;
//                 }
//             }
//             populateTable(employee);
//         }
//     }
    
// }


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
    let username = document.getElementById("username_add_pilot")
    let licenseID = document.getElementById("inputLicenseID")
    let experience = document.getElementById("inputExperience")

    addPilotRole(username.value, licenseID.value, experience.value)
    clearTable("pilotTable")
    clearTable("workerTable")
    clearTable("employeeTable")
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
    clearTable("pilotTable")
    clearTable("workerTable")
    clearTable("employeeTable")
    displaySelect()

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
    clearTable("employeeTable")
    clearTable("pilotTable")
    clearTable("workerTable")
    displaySelect()
}


document.getElementById("removePilotRole").onclick = function() {
    let username = document.getElementById("username_remove_pilot")

    removePilotRole(username.value)
    clearTable("pilotTable")
    clearTable("employeeTable")
    clearTable("workerTable")
    displaySelect()
}


document.getElementById("addWorkerRole").onclick = function() {
    let username = document.getElementById("username_add_worker")

    addWorkerRole(username.value)
    clearTable("workerTable")
    clearTable("employeeTable")
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


// document.getElementById('username').onchange = function() {
//     filterTable();
// };

// document.getElementById('taxID').onchange = function() {
//     filterTable();
// };

document.addEventListener("DOMContentLoaded", function() {
    // user = getUser()
    // displaySelect();
    displaySelect()

});

document.getElementById("fireSubmit").addEventListener("click", fireEmployee) 

function fireEmployee() {
    let username = document.getElementById("username_fire").value
    let id = document.getElementById("serviceID_fire").value
    
    if (username.length == 0 || id.length == 0) {
        return
    }

    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", fireHandler)
    xhr.responseType= "json";
    url = "/fire-employee"
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(`username=${username}&id=${id}`);
}

function fireHandler() {
    clearTable("employeeTable");
    clearTable("workerTable")
    clearTable("pilotTable")

    displaySelect()
}

function hireEmployee() {
    // id = user.id
    console.log("HIRING EMPLOYEE")
    let username = document.getElementById("username_hire").value
    let id = document.getElementById("serviceID_hire").value
    
    if (username.length == 0 || id.length == 0) {
        console.log(`invalid username or serviceID`)
        return
    }

    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", hireHandler)
    xhr.responseType= "json";
    url = "/hire-employee"
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(`username=${username}&id=${id}`);
}

function hireHandler() {

    if (this.response.success) {
        console.log(this.response.message)
        clearTable("employeeTable");
        clearTable("workerTable")
        clearTable("pilotTable")
    
        displaySelect()
    } else if (this.response.success == false) {
        console.log(this.response.message)
    }


}

// adding add_employe() functionality

document.getElementById("add_employee_submit").addEventListener("click", register)


function getQuery() {
    let result = ""
    result += `username=${username.value}&`
    result += `fname=${document.getElementById("first_name_input").value}&`
    result += `lname=${document.getElementById("last_name_input").value}&`
    result += `address=${document.getElementById("address_input").value}&`
    result += `bdate=${document.getElementById("date_input").value}&`
    result += `hdate=${document.getElementById("hire_date_input").value}&`
    result += `salary=${document.getElementById("salary_input").value}&`
    result += `experience=${document.getElementById("experience_input").value}&`
    result += `taxID=${document.getElementById("tax_input").value}`
    return result

}

let username = document.getElementById("username_input")


function register(event){
    console.log("Register button clicked....");
    event.preventDefault()
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", responseHandler)
    query=getQuery()
    console.log(`Query: ${query}`);
    url = `/add-employee`
    xhr.responseType = "json";   
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    console.log("POST request to server....");
    xhr.send(query)
}

function responseHandler(){
    console.log("POST response from server....");
    clearTable("employeeTable")
    displaySelect()
    
}

document.getElementById('clearBtn1').onclick = function() {
    const inputs = document.querySelectorAll('.inp1')
    inputs.forEach(input => {
        input.value = ''
    })

    clearTable("employeeTable");
    clearTable("workerTable")
    clearTable("pilotTable")
    displaySelect()
    filterTable();
};
document.getElementById('clearBtn2').onclick = function() {
    const inputs = document.querySelectorAll('.inp2')
    inputs.forEach(input => {
        input.value = ''
    })

    clearTable("employeeTable");
    clearTable("workerTable")
    clearTable("pilotTable")
    displaySelect()
    filterTable();
};
document.getElementById('clearBtn3').onclick = function() {
    const inputs = document.querySelectorAll('.inp3')
    inputs.forEach(input => {
        input.value = ''
    })

    clearTable("employeeTable");
    clearTable("workerTable")
    clearTable("pilotTable")
    displaySelect()
    filterTable();
};
document.getElementById('clearBtn4').onclick = function() {
    const inputs = document.querySelectorAll('.inp4')
    inputs.forEach(input => {
        input.value = ''
    })

    clearTable("employeeTable");
    clearTable("workerTable")
    clearTable("pilotTable")
    displaySelect()
    filterTable();
};
document.getElementById('clearBtn5').onclick = function() {
    const inputs = document.querySelectorAll('.inp5')
    inputs.forEach(input => {
        input.value = ''
    })

    clearTable("employeeTable");
    clearTable("workerTable")
    clearTable("pilotTable")
    displaySelect()
    filterTable();
};
document.getElementById('clearBtn6').onclick = function() {
    const inputs = document.querySelectorAll('.inp6')
    inputs.forEach(input => {
        input.value = ''
    })

    clearTable("employeeTable");
    clearTable("workerTable")
    clearTable("pilotTable")
    displaySelect()
    filterTable();
};