import os
import MySQLdb
import md5
import re
import sys
import datetime
from xml.etree.ElementTree import *
sys.path.append('../')
#from config import *
import config

reg_username = re.compile('\w+')
connect = None
g_model_id = None

def ParseCommand(model_id, xml):
    elem = fromstring(xml)
    response = {}
    response['object_ids'] = []
    response['relationship_ids'] = []
    if elem.tag == 'Command':
        global connect
        global model_id
        connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)
        g_model_id = model_id
        for e in elem.findall(".//DeleteDiagram"):
            diagram_id = e.get('diagram_id')
            DeleteDiagram(diagram_id)
        for e in elem.findall(".//DeleteObject"):
            object_id = e.get('object_id')
            diagram_id = e.get('diagram_id')
            DeleteObject(object_id, diagram_id)
        for e in elem.findall(".//DeleteRelationship"):
            relationship_id = e.get('relationship_id')
            diagram_id = e.get('diagram_id')
            DeleteRelationship(relationship_id, diagram_id)
        for e in elem.findall(".//UpdateDiagram"):
            object_id = e.get('object_id')
        for e in elem.findall(".//UpdateObject"):
            object_id = e.get('object_id')
            x = e.get('x')
            y = e.get('y')
            diagram_id = e.get('diagram_id')
            UpdateObject(object_id, x, y, diagram_id)
        for e in elem.findall(".//UpdateRelationship"):
            relationship_id = e.get('relationship_id')
            src = e.get('src')
            dest = e.get('dest')
            diagram_id = e.get('diagram_id')
            UpdateRelationship(relationship_id, src, dest, diagram_id)
        for e in elem.findall(".//UpdateProperty"):
            id = e.get('id')
            object_id = e.get('object_id')
            value = e.get('value')
            UpdateProperty(id, object_id, value)
        for e in elem.findall(".//AddDiagram"):
            metadiagram_id = e.get('metadiagram_id')
            response['diagram_id'] = AddDiagram(metadiagram_id)
        for e in elem.findall(".//AddObject"):
            metaobject_id = e.get('metaobject_id')
            x = e.get('x')
            y = e.get('y')
            diagram_id = e.get('diagram_id')
            local_id = e.get('local_id')
            AddObject(metaobject_id, x, y, diagram_id, local_id, model_id)
#            response['object_ids'].append({"global_id" : AddObject(metaobject_id, x, y, diagram_id, local_id), "local_id" : int(local_id)})
        for e in elem.findall(".//AddRelationship"):
            metarelationship_id = e.get('metarelationship_id')
            src = e.get('src')
            dest = e.get('dest')
            diagram_id = e.get('diagram_id')
            local_id = e.get('local_id')
            AddRelationship(metarelationship_id, src, dest, diagram_id, local_id)
#            response['relationship_ids'].append({"global_id" : AddRelationship(metarelationship_id, src, dest, diagram_id, local_id), "local_id" : int(local_id)})
        for e in elem.findall(".//AddProperty"):
            id = e.get('id')
            metaproperty_id = e.get('metaproperty_id')
            object_id = e.get('object_id')
            value = e.get('value')
            AddProperty(id, metaproperty_id, object_id, value, model_id)
        connect.close()
    return response

def DeleteDiagram(diagram_id):
    cur = connect.cursor()
    cur.execute('DELETE FROM diagram WHERE id=%s;',(diagram_id, ))
    connect.commit()
    cur.close()

def DeleteObject(object_id, diagram_id):
    cur = connect.cursor()
    cur.execute('DELETE FROM object WHERE local_id=%s AND diagram_id=%s AND model_id=%s;',(object_id, diagram_id, g_model_id, ))
#    cur.execute('DELETE FROM has_object WHERE object_id=%s;',(object_id, ))
    connect.commit()
    cur.close()

def DeleteRelationship(relationship_id, diagram_id):
    cur = connect.cursor()
    cur.execute('DELETE FROM relationship WHERE local_id=%s AND diagram_id=%s AND model_id=%s;',(relationship_id, diagram_id, g_model_id, ))
#    cur.execute('DELETE FROM has_relationship WHERE relationship_id=%s;',(relationship_id, ))
    connect.commit()
    cur.close()

def UpdateDiagram(diagram_id):
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE diagram WHERE id = %s;',(diagram_id, ))
    connect.commit()
    cur.close()

def UpdateObject(object_id, x, y, diagram_id):
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE object SET x=%s,y=%s WHERE local_id = %s AND diagram_id = %s AND model_id=%s;',(x, y, object_id, diagram_id, g_model_id, ))
    connect.commit()
    cur.close()

def UpdateRelationship(relationship_id, src, dest, diagram_id):
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE relationship SET src=%s,dest=%s WHERE local_id = %s AND diagram_id = %s AND model_id=%s;',(src, dest, relationship_id, diagram_id, g_model_id, ))
    connect.commit()
    cur.close()

def UpdateProperty(id, object_id, value):
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE property SET value=%s WHERE id = %s AND object_id = %s AND model_id=%s;',(value, id, object_id, g_model_id, ))
    connect.commit()
    cur.close()
    connect.close()

def AddDiagram(metadiagram_id):
    cur = connect.cursor()
    cur.execute('INSERT INTO diagram (metadiagram_id) VALUES(%s);',(metadiagram_id, ))
    diagram_id = cur.lastrowid
    connect.commit()
    cur.close()
    return diagram_id

def AddObject(metaobject_id, x, y, diagram_id, local_id):
    cur = connect.cursor()
    cur.execute('INSERT INTO object (metaobject_id,x,y,local_id,diagram_id,model_id) VALUES(%s,%s,%s,%s,%s,%s);',(metaobject_id, x, y, local_id, diagram_id, g_model_id, ))
#    object_id = cur.lastrowid
#    cur.execute('INSERT INTO has_object (diagram_id,object_id) VALUES(%s,%s);',(diagram_id, object_id, ))
    connect.commit()
    cur.close()
    return 0

def AddRelationship(metarelationship_id, src, dest, diagram_id, local_id):
    cur = connect.cursor()
    cur.execute('INSERT INTO relationship (metarelationship_id,src,dest,local_id,diagram_id,model_id) VALUES(%s,%s,%s,%s,%s,%s);',(metarelationship_id, src, dest, local_id, diagram_id, g_model_id, ))
#    relationship_id = cur.lastrowid
#    cur.execute('INSERT INTO has_relationship (diagram_id,relationship_id) VALUES(%s,%s);',(diagram_id, relationship_id, ))
    connect.commit()
    cur.close()
    return 0

def AddProperty(id, metaproperty_id, object_id, value):
    cur = connect.cursor()
    cur.execute('INSERT INTO property (id,metaproperty_id,object_id,value,model_id) VALUES(%s,%s,%s,%s,%s);',(id, metaproperty_id, object_id, value, g_model_id, ))
    property_id = cur.lastrowid
    connect.commit()
    cur.close()
    return property_id
