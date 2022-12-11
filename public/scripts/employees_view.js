function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-employee-view")
    xhr.send();
}

document.getElementById("hireSubmit").addEventListener("click", submitHandler)

function submitHandler() {

    let prospective_element = document.getElementById("hireUsernameText")
    let prospective = prospective_element.value
    if (prospective == 0) {
    } else {
        hireEmployee(prospective)
        prospective_element.value = ""
    }

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
    let colName = row.insertCell(itemKeys.length)
    let btn = document.createElement("button")
    btn.id = `${items["username"]}`
    btn.innerText = "Delete Employee"
    btn.onclick = function() {
        fireEmployee(btn.id)
    }

    colName.appendChild(btn)
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

function fireEmployee(username) {
    console.log(username)
    // id = user.id
    let id = "rr"
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", fireHandler)
    xhr.responseType= "json";
    url = "/fire-employee"
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(`username=${username}&id=${id}`);
}

function fireHandler() {
    clearTable("employeeTable")
    displaySelect()
}

function hireEmployee(username) {
    // id = user.id
    console.log("HIRING EMPLOYEE")
    let id = "rr"
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", hireHandler)
    xhr.responseType= "json";
    url = "/hire-employee"
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(`username=${username}&id=${id}`);
}

function hireHandler() {

    if (this.response.message) {
        let message = this.response.message
        document.getElementById("message").value = message
    }


    clearTable("employeeTable")
    displaySelect()
}