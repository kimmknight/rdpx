from bottle import auth_basic, redirect, route, run, static_file, request, get, post, abort, BaseRequest, error, response
import os
import json
import base64

from config import readconfig, writeconfig, getportnumber
from images import loadimage, makeimage32, makeimage200, makeimageico
from winfuncs import checkwindowscredentials, getdrives, getwindowsedition, getwindowsversion

import webfeed

# Increase MEMFILE_MAX (listed in bytes). This will allow a file upload (JSON w/ images) over the initial 100KB limit.
# Important for using base64 images on apps. Limit is now 10MB

# import bottle

BaseRequest.MEMFILE_MAX = 1024 * 1024 * 50 #MB


def webfeedenabled():
    config = json.loads(readconfig())
    if str(int(config["WebInterface"]["WebfeedEnabled"] == True)):
        return True
    else:
        return False


@get("/webfeed")
def feed():
    configjson = readconfig()
    config = json.loads(configjson)
    if config["WebInterface"]["WebfeedEnabled"] == True:
        return webfeed.generatewebfeed(configjson)
    else:
        return error404()

@get("/webiconimage")
@auth_basic(checkwindowscredentials)
def getimage():
    return iconimage(True)


@get("/feediconimage")
def iconimage(isauth = False):
    response.headers['Cache-Control'] = 'public, max-age=0'
    configjson = readconfig()
    config = json.loads(configjson)

    appid = request.query.appid
    imagetype = request.query.imagetype

    iconbase64 = loadimage(appid)
    iconbase64trim = iconbase64.partition(",")[2]
    imgdata = base64.b64decode(iconbase64trim)
    mimetype = (iconbase64.partition(";")[0])[5:]

    if config["WebInterface"]["WebfeedEnabled"] == True or isauth == True:

        if imagetype == "ico":
            response.content_type = "image/x-icon"
            response.set_header("Content-Disposition", "filename=" + appid.replace(" ", "-") + ".ico")
            return makeimageico(imgdata)
        elif imagetype == "png32":
            response.content_type = "image/png"
            response.set_header("Content-Disposition", "filename=" + appid.replace(" ", "-") + ".png")
            return makeimage32(imgdata)
        elif imagetype == "png200":
            response.content_type = "image/png"
            response.set_header("Content-Disposition", "filename=" + appid.replace(" ", "-") + ".png")
            return makeimage200(imgdata)
        else:
            response.content_type = mimetype
            response.set_header("Content-Disposition", "filename=" + appid.replace(" ", "-") + "." + mimetype.partition("/")[2])
            return imgdata

    else:
        return 'Nothing here, sorry'


@get("/rdpfile")
def rdpfile():
    configjson = readconfig()
    config = json.loads(configjson)
    if config["WebInterface"]["WebfeedEnabled"] == True:
        appid = request.query.appid
        config = json.loads(readconfig())

        host = request.query.host
        if host == "":
            host = config["Connection"]["Address"]

        filehostname = host.replace(".","-")
        filename = filehostname + ".rdp"
        if appid != "": filename = filehostname + "-" + appid + ".rdp"

        response.content_type = "application/rdp"
        response.set_header("Content-Disposition", "filename=" + filename)

        return webfeed.rdpfile( host,
                                host,
                                config["Connection"]["ServerPort"],
                                config["Connection"]["Gateway"]["UseGateway"],
                                config["Connection"]["Gateway"]["GatewayAddress"],
                                config["Connection"]["Gateway"]["GatewayAuto"],
                                appid )
    else:
        return 'Nothing here, sorry'


@get("/config")
@auth_basic(checkwindowscredentials)
def config():
    return readconfig()


@post("/config")
@auth_basic(checkwindowscredentials)
def submitconfig():
    writeconfig(request)
    return '{ "success" : true }'


@route("/dirlist")
@auth_basic(checkwindowscredentials)
def dirlist():

    dir = request.query.dir

    listing = []
    if dir == None or dir == "" or dir == "/":
        listing = getdrives()
    else:
        listing.append(["..", True, os.path.dirname(dir.strip("/"))])
        for x in os.listdir(dir):

            fullpath = dir + x
            isdir = os.path.isdir(fullpath.strip("/"))

            listing.append([x, isdir])

    return json.dumps(listing)


@route("/imagesearch")
@auth_basic(checkwindowscredentials)
def imagesearch():
    q = request.query.q
    url = f"https://www.google.com/search?q={q} icon&tbm=isch&tbs=ic:trans%2Cisz:i"
    redirect(url)


@route("/os")
@auth_basic(checkwindowscredentials)
def winfo():
    winedition = getwindowsedition()
    winversion = getwindowsversion()

    versionobject = {"Version": winversion, "Edition": winedition}
    return json.dumps(versionobject)


@route("/")
@auth_basic(checkwindowscredentials)
def index():
    return static_file("html/index.html", "")


@route("/<dir>/<filepath>")
@auth_basic(checkwindowscredentials)
def dirfile(dir, filepath):
    if dir in ["css","html","img","includes","js"]:
        return static_file(dir + "\\" + filepath, "")
    abort(404,"")
    

@route('/logout')
def logout():
    abort(401, "You're no longer logged in")


@error(404)
def error404(error):
    return 'Nothing here, sorry'

portnum = getportnumber()

run(host="0.0.0.0", port=portnum, debug=True)