console.log("file connected")

document.addEventListener('DOMContentLoaded', function() {
    console.log(username);
    var x = document.createElement("a");
    x.href="/";
    x.setAttribute("class", "btn");
    x.setAttribute("id", "home-btn");
    x.setAttribute("onclick", username);
    var y = document.createTextNode("Return to Home Page");
    x.appendChild(y);
    var errorWrapper = document.getElementById("error-wrapper");
    errorWrapper.appendChild(x);
});

