var authenticated = false;
var user;

getUser()

function getUser() {

    let xml = new XMLHttpRequest
    xml.responseType = "json"
    xml.addEventListener("load", getUserHandler)
    let url = '/get-user'
    xml.open("GET", url)
    xml.send()

}

function getUserHandler() {

    if (this.response.success) {
        console.log(JSON.stringify(this.response))
        user = this.response.user
        check()
    } else {
        console.log(this.response.message)
        check()
    }

}

function check() {
    console.log(JSON.stringify(user))
    console.log(user.type)
    if (user.type) {
        if (user.type == 1) {
            document.getElementById("allow").removeAttribute("hidden")
            document.getElementById("deny").setAttribute("hidden", true)
        }

    } else {
        document.getElementById("deny").removeAttribute("hidden")
        document.getElementById("allow").setAttribute("hidden", true)
    }
}