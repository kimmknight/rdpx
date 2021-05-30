import winreg

from images import renameimage, saveimage, deleteimage


def writeremoteapps(newremoteapps, update=False):
    for app in newremoteapps:
        appskeypath = r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Terminal Server\TSAppAllowList\Applications"
        appskeypath += "\\\\" + app

        if update:
            appkey = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, appskeypath, access=winreg.KEY_WRITE)
        else:
            appkey = winreg.CreateKey(winreg.HKEY_LOCAL_MACHINE, appskeypath)

        originalid = newremoteapps[app]["OriginalId"]

        if originalid != app:
            renameimage(originalid, app)

        for appvalue in newremoteapps[app]:
            valuename = appvalue
            valuevalue = newremoteapps[app][valuename]

            if isinstance(valuevalue, int):
                regvaltype = winreg.REG_DWORD
                winreg.SetValueEx(appkey, valuename, 0, regvaltype, valuevalue)
            elif isinstance(valuevalue, str):
                if valuename.lower() != "image":
                    regvaltype = winreg.REG_SZ
                    valuevalue = valuevalue.replace("/", "\\")
                    winreg.SetValueEx(appkey, valuename, 0, regvaltype, valuevalue)
                elif valuevalue.startswith("data:"):
                    saveimage(app, valuevalue)
                elif valuevalue == "":
                    deleteimage(app)


def createnewremoteapps(newremoteapps):
    writeremoteapps(newremoteapps)


def deleteremoteapps(deletedremoteapps):
    for app in deletedremoteapps:
        appskeypath = r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Terminal Server\TSAppAllowList\Applications"
        appskeypath = appskeypath + "\\\\" + app
        winreg.DeleteKey(winreg.HKEY_LOCAL_MACHINE, appskeypath)
        deleteimage(app)


def changeremoteapps(changedremoteapps):
    writeremoteapps(changedremoteapps, True)

