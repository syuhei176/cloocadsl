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

def ParseCommand(model_id, xml):
    elem = fromstring(xml)
    response = {}
    if elem.tag == 'Command':
        global connect
        connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)
        for e in elem.findall(".//DeleteDiagram"):
            diagram_id = e.get('diagram_id')
            DeleteDiagram(diagram_id)
        for e in elem.findall(".//DeleteObject"):
            object_id = e.get('object_id')
            DeleteObject(object_id)
        for e in elem.findall(".//DeleteRelationship"):
            relationship_id = e.get('relationship_id')
            DeleteRelationship(relationship_id)
        for e in elem.findall(".//UpdateDiagram"):
            object_id = e.get('object_id')
        for e in elem.findall(".//UpdateObject"):
            object_id = e.get('object_id')
            x = e.get('x')
            y = e.get('y')
            UpdateObject(object_id, x, y)
        for e in elem.findall(".//UpdateRelationship"):
            object_id = e.get('object_id')
        for e in elem.findall(".//AddDiagram"):
            metadiagram_id = e.get('metadiagram_id')
            response['diagram_id'] = AddDiagram(metadiagram_id)
        for e in elem.findall(".//AddObject"):
            metaobject_id = e.get('metaobject_id')
            x = e.get('x')
            y = e.get('y')
            diagram_id = e.get('diagram_id')
            AddObject(metaobject_id, x, y, diagram_id)
        for e in elem.findall(".//AddRelationship"):
            metarelationship_id = e.get('metarelationship_id')
            diagram_id = e.get('diagram_id')
            AddRelationship(metarelationship_id, diagram_id)
        connect.close()
    return response

def DeleteDiagram(diagram_id):
    cur = connect.cursor()
    cur.execute('DELETE FROM diagram WHERE id=%s;',(diagram_id, ))
    connect.commit()
    cur.close()

def DeleteObject(object_id):
    cur = connect.cursor()
    cur.execute('DELETE FROM object WHERE id=%s;',(object_id, ))
    cur.execute('DELETE FROM has_object WHERE object_id=%s;',(object_id, ))
    connect.commit()
    cur.close()

def DeleteRelationship(relationship_id):
    cur = connect.cursor()
    cur.execute('DELETE FROM relationship WHERE id=%s;',(relationship_id, ))
    cur.execute('DELETE FROM has_relationship WHERE relationship_id=%s;',(relationship_id, ))
    connect.commit()
    cur.close()

def UpdateDiagram(diagram_id):
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE diagram WHERE id = %s;',(diagram_id, ))
    connect.commit()
    cur.close()

def UpdateObject(object_id, x, y):
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE object SET x=%s,y=%s WHERE id = %s;',(x, y, object_id, ))
    connect.commit()
    cur.close()

def UpdateRelationship(relationship_id, src, dest):
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE relationship SET src=%s,dest=%s WHERE id = %s;',(src, dest, relationship_id, ))
    connect.commit()
    cur.close()

def UpdateProperty(property_id, value):
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE property SET value=%s WHERE id = %s;',(value, property_id, ))
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

def AddObject(metaobject_id, x, y, diagram_id):
    cur = connect.cursor()
    cur.execute('INSERT INTO object (metaobject_id,x,y) VALUES(%s,%s,%s);',(metaobject_id, x, y, ))
    object_id = cur.lastrowid
    cur.execute('INSERT INTO has_object (diagram_id,object_id) VALUES(%s,%s);',(diagram_id, object_id, ))
    connect.commit()
    cur.close()
    return object_id

def AddRelationship(metarelationship_id, src, dest, diagram_id):
    cur = connect.cursor()
    cur.execute('INSERT INTO relationship (metarelationship_id,src,dest) VALUES(%s,%s,%s);',(metarelationship_id, src, dest, ))
    relationship_id = cur.lastrowid
    cur.execute('INSERT INTO has_relationship (diagram_id,relationship_id) VALUES(%s,%s);',(diagram_id, relationship_id, ))
    connect.commit()
    cur.close()
    return relationship_id

def AddProperty(metaproperty_id):
    cur = connect.cursor()
    cur.execute('INSERT INTO property (metaproperty_id) VALUES(%s);',(metaproperty_id, ))
    property_id = cur.lastrowid
    connect.commit()
    cur.close()
    return property_id
