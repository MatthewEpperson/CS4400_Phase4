function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-locations-view")
    xhr.send();
}

let locationsData = null;
let locations = null;

function displaySelectHandler() {
    if (this.response.success) {
        console.log("SUCCESSSS");
        if (this.response.locationViews) {
            locationsData = this.response.locationViews
            locations = this.response.locations
            // document.getElementById("select_output").innerText = JSON.stringify(this.response.data)     }
            for (let i = 0; i < locationsData.length; i++) {
                populateTable(locationsData[i], "locationTable");
            }
            for (let i = 0; i < locations.length; i++) {
                populateTable(locations[i], "locationTable2")
            }
        }
    } else {
        console.log("FAILURE");
        console.log(this.response.message);
    }
}


function filterTable() {
    let name = document.getElementById('name').value;
    let drones = document.getElementById('drones').value;
    if (locationsData != null) {
        clearTable();
        for (const location of locationsData) {
            if (name != "" && drones == "") {
                if (location.label == name) {
                    clearTable("locationTable");
                    populateTable(location, "locationTable");
                    continue;
                }
            }
            if (drones != "" && name == "") {
                if (location.num_drones == drones) {
                    populateTable(location, "locationTable");
                    continue;
                }
            }
            if (drones != "" && name != "") {
                if (location.label == name && location.num_drones == drones) {
                    populateTable(location, "locationTable");
                    continue;
                }
            }
            if (name == "" && drones == "") {
                populateTable(location, "locationTable");
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


document.getElementById("addLocationBtn").onclick = function() {
    let label = document.getElementById("name")
    let xCoord = document.getElementById("xCoordInput")
    let yCoord = document.getElementById("yCoordInput")
    let space = document.getElementById("spaceInput")

    addLocation(label.value, xCoord.value, yCoord.value, space.value)
}


function addLocation(name, xCoord, yCoord, space) {
    let information = `label=${name}&xcoord=${xCoord}&ycoord=${yCoord}&space=${space}`
    console.log(information)
    addLocationRequest(information)
}


function addLocationRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", addLocationResponse)
    url = "/attempt-add-location"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)

    clearTable("locationTable")
    clearTable("locationTable2")
    displaySelect()
}

function addLocationResponse() {

}


// document.getElementById('name').onchange = function() {
//     filterTable();
// };

// document.getElementById('drones').onchange = function() {
//     filterTable();
// };

document.getElementById('clearBtn').onclick = function() {
    document.getElementById('name').value = "";
    document.getElementById('drones').value = "";
    clearTable("locationTable");
    displaySelect();

    // filterTable();
};

document.addEventListener("DOMContentLoaded", function() {
    displaySelect();
  });

//document.getElementById("query_input").addEventListener("click", displaySelect);


///add_restaurant

document.getElementById("addRestBtn").onclick = function() {
    let restNameIn = document.getElementById("restName")
    let ratingIn = document.getElementById("rating")
    let spentIn = document.getElementById("spent")
    let locationIn = document.getElementById("location")

    addLocation(restNameIn.value, ratingIn.value, spentIn.value, locationIn.value)
}


function addLocation(restNameIn, ratingIn, spentIn, locationIn) {
    let information = `rName=${restNameIn}&inRating=${ratingIn}&inSpent=${spentIn}&inLocation=${locationIn}`
    addRestaurantRequest(information)
}


function addRestaurantRequest(information) {
    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", addRestaurantResponse)
    url = "/attempt-add-restaurant"
    
    xml.open("POST", url)
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xml.send(information)

    clearTable("locationTable")
    clearTable("locationTable2")
    displaySelect()
}

function addRestaurantResponse() {

}