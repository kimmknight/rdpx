
checkwinver();

function checkwinver() {

    badeditions = ["Core","Home"]

    $.getJSON("/os", function (data) {
        var winedition = data["Edition"];
        if (badeditions.includes(winedition)){
            $("#winvercontainer").removeClass("w3-hide");
            $("#winedition").text(winedition.replace("Core", "Home") + " Edition");
        }
    });
}
