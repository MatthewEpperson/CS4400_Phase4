document.getElementById("login_button").addEventListener("click", loginHandler)

function loginHandler() {
    let name = document.getElementById("Name").value
    if (name == 0) {
        document.getElementById("login_message").innerText = "No username entered"
    } else {
        attemptLogin(name)
        document.getElementById("login_message").innerText = ""
    }
}

function attemptLogin(username) {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", attemptLoginHandler)
    let url = `/login-pilot`
    xhr.responseType = "json";   
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(`username=${username}`)
}

function attemptLoginHandler() {
    if (this.response.success) {
        document.getElementById("loginText").setAttribute("hidden", true)
        document.getElementById("login_message").innerText = `Successfully signed in`
        goNext()

    } else {
        document.getElementById("login_message").innerText = "Wrong username or invalid worker username"
    }
}

async function goNext() {
    window.location.href = '/pilotPage';
}