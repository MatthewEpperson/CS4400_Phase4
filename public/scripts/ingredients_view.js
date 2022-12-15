function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-ingredients-view")
    xhr.send();
}

let ingredientsData = null;
let ingredientTable = null;

function displaySelectHandler() {
    clearTable("ingredientTable2")
    if (this.response.success) {
        console.log("SUCCESSSS")
        if (this.response.ingredientView) {
            let data = this.response.ingredientView;
            ingredientsData = data;
            ingredientTable = this.response.ingredients;
            console.log(ingredientTable)
            // document.getElementById("select_output").innerText = JSON.stringify(this.response.data)     }
            for (let i = 0; i < data.length; i++) {
                populateTable(data[i], "ingredientTable");
            }
            for (let i = 0; i < ingredientTable.length; i++) {
                populateTable(ingredientTable[i], "ingredientTable2")
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
        clearTable("ingredientTable");
        for (const ingredient of ingredientsData) {
            console.log(ingredient);
            if (name != "" && location == "") {
                if (ingredient.ingredient_name == name) {
                    clearTable("ingredientTable");
                    populateTable(ingredient);
                    break;
                }
            }
            if (location != "" && name == "") {
                if (ingredient.location == location) {
                    clearTable("ingredientTable");
                    populateTable(ingredient);
                    break;
                }
            }
            if (location != "" && name != "") {
                if (ingredient.location == location && ingredient.ingredient_name == name) {
                    clearTable("ingredientTable");
                    populateTable(ingredient);
                    break;
                }
            }
            populateTable(ingredient);
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
    for (let i = 0; i < itemKeys.length; i++) {
        let colName = row.insertCell(i);
        let attribute = itemKeys[i];
        colName.innerHTML = items[attribute];
    }

    if (tableName == "ingredientTable2") {
        let colName = row.insertCell(itemKeys.length)
        let btn = document.createElement("button")
        btn.type = 'text'
        btn.innerText = "Remove Ingredient"
        btn.id = `${items['barcode']}`
        btn.onclick = function() {
            removeIngredient(btn.id)
        }
        colName.appendChild(btn)
    }
}



function removeIngredient(barcode) {
    let information = `barcode=${barcode}`
    removeIngredientRequest(information)
    clearTable("ingredientTable2")
    displaySelect()
}


function removeIngredientRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", addIngredientResponse)
    url = "/attempt-remove-ingredient"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}


function addIngredientRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", addIngredientResponse)
    url = "/attempt-add-ingredient"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)
}

function addIngredientResponse() {
    
}

function addIngredient(barcode, name, weight) {
    let information = `barcode=${barcode}&name=${name}&weight=${weight}`
    addIngredientRequest(information)
    clearTable("ingredientTable")
    clearTable("ingredientTable2")
    displaySelect()
}

// document.getElementById('name').onchange = function() {
    //     filterTable();
    // };
    
    // document.getElementById('location').onchange = function() {
        //     filterTable();
        // };
        
        
document.getElementById('submitIngredient').onclick = function() {
    let barcode = document.getElementById('inputBarcode')
    let name = document.getElementById('inputIngredientName')
    let weight = document.getElementById('inputWeight')

    addIngredient(barcode.value, name.value, weight.value)
}

// document.getElementById('clearBtn').onclick = function() {
//     document.getElementById('name').value = "";
//     document.getElementById('location').value = "";
//     clearTable("ingredientTable");
//     displaySelect()
//     filterTable();
// };

document.addEventListener("DOMContentLoaded", function() {
    displaySelect();
  });

// document.getElementById("query_input").addEventListener("click", displaySelect);