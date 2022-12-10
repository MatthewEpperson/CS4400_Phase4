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
        currUser = this.response.user.username;
    } else {
        authenticated = false;    }
    check();
}

function check() {
    if (authenticated) {
        document.getElementById("log-out-button").removeAttribute("hidden")
    } else {
        document.getElementById("log-out-button").setAttribute("hidden", true)
    }
}