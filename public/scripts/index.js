function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-select")
    xhr.send();
}
function displaySelectHandler() {
    if (this.response.success) {
        if (this.response.quote) {
            document.getElementById("select_output").innerHTML = this.response.quote        }
    } else {
        console.log(this.response.message);
    }
}

document.getElementById("query_input").addEventListener("click", displaySelect)