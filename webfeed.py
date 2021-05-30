import json
from datetime import datetime
import os

def generatewebfeed(configurationjson):

    # Load the template files

    f = open("tmpl/webfeedheader.xml", "r")
    webfeedheader = f.read()
    f.close()

    f = open("tmpl/webfeedapp.xml", "r")
    webfeedapp = f.read()
    f.close()

    f = open("tmpl/webfeedfulldesktop.xml", "r")
    webfeedfulldesktop = f.read()
    f.close()

    f = open("tmpl/webfeedfooter.xml", "r")
    webfeedfooter = f.read()
    f.close()

    configuration = json.loads(configurationjson)

    now = datetime.now()
    currentdatetime = now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

    hostname = os.getenv('computername')

    variables = {}

    variables["${currentdatetime}"] = currentdatetime
    variables["${hostname}"] = hostname

    variables["${fulldesktopfiledatetime}"] = currentdatetime
    variables["${fulldesktoprdpfile}"] = "/rdpfile"

    for variable in variables.keys():
        webfeedheader = webfeedheader.replace(variable, variables[variable])
        webfeedfooter = webfeedfooter.replace(variable, variables[variable])
        webfeedfulldesktop = webfeedfulldesktop.replace(variable, variables[variable])

    webfeedapps = ""
    remoteapps = configuration["RemoteApps"]
    for remoteapp in remoteapps:
        variables["${appname}"] = remoteapps[remoteapp]["Name"]
        variables["${appid}"] = remoteapp
        variables["${appidclean}"] = remoteapp.replace(" ", "_")
        variables["${filedatetime}"] = currentdatetime # Probably change this later

        import urllib
        variables["${appiconico}"] = "/feediconimage?appid=" + urllib.parse.quote(remoteapp) + "&amp;imagetype=ico"
        variables["${appicon32png}"] = "/feediconimage?appid=" + urllib.parse.quote(remoteapp) + "&amp;imagetype=png32"
        variables["${apprdpfile}"] = "/rdpfile?appid=" + urllib.parse.quote(remoteapp)

        webfeedappxml = webfeedapp
        for variable in variables.keys():
            webfeedappxml = webfeedappxml.replace(variable, variables[variable])

        webfeedapps += webfeedappxml

    return webfeedheader + webfeedapps + webfeedfulldesktop + webfeedfooter

def rdpfile(fulladdress, altfulladdress, serverport, gatewayuse, gatewayaddress, gatewayauto, appid = ""):

    rdpstring = ""

    if gatewayuse == True:
        if gatewayauto == True:
            gatewaymode = 2
        else:
            gatewaymode = 1
        
        rdpstring = f"gatewayhostname:s:{gatewayaddress}\r\ngatewayusagemethod:i:{gatewaymode}\r\n"

    if altfulladdress == "":
        altfulladdress = fulladdress

    rdpstring += f"full address:s:{fulladdress}\r\nalternate full address:s:{altfulladdress}\r\n"

    if (serverport != 3389):
        rdpstring += f"server port:i:{serverport}"

    if appid != "":
        rdpstring += f"remoteapplicationmode:i:1\r\nremoteapplicationname:s:{appid}\r\nremoteapplicationprogram:s:||{appid}\r\n"
    

    rdpstring = rdpstring.strip()

    return rdpstring


