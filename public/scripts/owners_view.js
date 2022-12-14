function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-owners-view")
    xhr.send();
}

let ownersViewData = null;
let userData = null;
let restaurantData = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        if (this.response.ownerViewTable) {
            ownersViewData = this.response.ownerViewTable;
            userData = this.response.users;
            restaurantData = this.response.restaurantOwners;
            console.log(restaurantData.length)
            // document.getElementById("select_output").innerText = JSON.stringify(this.response.data)     }
            for (let i = 0; i < ownersViewData.length; i++) {
                populateTable(ownersViewData[i], "ownerTable");
            }

            for (let i = 0; i < userData.length; i++) {
                populateTable(userData[i], "userTable")
            }

            for (let i = 0; i < restaurantData.length; i++) {
                populateTable(restaurantData[i], "ownerTable2")
            }
        }
    } else {
        console.log("FAILURE");
    }
}


function filterTable() {
    let username = document.getElementById('username').value;
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    if (ownersData != null) {
        clearTable("ownerTable");
        for (const owner of ownersData) {
            if (username != "" && firstName == "" && lastName == "") {
                if (owner.username == username) {
                    populateTable(owner, "ownerTable");
                    continue;
                }
            }
            if (lastName != "" && username == "" && firstName == "") {
                if (owner.last_name == lastName) {
                    populateTable(owner, "ownerTable");
                    continue;
                }
            }
            if (firstName != "" && username == "" && lastName == "") {
                if (owner.first_name == firstName) {
                    populateTable(owner, "ownerTable");
                    continue;
                }
            }
            if (lastName != "" && firstName != "" && username == "") {
                if (owner.last_name == lastName && owner.first_name == firstName) {
                    populateTable(owner, "ownerTable");
                    continue;
                }
            }

            if (lastName != "" && firstName != "" && username != "") {
                if (owner.last_name == lastName && owner.first_name == firstName && owner.username == username) {
                    populateTable(owner, "ownerTable");
                    continue;
                }
            }

            if (firstName == "" && username == "" && lastName == "") {
                populateTable(owner, "ownerTable");
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


document.getElementById('username').onchange = function() {
    filterTable();
};

document.getElementById('firstName').onchange = function() {
    filterTable();
};

document.getElementById('lastName').onchange = function() {
    filterTable();
};

document.getElementById('clearBtn').onclick = function() {
    document.getElementById('username').value = "";
    document.getElementById('firstName').value = "";
    document.getElementById('lastName').value = "";
    clearTable();
    filterTable();
};

document.addEventListener("DOMContentLoaded", function() {
    displaySelect();
  });


document.getElementById("addOwnerBtn").onclick = function() {
    let username = document.getElementById("username")
    let fName = document.getElementById("firstName")
    let lName = document.getElementById("lastName")
    let address = document.getElementById("inputAddress")
    let birthdate = document.getElementById("inputBirthdate")

    addOwner(username.value, fName.value, lName.value, address.value, birthdate.value)
}

function addOwner(username, fName, lName, address, birthdate) {
    let information = `username=${username}&fName=${fName}&lName=${lName}&address=${address}&birthdate=${birthdate}`

    addOwnerRequest(information)
}

function addOwnerRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", addOwnerResponse)
    url = "/attempt-add-owner"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
    clearTable("ownerTable")
    clearTable("ownerTable2")
    clearTable("userTable")
    displaySelect()
}

function addOwnerResponse() {
    
}

// document.getElementById("query_input").addEventListener("click", displaySelect);
// adding start_funding() functionality

document.getElementById("fundBtn").onclick = function() {
    let usernameOwner = document.getElementById("usernameOwner")
    let rName = document.getElementById("restName")

    addOwner(usernameOwner.value, rName.value)
}

function fundRestaurant(usernameOwner, rName) {
    let information = `usernameOwner=${usernameOwner}&rName=${rName}`

    fundRequest(information)
}

function fundRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", fundResponse)
    url = "/attempt-fund-restaurant"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
    clearTable("ownerTable")
    clearTable("ownerTable2")
    clearTable("userTable")
    displaySelect()
}

function fundResponse() {
    
}