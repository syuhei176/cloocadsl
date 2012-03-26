import os
import MySQLdb
import md5
import re
import sys
from core.model.User import *
import config

connect = None

# load model
def Load(project_id):
    pass

#save model
def Save():
    pass

def GetHeadRevision(rep_id):
    global connect
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT version FROM model WHERE id=%s;', (rep_id,))
    model_rows = cur.fetchall()
    cur.close()
    connect.close()
    if len(model_rows) == 0:
        return -1
    return model_rows[0][0]

#update workspace to revision
def LoadHeadRevision(project_id):
    #select model by ver
    #model to xml
    global connect
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT rep_id FROM projectinfo WHERE id=%s;', (project_id,))
    rows = cur.fetchall()
    cur.close()
    xml = LoadModelOfHead(rows[0][0])
    cur = connect.cursor()
    cur.execute('UPDATE projectinfo SET xml=%s WHERE id=%s;', (xml, project_id))
    connect.commit()
    cur.close()
    connect.close()
    return xml

def LoadRevision(project_id, ver):
    #select model by ver
    #model to xml
    global connect
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT rep_id FROM projectinfo WHERE id=%s;', (project_id,))
    rows = cur.fetchall()
    cur.close()
    xml = LoadModel(rows[0][0], ver)
    cur = connect.cursor()
    cur.execute('UPDATE projectinfo SET xml=%s WHERE id=%s;', (xml, project_id))
    connect.commit()
    cur.close()
    connect.close()
    return xml

def LoadModelOfHead(id):
    cur = connect.cursor()
    cur.execute('SELECT id,meta_id,name,root,version FROM model WHERE id=%s;', (id,))
    rows = cur.fetchall()
    if len(rows) == 0:
        return None
    xml = '<?xml version="1.0" encoding="UTF-8" ?>'
    xml += '<UMLModel name="'+rows[0][2]+'" version="'+str(rows[0][4])+'">'
    xml += LoadDiagram(rows[0][3], id, rows[0][4])
    xml += '</UMLModel>'
    cur.close()
    return xml

def LoadModel(id, ver):
    cur = connect.cursor()
    cur.execute('SELECT id,meta_id,name,root,version FROM model WHERE id=%s;', (id,))
    rows = cur.fetchall()
    if len(rows) == 0:
        return None
    xml = '<?xml version="1.0" encoding="UTF-8" ?>'
    xml += '<UMLModel name="'+rows[0][2]+'" version="'+str(ver)+'">'
    xml += LoadDiagram(rows[0][3], id, ver)
    xml += '</UMLModel>'
    cur.close()
    return xml

def LoadDiagram(id, project_id, ver):
    diagram = {}
    cur = connect.cursor()
    cur.execute('SELECT id,meta_id,name,version FROM diagram WHERE id=%s AND project_id=%s AND version<=%s;', (id, project_id, ver))
    rows = cur.fetchall()
    xml=''
    if len(rows) == 0:
        return None
    meta_id = int(rows[0][1])
    if meta_id == 1:
        xml = '<ClassDiagram id="'+str(rows[0][0])+'" name="'+rows[0][2]+'">'
        xml += '<VersionElement version="'+str(rows[0][3])+'" edited_type="none"/>'
        xml += LoadObjects(id, project_id, ver)
        xml += LoadRelationships(id, project_id, ver)
        xml += '</ClassDiagram>'
    elif meta_id == 2:
        xml = '<StateDiagram id="'+str(rows[0][0])+'" name="'+rows[0][2]+'" version="'+str(rows[0][3])+'" edited_type="none">'
        xml += '</StateDiagram>'
    else:
        xml = ''
#    diagram['id'] = rows[0][0]
#    diagram['meta_id'] = rows[0][1]
#    diagram['name'] = rows[0][2]
#    diagram['objects'] = LoadObjects(id, project_id, ver)
#    diagram['relationships'] = LoadRelationships(id, project_id, ver)
    cur.close()
    return xml

def LoadObjects(diagram_id, project_id, ver):
    objects = []
    cur = connect.cursor()
    cur.execute('SELECT id,version FROM object WHERE diagram_id=%s AND project_id=%s AND version<=%s;', (diagram_id, project_id, ver))
    rows = cur.fetchall()
    idmap = {}
    for i in range(len(rows)):
        if not idmap.has_key(str(rows[i][0])):
            idmap[str(rows[i][0])] = []
        idmap[str(rows[i][0])].append(rows[i][1])
    xml = ''
    for id in idmap.keys():
        idmap[id].sort()
        idmap[id].reverse()
        cur.execute('SELECT id,meta_id,x,y,property,version,ver_type FROM object WHERE diagram_id=%s AND project_id=%s AND id=%s AND version=%s;', (diagram_id, project_id, int(id), idmap[id][0]))
        obj_rows = cur.fetchall()
        if not obj_rows[0][6] == 2:
            meta_id = int(obj_rows[0][1])
            if meta_id == 1:
                xml += '<Class id="'+str(obj_rows[0][0])+'" x="'+str(obj_rows[0][2])+'" y="'+str(obj_rows[0][3])+'" property="'+obj_rows[0][4]+'">'
                xml += '<VersionElement version="'+str(obj_rows[0][5])+'" edited_type="none"/>'
                xml += '<Name>editor</Name>'
            elif meta_id == 2:
                xml += '<Class id="'+str(obj_rows[0][0])+'" x="'+str(obj_rows[0][2])+'" y="'+str(obj_rows[0][3])+'" property="'+obj_rows[0][4]+'">'
            else:
                xml += ''
            cur.execute('SELECT diagram_id FROM object_has_diagram WHERE object_id=%s AND project_id=%s;', (obj_rows[0][0], project_id))
            diagram_rows = cur.fetchall()
            if not len(diagram_rows) == 0:
                xml += LoadDiagram(diagram_rows[0][0], project_id, ver)
            if meta_id == 1:
                xml += '</Class>'
            elif meta_id == 2:
                xml += '</Class>'
            else:
                xml += ''
    cur.close()
    return xml

def LoadRelationships(diagram_id, project_id, ver):
    relationships = []
    cur = connect.cursor()
    cur.execute('SELECT id,meta_id,src,dest,property FROM relationship WHERE diagram_id=%s AND project_id=%s AND version<=%s;', (diagram_id, project_id, ver))
    rows = cur.fetchall()
    xml = ''
    for i in range(len(rows)):
        meta_id = int(rows[i][1])
        if meta_id == 1:
            xml += '<Association id="'+str(rows[i][0])+'" src="'+str(rows[i][2])+'" dest="'+str(rows[i][3])+'" property="'+rows[i][4]+'"version="'+str(rows[i][5])+'" edited_type="none">'
            xml += '</Association>'
        elif meta_id == 2:
            xml += '<Class id="'+rows[0][0]+'" x="'+rows[0][2]+'" y="'+rows[0][3]+'" property="'+rows[0][4]+'"version="'+rows[0][5]+'" edited_type="none">'
        else:
            xml += ''
    cur.close()
    return xml;
