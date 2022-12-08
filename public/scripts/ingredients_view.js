function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-ingredients-view")
    xhr.send();
}

let ingredientsData = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        if (this.response.data) {
            let data = this.response.data;
            ingredientsData = data;
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
    let location = document.getElementById('location').value;
    if (ingredientsData != null) {
        clearTable();
        for (const ingredient of ingredientsData) {
            console.log(ingredient);
            if (name != "" && location == "") {
                if (ingredient.ingredient_name == name) {
                    clearTable();
                    populateTable(ingredient);
                    break;
                }
            }
            if (location != "" && name == "") {
                if (ingredient.location == location) {
                    clearTable();
                    populateTable(ingredient);
                    break;
                }
            }
            if (location != "" && name != "") {
                if (ingredient.location == location && ingredient.ingredient_name == name) {
                    clearTable();
                    populateTable(ingredient);
                    break;
                }
            }
            populateTable(ingredient);
        }
    }
    
}


function clearTable() {
    const table = document.getElementById("ingredientTable");

    for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}



function populateTable(items) {
    const table = document.getElementById("ingredientTable");

    let itemKeys = Object.keys(items);
    
    let row = table.insertRow();
    for (let i = 0; i < itemKeys.length; i++) {
        let colName = row.insertCell(i);
        let attribute = itemKeys[i];
        colName.innerHTML = items[attribute];
    }
}


document.getElementById('name').onchange = function() {
    filterTable();
};

document.getElementById('location').onchange = function() {
    filterTable();
};

document.getElementById('clearBtn').onclick = function() {
    document.getElementById('name').value = "";
    document.getElementById('location').value = "";
    clearTable();
    filterTable();
};

document.addEventListener("DOMContentLoaded", function() {
    displaySelect();
  });

document.getElementById("query_input").addEventListener("click", displaySelect);