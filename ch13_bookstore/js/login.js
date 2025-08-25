// if mobile device, increase font size
var str = navigator.userAgent;
var device = "";
if (str.match(/(ipad)|(iphone)|(ipod)|(android)|(webos)/i))
    device = "mobileDevice";
else
    device = "desktopPC";

if (device == "mobileDevice") {
    document.body.style.fontSize = "150%";
}

// enable the disabled buttons
document.getElementById("login_button").removeAttribute("disabled");
document.getElementById("reset").removeAttribute("disabled");

document.getElementById("login_button").onclick = checkUser;

function checkUser() {
    username_in = document.getElementById("username").value;
    password_in = document.getElementById("password").value;

    var localStorage = window.localStorage;
    if (!localStorage) {
        // local storage is not supported by this browser.
        // do nothing
    }
    else {
        numUsers = localStorage.numUsers;

        var login_success = false;
        if (numUsers != undefined) {
            for(i=0;i<numUsers;i++) {
                username = localStorage["user"+i];
                password = localStorage["pass"+i];

                if (username == username_in && password== password_in) {
                    login_success = true;
                    break;
                 }
            }
        }

        if (login_success)
            alert("Login Success!");
        else
            alert("Username and password are not matched with our database!");
    }
}
