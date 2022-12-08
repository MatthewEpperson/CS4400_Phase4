function displaySelect() {
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", displaySelectHandler)
    xhr.responseType="json";
    xhr.open("GET", "/display-select")
    xhr.send();
}
function displaySelectHandler() {
    if (this.response.success) {
        if (this.response.data) {
            for (let i in this.response.data) {
                document.getElementById("select_output").innerText += JSON.stringify(this.response.data) + '\n'        
            }
        }
    } else {
        console.log(this.response.message);
    }
}

document.getElementById("query_input").addEventListener("click", displaySelect)