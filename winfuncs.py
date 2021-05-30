import winreg

def getdrives():
    import os

    drives = [[chr(x) + ":/", True] for x in range(65, 91) if os.path.exists(chr(x) + ":")]
    return drives


def getwindowsedition():
    # Get EditionID

    # Initialize access to the registry
    editionkeypath = r"SOFTWARE\Microsoft\Windows NT\CurrentVersion"
    access_registry = winreg.ConnectRegistry(None, winreg.HKEY_LOCAL_MACHINE)

    # Access the registry and read the edition id
    appkey = winreg.OpenKey(access_registry, editionkeypath)
    editionid = winreg.QueryValueEx(appkey, "EditionID")
    return editionid[0]


def getwindowsversion():
    import sys
    return sys.getwindowsversion()


def checkwindowscredentials(user, password):
    import win32security

    domain = "."

    try:
        hUser = win32security.LogonUser (
            user,
            domain,
            password,
            win32security.LOGON32_LOGON_NETWORK,
            win32security.LOGON32_PROVIDER_DEFAULT
    )
    except win32security.error:
        return False
    else:
        return True


