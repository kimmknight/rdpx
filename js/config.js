// Initiate the config download from the server.
// This includes all remoteapps, settings and data for this app.

readfromserver();

var configdata = {};


function loadsettings() {
    document.getElementById("rdpenabled").checked = configdata["Host"]["RdpDisabled"] ^ 1;

    document.getElementById("useurladdress").checked = configdata["Connection"]["UseURLAddress"];
    document.getElementById("fulladdress").value = configdata["Connection"]["Address"];
    document.getElementById("altfulladdress").value = configdata["Connection"]["AltAddress"];
    document.getElementById("serverport").value = configdata["Connection"]["ServerPort"];

    document.getElementById("gatewayuse").checked = configdata["Connection"]["Gateway"]["UseGateway"];
    document.getElementById("gatewayaddress").value = configdata["Connection"]["Gateway"]["GatewayAddress"];
    document.getElementById("gatewayauto").checked = configdata["Connection"]["Gateway"]["GatewayAuto"];

    document.getElementById("webinterfaceport").value = configdata["WebInterface"]["WebInterfacePort"];
    document.getElementById("webfeedenabled").checked = configdata["WebInterface"]["WebfeedEnabled"];

    if (document.getElementById("useurladdress").checked) {
        enableautoserveraddress();
    } else {
        disableautoserveraddress();
    }
}


function savesettings() {
    configdata["Host"]["RdpDisabled"] = document.getElementById("rdpenabled").checked ^ 1

    configdata["Connection"]["UseURLAddress"] = document.getElementById("useurladdress").checked;
    configdata["Connection"]["Address"] = document.getElementById("fulladdress").value;
    configdata["Connection"]["AltAddress"] = document.getElementById("altfulladdress").value;
    configdata["Connection"]["ServerPort"] = document.getElementById("serverport").value;

    configdata["Connection"]["Gateway"]["UseGateway"] = document.getElementById("gatewayuse").checked;
    configdata["Connection"]["Gateway"]["GatewayAddress"] = document.getElementById("gatewayaddress").value;
    configdata["Connection"]["Gateway"]["GatewayAuto"] = document.getElementById("gatewayauto").checked;

    configdata["WebInterface"]["WebInterfacePort"] = document.getElementById("webinterfaceport").value;
    configdata["WebInterface"]["WebfeedEnabled"] = document.getElementById("webfeedenabled").checked;
}


function loadproperties(appid) {
    document.getElementById("originalappid").value = appid;
    document.getElementById("fullname").value = configdata["RemoteApps"][appid]["Name"];
    document.getElementById("appid").value = appid;
    document.getElementById("path").value = configdata["RemoteApps"][appid]["Path"];

    document.getElementById("iconpath").value = configdata["RemoteApps"][appid]["IconPath"];
    document.getElementById("iconindex").value = configdata["RemoteApps"][appid]["IconIndex"];

    var imagesrc = configdata["RemoteApps"][appid]["Image"];

    if (!imagesrc) {
        imagesrc = "";
        loadimagetopage("img/apppicture.png");
    } else {
        loadimagetopage(imagesrc)
    }

    document.getElementById("imagesrc").value = imagesrc;

    cmdlineoption = configdata["RemoteApps"][appid]["CommandLineSetting"];

    switch (cmdlineoption) {
        case 0:
            document.getElementById("cmdlinedisabled").checked = true;
            break;
        case 1:
            document.getElementById("cmdlineoptional").checked = true;
            break;
        case 2:
            document.getElementById("cmdlineenforced").checked = true;
            break;

    }

    document.getElementById("cmdlineparameters").value = configdata["RemoteApps"][appid]["RequiredCommandLine"];
}


function initializeproperties() {
    document.getElementById("originalappid").value = "";
    document.getElementById("fullname").value = "";
    document.getElementById("appid").value = "";
    document.getElementById("path").value = "";

    document.getElementById("iconpath").value = "";
    document.getElementById("iconindex").value = 0;

    loadimagetopage("img/apppicture.png");

    document.getElementById("imagesrc").value = "";

    cmdlineoption = "1";

    switch (cmdlineoption) {
        case 0:
            document.getElementById("cmdlinedisabled").checked = true;
            break;
        case 1:
            document.getElementById("cmdlineoptional").checked = true;
            break;
        case 2:
            document.getElementById("cmdlineenforced").checked = true;
            break;

    }

    document.getElementById("cmdlineparameters").value = "";
}


function saveproperties() {

    appid = document.getElementById("appid").value;
    originalappid = document.getElementById("originalappid").value;
    iconpath = document.getElementById("iconpath").value;


    if (appid == "") {
        appid = sanitizeappid(document.getElementById("fullname").value);
    }


    if (iconpath == "") {
        document.getElementById("iconpath").value = document.getElementById("path").value;
        document.getElementById("iconindex").value = 0;
    }


    // Check if the app has been renamed
    // If originalappid is not blank (new remoteapp) AND the appid has changed (been renamed) from the originalappid
    
    if (originalappid != "" && originalappid.toLowerCase() != appid.toLowerCase()) { //&& originalappid != appid) {
        // The app seems to have been renamed

        // Check if an app already exists with the same appid
        if (configdata["RemoteApps"][appid] == undefined) {
            
            configdata["RemoteApps"][appid] = JSON.parse(JSON.stringify(configdata["RemoteApps"][originalappid])); //deep copy object
            deleteremoteapp(originalappid);

        } else {

            alert("A RemoteApp with the ID you have entered already exists. The ID will be reverted to its original value before saving.");
            appid = originalappid;
        }

    }


    configdata["RemoteApps"][appid] = {};

    configdata["RemoteApps"][appid]["Name"] = document.getElementById("fullname").value;
    configdata["RemoteApps"][appid]["Path"] = document.getElementById("path").value;

    configdata["RemoteApps"][appid]["IconPath"] = document.getElementById("iconpath").value;
    configdata["RemoteApps"][appid]["IconIndex"] = Number(document.getElementById("iconindex").value);

    configdata["RemoteApps"][appid]["OriginalId"] = originalappid;


    var imagesrc = document.getElementById("imagesrc").value;

    if (imagesrc.startsWith("/iconimage")) {
        configdata["RemoteApps"][appid]["Image"] = imagesrc.replace(originalappid, appid);
    } else {
        configdata["RemoteApps"][appid]["Image"] = imagesrc;
    }


    if (document.getElementById("cmdlinedisabled").checked) {
        configdata["RemoteApps"][appid]["CommandLineSetting"] = 0;
    }
    if (document.getElementById("cmdlineoptional").checked) {
        configdata["RemoteApps"][appid]["CommandLineSetting"] = 1;
    }
    if (document.getElementById("cmdlineenforced").checked) {
        configdata["RemoteApps"][appid]["CommandLineSetting"] = 2;
    }

    configdata["RemoteApps"][appid]["RequiredCommandLine"] = document.getElementById("cmdlineparameters").value;
}


function deleteremoteapp(appid) {
    delete configdata["RemoteApps"][appid];
}


function sanitizeappid(name) {
    // Maybe later
    return name;
}


function writetoserver() {
    showloader();
    jQuery.ajax({
        url: "/config",
        type: "POST",
        data: JSON.stringify(configdata),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(data, status, xhr) {
            readfromserver();
            hideloader();
        },
        error: function (jqXhr, textStatus, errorMessage) {
            hideloader();
            console.log(textStatus + ": " + errorMessage);
        }
    });
}


function readfromserver() {
    $.getJSON("/config", function (data) {
        configdata = data;
        recreatecards();
    });
}