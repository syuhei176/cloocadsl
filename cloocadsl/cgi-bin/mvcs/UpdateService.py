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
    cur.execute('SELECT rep_id FROM ProjectInfo WHERE id=%s;', (project_id,))
    rows = cur.fetchall()
    cur.close()
    xml = LoadModelOfHead(rows[0][0])
    cur = connect.cursor()
    cur.execute('UPDATE ProjectInfo SET xml=%s WHERE id=%s;', (xml, project_id))
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
    cur.execute('SELECT rep_id FROM ProjectInfo WHERE id=%s;', (project_id,))
    rows = cur.fetchall()
    cur.close()
    xml = LoadModel(rows[0][0], ver)
    cur = connect.cursor()
    cur.execute('UPDATE ProjectInfo SET xml=%s WHERE id=%s;', (xml, project_id))
    connect.commit()
    cur.close()
    connect.close()
    return xml

def LoadModelOfHead(id):
    cur = connect.cursor()
    cur.execute('SELECT id,current_version,root FROM model WHERE id=%s;', (id,))
    rows = cur.fetchall()
    if len(rows) == 0:
        return None
    xml = '<?xml version="1.0" encoding="UTF-8" ?>'
    xml += '<Model id="'+rows[0][0]+'" current_version="'+str(rows[0][1])+'">'
    xml += LoadDiagram(rows[0][2], id, rows[0][1])
    xml += '</Model>'
    cur.close()
    return xml

def LoadModel(id, ver):
    cur = connect.cursor()
    cur.execute('SELECT id,current_version,root FROM model WHERE id=%s;', (id,))
    rows = cur.fetchall()
    if len(rows) == 0:
        return None
    xml = '<?xml version="1.0" encoding="UTF-8" ?>'
    xml += '<Model id="'+rows[0][0]+'" current_version="'+str(ver)+'">'
    xml += LoadDiagram(rows[0][2], id, ver)
    xml += '</Model>'
    cur.close()
    return xml

def LoadDiagram(id, project_id, ver):
    diagram = {}
    cur = connect.cursor()
    cur.execute('SELECT id,meta_id,version,model_id FROM diagram WHERE id=%s AND model_id=%s AND version<=%s;', (id, project_id, ver))
    rows = cur.fetchall()
    xml=''
    if len(rows) == 0:
        return None
    meta_id = int(rows[0][1])
    xml = '<Diagram id="'+str(rows[0][0])+'" meta_id="'+rows[0][1]+'">'
    xml += '<VersionElement version="'+str(rows[0][2])+'" ver_type="none"/>'
    xml += LoadObjects(id, project_id, ver)
    xml += LoadRelationships(id, project_id, ver)
    xml += '</Diagram>'
    cur.close()
    return xml

def LoadObjects(diagram_id, project_id, ver):
    objects = []
    cur = connect.cursor()
    cur.execute('SELECT id,version FROM object WHERE diagram_id=%s AND model_id=%s AND version<=%s;', (diagram_id, project_id, ver))
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
        cur.execute('SELECT id,meta_id,x,y,version,ver_type FROM object WHERE diagram_id=%s AND model_id=%s AND id=%s AND version=%s;', (diagram_id, project_id, int(id), idmap[id][0]))
        obj_rows = cur.fetchall()
        if not obj_rows[0][5] == 2:
            meta_id = int(obj_rows[0][1])
            xml += '<Object id="'+str(obj_rows[0][0])+'" meta_id="'+str(meta_id)+'" x="'+str(obj_rows[0][2])+'" y="'+str(obj_rows[0][3])+'" >'
            xml += '<VersionElement version="'+str(obj_rows[0][5])+'" ver_type="none"/>'
            cur.execute('SELECT diagram_id FROM object_has_diagram WHERE object_id=%s AND project_id=%s;', (obj_rows[0][0], project_id))
            cur.execute('SELECT property_id FROM has_property WHERE object_id=%s AND model_id=%s;', (obj_rows[0][0], project_id))
            property_rows = cur.fetchall()
            if not len(property_rows) == 0:
                xml += LoadProperty(property_rows[0][0], project_id, ver)
            diagram_rows = cur.fetchall()
            if not len(diagram_rows) == 0:
                xml += LoadDiagram(diagram_rows[0][0], project_id, ver)
            xml += '</Object>'
    cur.close()
    return xml

def LoadRelationships(diagram_id, project_id, ver):
    relationships = []
    cur = connect.cursor()
    cur.execute('SELECT id,meta_id,src,dest,property FROM relationship WHERE diagram_id=%s AND model_id=%s AND version<=%s;', (diagram_id, project_id, ver))
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

def LoadProperty(property_id, project_id, ver):
    objects = []
    cur = connect.cursor()
    cur.execute('SELECT id,meta_id,content,version,ver_type FROM object WHERE id=%s AND model_id=%s AND version<=%s;', (property_id, project_id, ver))
    rows = cur.fetchall()
    ver_map = []
    for i in range(len(rows)):
        ver_map.append(rows[i][3])
    xml = ''
    ver_map.sort()
    ver_map.reverse()
    cur.execute('SELECT id,meta_id,content,version,ver_type FROM property WHERE id=%s AND model_id=%s AND version=%s;', (property_id, project_id, ver_map[0]))
    obj_rows = cur.fetchall()
    if not obj_rows[0][6] == 2:
        meta_id = int(obj_rows[0][1])
        xml += '<Property id="'+str(obj_rows[0][0])+'" meta_id="'+str(meta_id)+'" >'
        xml += obj_rows[0][2]
        xml += '<VersionElement version="'+str(obj_rows[0][3])+'" ver_type="none"/>'
        xml += '</Property>'
    cur.close()
    return xml
