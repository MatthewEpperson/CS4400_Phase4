function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-owners-view")
    xhr.send();
}

let ownersData = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        if (this.response.data) {
            let data = this.response.data;
            ownersData = data;
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
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    if (ownersData != null) {
        clearTable();
        for (const owner of ownersData) {
            if (username != "" && firstName == "" && lastName == "") {
                if (owner.username == username) {
                    populateTable(owner);
                    continue;
                }
            }
            if (lastName != "" && username == "" && firstName == "") {
                if (owner.last_name == lastName) {
                    populateTable(owner);
                    continue;
                }
            }
            if (firstName != "" && username == "" && lastName == "") {
                if (owner.first_name == firstName) {
                    populateTable(owner);
                    continue;
                }
            }
            if (lastName != "" && firstName != "" && username == "") {
                if (owner.last_name == lastName && owner.first_name == firstName) {
                    populateTable(owner);
                    continue;
                }
            }

            if (lastName != "" && firstName != "" && username != "") {
                if (owner.last_name == lastName && owner.first_name == firstName && owner.username == username) {
                    populateTable(owner);
                    continue;
                }
            }

            if (firstName == "" && username == "" && lastName == "") {
                populateTable(owner);
            }
        }
    }
    
}


function clearTable() {
    const table = document.getElementById("ownerTable");

    for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}


function populateTable(items) {
    console.log(items);
    const table = document.getElementById("ownerTable");

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

document.getElementById("query_input").addEventListener("click", displaySelect);