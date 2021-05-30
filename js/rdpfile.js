// This file is responsible for generating the client .rdp file client-side and delivering as a download.

function downloadrdp(remoteapplicationname = "") {

    var fulladdress;
    var altfulladdress;
    var serverport;

    var useurladdress = configdata["Connection"]["UseURLAddress"];

    if (Boolean(useurladdress)) {
        fulladdress = window.location.hostname;
        altfulladdress = window.location.hostname;
        serverport = 3389;
    } else {
        fulladdress = configdata["Connection"]["Address"];
        altfulladdress = configdata["Connection"]["AltAddress"];
        serverport = configdata["Connection"]["ServerPort"];
    }

    var gatewayuse = configdata["Connection"]["Gateway"]["UseGateway"];
    var gatewayaddress = configdata["Connection"]["Gateway"]["GatewayAddress"];
    var gatewayauto = configdata["Connection"]["Gateway"]["GatewayAuto"];
    
    var gatewaymode = 0;

    var rdpstring = "";

    if (gatewayuse == true) {
        if (gatewayauto == true) {
            gatewaymode = 2;
        } else {
            gatewaymode = 1;
        }
        rdpstring = `
        gatewayhostname:s:${gatewayaddress}
        gatewayusagemethod:i:${gatewaymode}`;
    }

    if (altfulladdress == "") {altfulladdress = fulladdress};

    rdpstring += `
    full address:s:${fulladdress}
    alternate full address:s:${altfulladdress}`;

    if (serverport != 3389) {
        rdpstring += `
        server port:i:${serverport}`;
    }

    var filename = fulladdress.replaceAll(".","-") + ".rdp";

    if (remoteapplicationname != "") {
        filename = remoteapplicationname + ".rdp";
        rdpstring += `
        remoteapplicationmode:i:1
        remoteapplicationname:s:${remoteapplicationname}
        remoteapplicationprogram:s:||${remoteapplicationname}`;
    }

    rdpstring = deindentliteral(rdpstring.trim());

    downloadrdpfile(filename, rdpstring);
}


function downloadrdpfile(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


function deindentliteral(thestring) {
    while (thestring.includes("  ")) {
        thestring = thestring.replace("  ","");
    };
    return thestring;
}