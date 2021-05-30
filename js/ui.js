// This file handles ui related tasks, usually called from uievents.js


// Clear (empty) the container div, then (re)create a card for each RemoteApp
function recreatecards() {
    document.getElementById("bodycontent").innerHTML = "";

    var sortedremoteapps = configdata["RemoteApps"];
    sortedremoteapps = sortobj(sortedremoteapps);

    for (remoteapp in sortedremoteapps) {
        var appshortname = remoteapp;
        var appname = configdata["RemoteApps"][remoteapp]["Name"];
        var appimage = configdata["RemoteApps"][remoteapp]["Image"];

        if (!appimage) {
            appimage = "";
        };
        // Create a card for each RemoteApp
        makecard(appname, appimage, "downloadrdp('" + appshortname + "');", "clickremoteapppropertiesbutton(event, '" + appshortname + "')");
    }

    // Create cards for "Full desktop session", "New RemoteApp", "Settings"
    makecard("Full desktop session", "img/desktop.png", "downloadrdp();");
    makecard("New RemoteApp", "img/add.png", "clickcreatenewcard()");
    makecard("Settings", "img/settings.png", "clicksettingscard()");
}


// To sort the RemoteApps alphabetically
function sortobj(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, {});
}


// Function to build and append each card that is displayed on the main page
function makecard(cardtitle, imagepath, clickaction, settingsaction = "") {
    if (imagepath == "") {
        imagepath = "img/apppicture.png"
    };
    var settingshtml = "";
    if (settingsaction != "") {
        settingshtml = `
            <div class="settingsicon" onclick="${settingsaction}">
                <i class="large material-icons w3-hover-opacity" style="position: absolute;">settings</i>
            </div>
            `.trim();
    };
    var cardtemplate = `
            <div class="w3-card appcard w3-margin" onclick="${clickaction}">
                ${settingshtml}
                <div class="appimgdiv"><img src="${imagepath}" class="appimg"></div>
                <div class="w3-container">
                    <span class="apptitle">${cardtitle}</span>
                </div>
            </div>
            `;
    $("#bodycontent").append(cardtemplate);
}


// Handles the settings tabs
function openSettingsTab(evt, tabName) {
    var i;
    var x = document.getElementsByClassName("settingstab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    var tablinks = document.getElementsByClassName("settingstablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-dark-grey", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " w3-dark-grey";
}


// Handles the properties tabs
function openPropertiesTab(evt, tabName) {
    var i;
    var x = document.getElementsByClassName("propertiestab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    var tablinks = document.getElementsByClassName("propertiestablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-dark-grey", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " w3-dark-grey";
}


// Show the first Properties tab
function displayfirstpropertiestab() {
    document.getElementById('propertiesmain').click();
}


function showadvancedproperties() {
    $(".advancedproperties").css("display", "");
}


function hideadvancedproperties() {
    $(".advancedproperties").css("display", "none");
    displayfirstpropertiestab();
}


// Allow setting the host address settings manually
function disableautoserveraddress() {
    $("#fulladdress").removeAttr("disabled");
    $("#serverport").removeAttr("disabled");
    $("#altfulladdress").removeAttr("disabled");

    configdata["Connection"]["UseURLAddress"] = false;
}


// Set the server settings based on the browser URL and
// disallow setting the host address settings manually
function enableautoserveraddress() {
    $("#fulladdress").attr("disabled", "disabled");
    $("#serverport").attr("disabled", "disabled");
    $("#altfulladdress").attr("disabled", "disabled");

    fulladdress = window.location.hostname;

    configdata["Connection"]["UseURLAddress"] = true;
    configdata["Connection"]["Address"] = fulladdress;
    configdata["Connection"]["AltAddress"] = fulladdress;
    configdata["Connection"]["ServerPort"] = 3389;

    $("#fulladdress").val(fulladdress);
    $("#serverport").val(3389);
    $("#altfulladdress").val(fulladdress);
}


function validateproperties() {
    var valid = true;
    alertmsg = "";

    if (document.getElementById("fullname").value == "") {
        valid = false;
        alertmsg += "Name must not be blank.\r\n"
    }
    if (document.getElementById("path").value == "") {
        valid = false;
        alertmsg += "Path must not be blank.\r\n"
    }

    if (alertmsg != "") {
        alert(alertmsg);
    }
    
    return valid;
}


function showloader() {
    document.getElementById("loader").style.display = "block";
}


function hideloader(delayseconds = 0.5) {
    setTimeout(function() {
        document.getElementById("loader").style.display = "none";
    }, delayseconds * 1000)
}


async function pastebase64() {
    var clipboardcontents = await navigator.clipboard.readText();
    if (clipboardcontents.startsWith("data:")) {
        document.getElementById("imagesrc").value = clipboardcontents;
        loadimagetopage(clipboardcontents);
    } else {
        alert("The content you are attempting to paste does not appear to be a base64 string.")
    }
}