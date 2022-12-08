<<<<<<< HEAD
let currUser;
let authenticated = false;


document.addEventListener("DOMContentLoaded", (event) => {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", authenticator)
    url = `/checkedLoggedIn`
    xhr.responseType = "json";   
    xhr.open("GET", url)
    console.log("GET /checkedLoggedIn request to server....");
    xhr.send();
});
document.getElementById("log-out-button").addEventListener("click", function(event) {
    authenticated = false;
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", serverCheck)
    url = `/update-authenticated`
    xhr.responseType = "json";   
    xhr.open("GET", url)
    xhr.send();
    currUser = "Should not see";
    check();
})



function serverCheck() {
    if (this.response.success) {
        console.log("good response from update-authenticated");
    } else {
        console.log("bad response from update-authenticated");
    }
}

function authenticator() {
    if (this.response.success) {
        authenticated = true;
        currUser = this.response.user;
    } else {
        authenticated = false;    }
    check();
}

function check() {
    if (authenticated) {
        document.getElementById("registration_form").setAttribute("hidden", true);
        document.getElementById("log-out-button").removeAttribute("hidden");
    } else {
        document.getElementById("registration_form").removeAttribute("hidden");
        document.getElementById("log-out-button").setAttribute("hidden", true)
    }
}
=======
>>>>>>> f16d033 (initial changes for registration)
let select_input = document.getElementById("type_input")
select_input.onchange = selectHandler
let form = document.getElementById("registration_form")
document.getElementById("submit_button").addEventListener("click", register)
var selected;


function selectHandler(event) {
    
    selected = select_input.value
    const e_label = document.getElementById("experience_label")
    const t_label = document.getElementById("tax_label")

    const e_input = document.getElementById("experience_input")
    const t_input = document.getElementById("tax_input")
        
    let lis = []

    lis.push(e_label)
    lis.push(t_label)
    lis.push(e_input)
    lis.push(t_input)

    if (selected === "Employee") {
        displayEmployee(lis)
    } else if (selected === "Owner") {
        displayOwner(lis)
    }
}

function displayEmployee(lis) {
    if (selected === "Employee") {
        lis.forEach(removeHidden)
    }
}

function removeHidden(item) {
    item.removeAttribute("hidden")
}

function addHidden(item) {
    item.setAttribute("hidden", true)
}

function displayOwner(lis) {
    if (selected === "Owner") {
        lis.forEach(addHidden)
    }
}

let username = document.getElementById("username_input")


function register(event){
    console.log("Register button clicked....");
    event.preventDefault()
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", responseHandler)
    query=getQuery()
    console.log(`Query: ${query}`);
    url = `/attempt-register`
    xhr.responseType = "json";   
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    console.log("POST request to server....");
    xhr.send(query)
}

function responseHandler(){
    console.log("POST response from server....");
    let message = document.getElementById("message")
    message.style.display = "block"
    if (this.response.success){
        message.innerText = this.response.message;
<<<<<<< HEAD
        authenticated = true;
        check();
=======
        // authenticated = true;
        // check();
>>>>>>> f16d033 (initial changes for registration)
    } else{
        message.innerText = this.response.message;
        authenticated = false;
    }
}

function getQuery() {
<<<<<<< HEAD
    let result = `type=${selected}&`
    result += `username=${username.value}&`
    result += `fname=${document.getElementById("first_name_input").value}&`
    result += `lname=${document.getElementById("last_name_input").value}&`
    result += `address=${document.getElementById("address_input").value}&`
=======
    let result = ``
    result += `username=${username.value}&`
    result += `fname=${document.getElementById("first_name_input").value}&`
    result += `lname=${document.getElementById("last_name_input").value}&`
    result += `address=${document.getElementById("address_input")}&`
>>>>>>> f16d033 (initial changes for registration)
    result += `bdate=${document.getElementById("date_input").value}`

    if (selected === "Owner") {
        return result
    } else {
        result += `&experience=${document.getElementById("experience_input").value}`
<<<<<<< HEAD
        result += `&taxID=${document.getElementById("tax_input").value}`
=======
        result += `&tax_label=${document.getElementById("tax_input").value}`
>>>>>>> f16d033 (initial changes for registration)
        return result
    }
}
