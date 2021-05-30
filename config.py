import winreg
import json

from images import loadimage, purgeimages
from remoteapps import createnewremoteapps, deleteremoteapps, changeremoteapps
from db import db

def readconfig():

    config = {"RemoteApps": {}, "Connection": {}, "WebInterface": {}, "Host": {}}

    # Initialize access to the registry and get a count of remoteapps
    appskeypath = r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Terminal Server\TSAppAllowList\Applications"
    tshostkeypath = r"SYSTEM\CurrentControlSet\Control\Terminal Server"
    access_registry = winreg.ConnectRegistry(None, winreg.HKEY_LOCAL_MACHINE)

    try:
        access_key = winreg.OpenKey(access_registry, tshostkeypath)

        rdpdisabled = winreg.QueryValueEx(access_key, "fDenyTSConnections")[0]
        config["Host"]["RdpDisabled"] = rdpdisabled
        
    except:
        print("Could not access the registry key to enable Remote Desktop host.")


    try:
        access_key = winreg.OpenKey(access_registry, appskeypath)
        appcount = winreg.QueryInfoKey(access_key)[0]

        applist = []

        for i in range(appcount):
            applist.append(winreg.EnumKey(access_key, i))

        for app in applist:
            config["RemoteApps"][app] = {}
            appkeypath = appskeypath + "\\" + app
            appkey = winreg.OpenKey(access_registry, appkeypath)
            valuecount = winreg.QueryInfoKey(appkey)[1]

            # For each remoteapp key in the registry, grab all of the values and store them in config
            for x in range(valuecount):
                valuename = winreg.EnumValue(appkey, x)[0]
                valuevalue = winreg.EnumValue(appkey, x)[1]

                desiredvalues = [
                    "Name",
                    "Path",
                    "IconPath",
                    "IconIndex",
                    "CommandLineSetting",
                    "RequiredCommandLine"
                ]

                if valuename in desiredvalues:
                    if isinstance(valuevalue, str):
                        valuevalue = valuevalue.replace("\\", "/")
                    config["RemoteApps"][app][valuename] = valuevalue

            config["RemoteApps"][app]["OriginalId"] = app

            if loadimage(app) != "":
                from random import randrange
                config["RemoteApps"][app]["Image"] = "/webiconimage?appid=" + app + "&imagetype=png200" + "&rnd=" + str(randrange(1000000000, 9999999999)) # # cache buster
            else:
                config["RemoteApps"][app]["Image"] = ""

            # config["RemoteApps"][app]["Image"] = loadimage(app) # Loads the image base64 string into the JSON

        winreg.CloseKey(appkey)

    except:
        print("RemoteApp registry key not found. It will be created with the first RemoteApp.")

    # Open settings db
    c = db.cursor()
    c.execute("SELECT * from connectionsettings;")
    settingsdata = c.fetchall()
    c.close

    # Fill out the connection settings with settings from sqlite db
    config["Connection"]["UseURLAddress"] = settingsdata[0][0] == 1
    config["Connection"]["Address"] = settingsdata[0][1]
    config["Connection"]["AltAddress"] = settingsdata[0][2]
    config["Connection"]["ServerPort"] = settingsdata[0][3]
    config["Connection"]["Gateway"] = {}
    config["Connection"]["Gateway"]["UseGateway"] = settingsdata[0][4] == 1
    config["Connection"]["Gateway"]["GatewayAddress"] = settingsdata[0][5]
    config["Connection"]["Gateway"]["GatewayAuto"] = settingsdata[0][6] == 1
    config["WebInterface"]["WebInterfacePort"] = settingsdata[0][7]
    config["WebInterface"]["WebfeedEnabled"] = settingsdata[0][8] == 1

    # Convert config to JSON and make it look pretty, send it back
    return json.dumps(config, indent=4)


def writeconfig(request):
    newconfigdata = request.json
    config = json.loads(readconfig())

    # Check if the submitted config data is different (assumed newer) than the system config data
    if not aredictsthesame(newconfigdata, config):

        # Get all new RemoteApps
        newremoteapps = uniquedictkeys(
            newconfigdata["RemoteApps"], config["RemoteApps"]
        )

        # Get all deleted RemoteApps
        deletedremoteapps = uniquedictkeys(
            config["RemoteApps"], newconfigdata["RemoteApps"]
        )

        # Get all changed RemoteApps
        changedremoteapps = {}
        for RemoteApp in newconfigdata["RemoteApps"]:
            if RemoteApp in config["RemoteApps"]:
                if not aredictsthesame(newconfigdata["RemoteApps"][RemoteApp], config["RemoteApps"][RemoteApp]):
                    changedremoteapps[RemoteApp] = newconfigdata["RemoteApps"][RemoteApp]

        createnewremoteapps(newremoteapps)
        deleteremoteapps(deletedremoteapps)
        changeremoteapps(changedremoteapps)

        purgeimages(newconfigdata["RemoteApps"])


        if not aredictsthesame(newconfigdata["Host"], config["Host"]):
    
            tshostkeypath = r"SYSTEM\CurrentControlSet\Control\Terminal Server"

            tshostkey = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, tshostkeypath, access=winreg.KEY_WRITE)

            winreg.SetValueEx(tshostkey,"fDenyTSConnections", 0, winreg.REG_DWORD, newconfigdata["Host"]["RdpDisabled"])



        if not aredictsthesame(newconfigdata["Connection"], config["Connection"]):

            query = "UPDATE connectionsettings SET "
            query += (
                "useurladdress="
                + str(int(newconfigdata["Connection"]["UseURLAddress"] == True))
                + ", "
            )
            query += 'address="' + newconfigdata["Connection"]["Address"] + '", '
            query += 'altaddress="' + newconfigdata["Connection"]["AltAddress"] + '", '
            query += "serverport=" + str(newconfigdata["Connection"]["ServerPort"]) + ", "
            query += (
                "usegateway="
                + str(int(newconfigdata["Connection"]["Gateway"]["UseGateway"] == True))
                + ", "
            )
            query += (
                'gatewayaddress="'
                + newconfigdata["Connection"]["Gateway"]["GatewayAddress"]
                + '", '
            )
            query += (
                "gatewayauto="
                + str(
                    int(newconfigdata["Connection"]["Gateway"]["GatewayAuto"] == True)
                )
                + ", "
            )
            query += "webinterfaceport=" + str(newconfigdata["WebInterface"]["WebInterfacePort"]) + ", "
            query += (
                "webfeedenabled="
                + str(int(newconfigdata["WebInterface"]["WebfeedEnabled"] == True))
            ) + ";"

            c = db.cursor()
            c.execute(query)
            db.commit()
            c.close




def aredictsthesame(dict1, dict2):
    return dict1 == dict2


def uniquedictkeys(dict1, dict2):
    uniquekeys = {}
    for key in dict1:
        if key not in dict2:
            uniquekeys[key] = dict1[key]

    return uniquekeys


def getportnumber():
    c = db.cursor()
    query = f"SELECT webinterfaceport FROM connectionsettings;"
    c.execute(query)
    result = c.fetchall()
    c.close
    portnum = 8080
    if result != []:
        portnum = result[0][0]
    portnum = int(portnum)
    return portnum