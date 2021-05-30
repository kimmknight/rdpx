var returnfieldid;

// Open the filepicker modal
// returnfield specifies which textbox the filepath will be returned into.
function initiatefilepicker(returnfield, filetypes = ["exe", "bat", "cmd"]) {
    readdirfromserver("C:/", filetypes);
    document.getElementById('propertiesmodal').style.display = 'none';
    document.getElementById('filepickermodal').style.display = 'block';
    returnfieldid = returnfield;
}


// Add each file and folder to the list
function addfilepickeritem(itemname, isdir = false, itempath = "", icon = "folder_open", filetypes = ["exe", "bat", "cmd"]) {
    var itemtypeclass = " filepickerfile";
    var clickaction = "";
    if (isdir) {
        itemtypeclass = " filepickerdir";
        filetypesstring = JSON.stringify(filetypes).replace(/\"/g, "'");
        clickaction = " onclick=\"readdirfromserver('" + itempath + "'," + filetypesstring + ")\"";
    } else {
        clickaction = " onclick=\"selectfile('" + itempath + "')\"";
    }
    $("#filepicker").append(`
    <div class=\"filepickeritem${itemtypeclass}\"${clickaction}>
        <i class="material-icons">${icon}</i>${itemname}
    </div>`)
}


// Get a directory listing from the server. Only keep dirs and files of the chosen filetypes.
function readdirfromserver(dir = "C:/", filetypes) {

    if (dir.slice(-1) != "/") {
        dir += "/";
    };

    $.getJSON("dirlist?dir=" + dir, function (data) {

        $("#filepicker").empty();
        $("#filepicker").offset().top = 0;
        $("#filepicker").append(`<div class="filepickeritem pathheading">${dir}</span>`);

        for (item in data) {
            var itemname = data[item][0];
            var itemisdir = data[item][1];

            if (itemname == "..") {
                if (data[item][2].slice(-1) == ":") {
                    itempath = "";
                } else {
                    itempath = data[item][2];
                }
            } else {
                if (dir == "/") {
                    dir = "";
                }
                itempath = dir + itemname;
            }

            if (itemisdir) {
                addfilepickeritem(itemname, itemisdir, itempath, "folder_open", filetypes);
            } else if (filetypes.includes(itemname.substr(itemname.length - 3))) {
                addfilepickeritem(itemname, itemisdir, itempath, "wysiwyg");
            }
        }
    });
}


// When a file is selected, fill the textbox with the file path
function selectfile(fullpath) {
    document.getElementById(returnfieldid).value = fullpath;
    document.getElementById('propertiesmodal').style.display = 'block';
    document.getElementById('filepickermodal').style.display = 'none';
}