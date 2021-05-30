// BUTTON CLICK EVENTS:

function clickcancelwinverbutton(button) {
    button.parentElement.style.display='none';
}

function clicksavesettingsbutton() {
    savesettings();
    document.getElementById('settingsmodal').style.display='none';
    writetoserver(configdata);
}


function clickcancelsettingsbutton() {
    document.getElementById('settingsmodal').style.display='none';
}


function clicksavepropertiesbutton() {
    if (validateproperties()) {
        saveproperties();
        document.getElementById('propertiesmodal').style.display='none';
        writetoserver(configdata);
    }
}


function clickdeleteremoteappbutton() {
    if (confirm("Are you sure you want to delete this RemoteApp?")) {
        deleteremoteapp(document.getElementById('originalappid').value);
        document.getElementById('propertiesmodal').style.display='none';
        writetoserver(configdata);
    }
}


function clickcancelpropertiesbutton() {
    document.getElementById('propertiesmodal').style.display='none';
}


function clickcancelfilepickerbutton() {
    document.getElementById('filepickermodal').style.display='none';
    document.getElementById('propertiesmodal').style.display='block';
}


function clickimagesearchbutton() {
    window.open('/imagesearch?q=' + document.getElementById('fullname').value);
}


function clickpastebase64button() {
    pastebase64();
}


function clickimageresetbutton() {
    loadimagetopage('img/apppicture.png');
    // $('#imagesrc').val('');
    document.getElementById('imagesrc').value = "";
}


function clickimagebrowsebutton() {
    document.getElementById('imageselectorinput').click();
}


function clickbrowsepathbutton() {
    initiatefilepicker('path');
}

function clickbrowseiconbutton() {
    initiatefilepicker('iconpath', ["ico", "exe", "dll"]);
}


function clickremoteapppropertiesbutton(event, appshortname) {
    loadproperties(appshortname);
    document.getElementById('imageselectorinput').value = null;
    if (document.getElementById('advancedcheck').checked) {
        showadvancedproperties();
    } else {
        hideadvancedproperties();
    }
    document.getElementById('propertiesmodal').style.display='block';
    displayfirstpropertiestab(); event.stopPropagation(); // This prevents the browser from registering a click on the card beneath as well
}


// CARD CLICK EVENTS:

function clickcreatenewcard() {
    initializeproperties();
    if (document.getElementById('advancedcheck').checked) {
        showadvancedproperties();
    } else {
        hideadvancedproperties();
    }
    document.getElementById('propertiesmodal').style.display='block';
    displayfirstpropertiestab();
}


function clicksettingscard() {
    loadsettings();
    document.getElementById('settingsmodal').style.display='block';
}


// CHECKBOX CLICK EVENTS:

function clickautomaticaddresstoggle(checkbox) {
    if (checkbox.checked) {
        enableautoserveraddress();
    } else {
        disableautoserveraddress();
    }
}


function clickadvancedpropertiestoggle(checkbox) {
    if (checkbox.checked) {
        showadvancedproperties();
    } else {
        hideadvancedproperties();
    }
}


// TAB BUTTON CLICK EVENTS:

function clickhostsettingstab(event) {
    openSettingsTab(event,'Server');
}


function clickgatewaysettingstab(event) {
    openSettingsTab(event,'Gateway');
}


function clickwebinterfacesettingstab(event) {
    openSettingsTab(event,'WebInterface');
}


function clickapplicationpropertiestab(event) {
    openPropertiesTab(event,'Application');
}


function clickiconpropertiestab(event) {
    openPropertiesTab(event,'Icon');
}


function clickcommandlinepropertiestab(event) {
    openPropertiesTab(event,'Command-line');
}

