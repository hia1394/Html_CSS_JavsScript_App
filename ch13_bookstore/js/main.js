// if mobile device, increase font size
var str = navigator.userAgent;
var device = "";
if (str.match(/(ipad)|(iphone)|(ipod)|(android)|(webos)/i))
    device = "mobileDevice";
else
    device = "desktopPC";

if (device == "mobileDevice") {
    document.body.style.fontSize = "150%";
    document.getElementsByTagName("nav")[0].style.fontSize = "120%";
}


// enable the disabled buttons
document.getElementById("save_favorite").removeAttribute("disabled");
document.getElementById("view_favorite").removeAttribute("disabled");
document.getElementById("memo").removeAttribute("disabled");
document.getElementById("location").removeAttribute("disabled");

document.getElementById("location").onclick = showMap;
document.getElementById("memo").onclick = memoCanvas;
document.getElementById("save_favorite").onclick = saveFavorite;
document.getElementById("view_favorite").onclick = viewFavorite;

function showMap() {
    dom = document.getElementsByName("display_area");
    dom[0].src = "show_map.html";
}

function memoCanvas() {
    dom = document.getElementsByName("display_area");
    dom[0].src = "memo_canvas.html";
}

function saveFavorite() {
    dom = document.getElementsByName("display_area");
    dom[0].src = "save_favorite.html";
}
function viewFavorite() {
    dom = document.getElementsByName("display_area");
    dom[0].src = "view_favorite.html";
}
