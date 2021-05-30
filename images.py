from db import db

def saveimage(reference, imagesrc):
    if imagesrc == "":
        deleteimage(reference)
    else:
        c = db.cursor()
        query = f"INSERT INTO images (reference, imagesrc) VALUES ('{reference}', '{imagesrc}');"
        c.execute(query)
        db.commit()
        c.close


def loadimage(reference):
    c = db.cursor()
    query = f"SELECT DISTINCT imagesrc FROM images WHERE reference = '{reference}';"
    c.execute(query)
    imagedata = c.fetchall()
    c.close
    if imagedata == []:
        return ""
    else:
        return imagedata[0][0]


def renameimage(oldname, newname):
    if oldname.lower() != newname.lower():
        c = db.cursor()
        query = f"UPDATE images SET reference='{newname}' WHERE reference='{oldname}';"
        c.execute(query)
        db.commit()
        c.close


def deleteimage(reference):
    c = db.cursor()
    query = f"DELETE FROM images WHERE reference = '{reference}';"
    c.execute(query)
    db.commit()
    c.close


def purgeimages(remoteapps):
    c = db.cursor()
    query = f"SELECT reference FROM images;"
    c.execute(query)
    imagereferencelist = c.fetchall()

    for imagereference in imagereferencelist:
        if imagereference[0] not in remoteapps:
            deleteimage(imagereference[0])
    
    c.close


def makeimage32(imagedata):
    from PIL import Image
    import io

    size = (32,32)

    imageobj = Image.open(io.BytesIO(imagedata))
    imageobj.thumbnail(size)

    buf = io.BytesIO()
    imageobj.save(buf, "PNG")
    contents = buf.getvalue()
    return contents


def makeimage200(imagedata):
    from PIL import Image
    import io

    size = (200,200)

    imageobj = Image.open(io.BytesIO(imagedata))
    imageobj.thumbnail(size)

    buf = io.BytesIO()
    imageobj.save(buf, "PNG")
    contents = buf.getvalue()
    return contents


def makeimageico(imagedata):
    from PIL import Image
    import io

    imageobj = Image.open(io.BytesIO(imagedata))
    
    buf = io.BytesIO()
    imageobj.save(buf, "ICO")
    contents = buf.getvalue()
    return contents
