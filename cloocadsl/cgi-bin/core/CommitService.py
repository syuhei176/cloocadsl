import os
import MySQLdb
import md5
import re
import sys
sys.path.append("../../")
from core.model.User import *
from xml.etree.ElementTree import *
import config

connect = None

def CreateRepository(project_id, rep_id):
    #select project xml
    global connect
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT projectname FROM projectinfo WHERE id=%s;', (project_id,))
    rows = cur.fetchall()
    cur.execute('UPDATE projectinfo SET rep_id=%s WHERE id=%s;', (rep_id, project_id))
    cur.execute('INSERT INTO model (id,meta_id,name,root,version) VALUES(%s,%s,%s,%s,%s);', (rep_id,1,rows[0][0],0,1))
    connect.commit()
    cur.close()
    connect.close()

#commit workspace to model repository
def Commit(project_id):
    #select project xml
    global connect
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT xml,rep_id,owner_id,owner_name,projectname FROM projectinfo WHERE id=%s;', (project_id,))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        return None
    #xml to rep (xml include version infomation)
    xml = rows[0][0]
    InsertXML2REP(xml, rows[0][1])
    connect.close()
    projectdata = ProjectData(project_id, rows[0][2], rows[0][3])
    projectdata.projectname = rows[0][4]
    projectdata.xml = xml
    return projectdata

project_id = None
next_version = None

def InsertXML2REP(xml, model_id):
    global project_id
    project_id = model_id
    parse_uml(xml)

def parse_uml(xml):
    elem = fromstring(xml)
    if elem.tag == 'UMLModel':
        name = elem.get('name')
#        edited_type = elem.get('edited_type')
        version = int(elem.get('version'))
        global next_version
        next_version = version + 1
        for e in elem.findall(".//ClassDiagram"):
            root = parse_uml_ClassDiagram(e)
#        for e in elem.findall(".//ExternalEvents"):
#            parse_uml_ExternalEvents(e, exeModel)
        cur = connect.cursor()
        cur.execute('UPDATE model SET root=%s,version=%s WHERE id=%s;', (root,next_version,project_id,))
        connect.commit()
        cur.close()
        """
        if edited_type == 'update':
            cur = connect.cursor()
            cur.execute('INSERT INTO model (id,meta_id,name,root,version) VALUES(%s,%s,%s,%s,%s);', (project_id,1,name,root,version))
            connect.commit()
            cur.close()
        elif edited_type == 'add':
            cur = connect.cursor()
#            cur.execute('INSERT INTO model (id,meta_id,name,root,version) VALUES(%s,%s,%s,%s,%s);', (project_id,1,name,root,version))
            cur.execute('UPDATE model SET root=%s,version=%s WHERE id=%s;', (root,next_version,project_id,))
            connect.commit()
            cur.close()
        elif edited_type == 'delete':
            cur = connect.cursor()
            cur.execute('INSERT INTO model (id,meta_id,name,root,version) VALUES(%s,%s,%s,%s,%s);', (project_id,1,name,root,version))
            connect.commit()
            cur.close()
        else:
            pass
            """

def parse_uml_ExternalEvents(elem, exeModel):
    for e in elem.findall(".//ExternalEvent"):
        externalevent = ExternalEvent(e.get('event'), e.get('target'))
        for e_p in e.findall(".//Parameter"):
            externalevent.setParameter(parse_uml_Parameter(e_p))
        exeModel.exevents.append(externalevent)

def parse_uml_ClassDiagram(elem):
    children_edited = False
    id = elem.get('id')
    name = elem.get('name')
    versionelement = elem.find('VersionElement')
    edited_type = versionelement.get('edited_type')
    version = int(versionelement.get('version'))
#    for e in elem.findall(".//Package"):
#        p = parse_uml_Package(e, cdiagram)
#        cdiagram.packages[p.name] = p
    for e in elem.findall(".//Class"):
        if parse_uml_Class(e, id, version):
            children_edited = True
#    for e in elem.findall(".//ExternalClass"):
#        c = parse_uml_ExternalClass(e, cdiagram)
#        cdiagram.classes[c.name] = c
#    for e in elem.findall(".//Association"):
#        asso = parse_uml_Association(e, cdiagram)
#        cdiagram.associations[asso.name] = asso
#    for e in elem.findall(".//Association2"):
#        asso = parse_uml_Association2(e, cdiagram)
#        cdiagram.associations[asso.name] = asso
#    for e in elem.findall(".//Genelization"):
#        asso = parse_uml_Genelization(e, cdiagram)
#        cdiagram.generalization[asso.name] = asso
    if edited_type == 'update':
        cur = connect.cursor()
        cur.execute('DELETE FROM diagram where id=%s AND project_id=%s AND version=%s;', (id,project_id,next_version))
        connect.commit()
#        cur.execute('INSERT INTO object_has_diagram (id,diagram_id,project_id) VALUES(%s,%s,%s);', (id,parent_id,project_id))
        cur.execute('INSERT INTO diagram (id,meta_id,name,project_id,version) VALUES(%s,%s,%s,%s,%s);', (id,1,name,project_id,next_version))
        connect.commit()
        cur.close()
    elif edited_type == 'add':
        cur = connect.cursor()
        cur.execute('DELETE FROM diagram where id=%s AND project_id=%s AND version=%s;', (id,project_id,next_version))
        connect.commit()
#        cur.execute('INSERT INTO object_has_diagram (id,diagram_id,project_id) VALUES(%s,%s,%s);', (id,parent_id,project_id))
        cur.execute('INSERT INTO diagram (id,meta_id,name,project_id,version) VALUES(%s,%s,%s,%s,%s);', (id,1,name,project_id,next_version))
        connect.commit()
        cur.close()
    elif edited_type == 'delete':
        cur = connect.cursor()
        cur.execute('INSERT INTO object_has_diagram (id,diagram_id,project_id) VALUES(%s,%s,%s);', (id,parent_id,project_id))
        cur.execute('INSERT INTO diagram (id,meta_id,name,project_id,version) VALUES(%s,%s,%s,%s,%s);', (id,1,name,project_id,next_version))
        connect.commit()
        cur.close()
    elif children_edited:
        cur = connect.cursor()
#        cur.execute('INSERT INTO object_has_diagram (id,diagram_id,project_id) VALUES(%s,%s,%s);', (id,parent_id,project_id))
        cur.execute('INSERT INTO diagram (id,meta_id,name,project_id,version) VALUES(%s,%s,%s,%s,%s);', (id,1,name,project_id,next_version))
        connect.commit()
        cur.close()
    else:
        pass
    return id


def parse_uml_Package(elem, parent):
    package = Package(elem.get('name'), parent)
    return package

def parse_uml_Class(elem, parent_id, parent_ver):
    id = elem.get('id')
    name = elem.get('name')
    x = elem.get('x')
    y = elem.get('y')
    versionelement = elem.find('VersionElement')
    edited_type = versionelement.get('edited_type')
    version = int(versionelement.get('version'))
    property = ""
#    for e in elem.findall(".//StereoType"):
#        klass.stereotype = parse_uml_StereoType(e)
#    for e in elem.findall(".//Property"):
#        prop = parse_uml_Property(e)
#        klass.attributes[prop.name] = prop
#    for e in elem.findall(".//Operation"):
#        op = parse_uml_Operation(e)
#        klass.methods[op.name] = op
#    for e in elem.findall(".//StateMachineDiagram"):
#        parse_uml_StateDiagram(e, id)
    if edited_type == 'update':
        cur = connect.cursor()
        cur.execute('DELETE FROM object where id=%s AND project_id=%s AND version=%s;', (id,project_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO object (id,meta_id,x,y,property,diagram_id,project_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s);', (id,1,x,y,property,parent_id,project_id,next_version,0))
        connect.commit()
        cur.close()
        return True
    elif edited_type == 'add':
        cur = connect.cursor()
        cur.execute('INSERT INTO object (id,meta_id,x,y,property,diagram_id,project_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s);', (id,1,x,y,property,parent_id,project_id,next_version,1))
        connect.commit()
        cur.close()
        return True
    elif edited_type == 'delete':
        cur = connect.cursor()
        cur.execute('INSERT INTO object (id,meta_id,x,y,property,diagram_id,project_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s);', (id,1,x,y,property,parent_id,project_id,next_version,2))
        connect.commit()
        cur.close()
        return True
    else:
        return False

def parse_uml_ExternalClass(elem, parent):
    if len(elem.get('name')) == 0:
        print "&error=ExternalClass name length = 0"
    else:
        klass = ExternalClass(elem.get('name'), parent)
    return klass

def parse_uml_StereoType(elem):
    name = elem.get('name')
    return name

def parse_uml_Property(elem):
    prop = Property(elem.get('name'), parent, elem.get('type'))
    return prop;

def parse_uml_Operation(elem, parent):
    name = elem.get('name')
    op = Operation(name, parent)
    for e in elem.findall(".//Parameter"):
        op.setParameter(parse_uml_Parameter(e))
    for e in elem.findall(".//Action"):
        op.addCode(parse_uml_Action(e))
    return op;
    
def parse_uml_Parameter(elem):
    return Parameter(elem.get('name'), elem.get("kind"), elem.get("type"))

def parse_uml_Association(elem, parent):
    name = elem.get('name')
    m1 = elem.get('m1')
    m2 = elem.get('m2')
    return Association(name, parent.classes[m1], parent.classes[m2])

def parse_uml_Association2(elem, parent):
    name = elem.get('name')
    m1 = elem.get('m1')
    m2 = elem.get('m2')
    return Association2(name, parent.classes[m1], parent.classes[m2])
    
def parse_uml_Genelization(elem, parent):
    name = elem.get('name')
    m1 = elem.get('m1')
    m2 = elem.get('m2')
    return Genelization(name, parent.classes[m1], parent.classes[m2])
    
def parse_uml_Realization(elem, parent):
    name = elem.get('name')
    m1 = elem.get('m1')
    m2 = elem.get('m2')
    return Realization(name, parent.classes[m1], parent.classes[m2])

def parse_uml_StateDiagram(elem, parent_id):
    id = elem.get('id')
    name = elem.get('name')
    is_edited = elem.get('is_edited')
    version = elem.get('version')
    stm = StateMachine(parent)
    for e in elem.findall(".//State"):
        s = parse_uml_State(e, id)
        stm.states[s.name] = s
    for e in elem.findall(".//StartState"):
        s = parse_uml_StartState(e, id)
        stm.states[s.name] = s
        stm.startstate = s
    for e in elem.findall(".//EndState"):
        s = parse_uml_EndState(e, id)
        stm.states[s.name] = s
        stm.endstate = s
    for e in elem.findall(".//Transition"):
        parse_uml_Transition(e, id)
    if is_edited == 'true':
        cur = connect.cursor()
        version = version + 1
        cur.execute('INSERT INTO object_has_diagram (id,diagram_id,project_id) VALUES(%s,%s,%s);', (id,parent_id,project_id))
        cur.execute('INSERT INTO diagram (id,meta_id,name,project_id,version) VALUES(%s,%s,%s,%s,%s);', (id,2,name,project_id,version))
        connect.commit()
        cur.close()
    else:
        pass
    return stm

def parse_uml_StartState(elem, parent_id):
    id = elem.get('id')
    x = elem.get('x')
    y = elem.get('y')
    is_edited = elem.get('is_edited')
    version = elem.get('version')
    property = ""
    if is_edited == 'true':
        cur = connect.cursor()
        version = version + 1
        cur.execute('INSERT INTO object (id,meta_id,x,y,property,diagram_id,project_id,version) VALUES(%s,%s,%s,%s,%s,%s,%s,%s);', (id,10,x,y,property,parent_id,project_id,version))
        connect.commit()
        cur.close()
    else:
        pass

def parse_uml_State(elem, parent_id):
    id = elem.get('id')
    x = elem.get('x')
    y = elem.get('y')
    is_edited = elem.get('is_edited')
    version = elem.get('version')
    property = ""
    if is_edited == 'true':
        cur = connect.cursor()
        version = version + 1
        cur.execute('INSERT INTO object (id,meta_id,x,y,property,diagram_id,project_id,version) VALUES(%s,%s,%s,%s,%s,%s,%s,%s);', (id,11,x,y,property,parent_id,project_id,version))
        connect.commit()
        cur.close()
    else:
        pass

def parse_uml_EndState(elem, parent_id):
    id = elem.get('id')
    x = elem.get('x')
    y = elem.get('y')
    is_edited = elem.get('is_edited')
    version = elem.get('version')
    property = ""
    if is_edited == 'true':
        cur = connect.cursor()
        version = version + 1
        cur.execute('INSERT INTO object (id,meta_id,x,y,property,diagram_id,project_id,version) VALUES(%s,%s,%s,%s,%s,%s,%s,%s);', (id,12,x,y,property,parent_id,project_id,version))
        connect.commit()
        cur.close()
    else:
        pass

def parse_uml_Transition(elem, parent_id):
    id = elem.get('id')
    source = elem.get('source')
    target = elem.get('target')
    is_edited = elem.get('is_edited')
    version = elem.get('version')
    property = ""
#    for e in elem.findall(".//Parameter"):
#        parent.transitions[id].setParameter(parse_uml_Parameter(e))
    if is_edited == 'true':
        cur = connect.cursor()
        version = version + 1
        cur.execute('INSERT INTO object (id,meta_id,src,dest,property,diagram_id,project_id,version) VALUES(%s,%s,%s,%s,%s,%s,%s,%s);', (id,10,x,y,property,parent_id,project_id,version))
        connect.commit()
        cur.close()
    else:
        pass

def parse_uml_Action(elem):
    return CompileAS(elem.text)








########################
##                    ##
########################
"""
def CommitObject(id,meta_id,x,y,property,diagram_id,project_id,version):
    cur = connect.cursor()
    cur.execute('INSERT INTO object (id,meta_id,x,y,property,diagram_id,project_id,version) VALUES(%s,%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,x,y,property,diagram_id,project_id,version))
    connect.commit()
    cur.close()

def LoadModel(id):
    global connect
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,meta_id,name,root,version FROM model WHERE id=%s;', (id,))
    rows = cur.fetchall()
    if len(rows) == 0:
        return None
    model = {}
    model['id'] = rows[0][0]
    model['meta_id'] = rows[0][1]
    model['name'] = rows[0][2]
    model['root'] = LoadDiagram(rows[0][3], rows[0][0], rows[0][4])
    model['version'] = rows[0][4]
    cur.close()
    connect.close()

def LoadDiagram(id, project_id, ver):
    diagram = {}
    cur = connect.cursor()
    cur.execute('SELECT id,meta_id,name FROM diagram WHERE id=%s AND project_id=%s AND version=%s;', (id, project_id, ver))
    rows = cur.fetchall()
    if len(rows) == 0:
        return None
    diagram['id'] = rows[0][0]
    diagram['meta_id'] = rows[0][1]
    diagram['name'] = rows[0][2]
    diagram['objects'] = LoadObjects(id, project_id, ver)
    diagram['relationships'] = LoadRelationships(id, project_id, ver)
    cur.close()
    return diagram;

def LoadObjects(diagram_id, project_id, ver):
    objects = []
    cur = connect.cursor()
    cur.execute('SELECT id,meta_id,x,y,property FROM object WHERE diagram_id=%s AND project_id=%s AND version=%s;', (diagram_id, project_id, ver))
    rows = cur.fetchall()
    for i in range(len(rows)):
        object = {}
        object['id'] = rows[i][0]
        object['meta_id'] = rows[i][1]
        object['x'] = rows[i][2]
        object['y'] = rows[i][3]
        object['property'] = rows[i][4]
        cur.execute('SELECT diagram_id FROM object_has_diagram WHERE object_id=%s AND project_id=%s;', (diagram_id, project_id))
        rows2 = cur.fetchall()
        if not len(row2) == 0:
            object['linked_diagram'] = LoadDiagram(rows2[0][0], project_id, ver)
        objects.append(object)
    cur.close()
    return objects;

def LoadRelationships(diagram_id, project_id, ver):
    relationships = []
    cur = connect.cursor()
    cur.execute('SELECT id,meta_id,src,dest,property FROM relationship WHERE diagram_id=%s AND project_id=%s AND version=%s;', (diagram_id, project_id, ver))
    rows = cur.fetchall()
    for i in range(len(rows)):
        relationship = {}
        relationship['id'] = rows[i][0]
        relationship['meta_id'] = rows[i][1]
        relationship['src'] = rows[i][2]
        relationship['dest'] = rows[i][3]
        relationship['property'] = rows[i][4]
        relationships.append(relationship)
    cur.close()
    return relationships;

def GetProjectFromDB(id):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,owner_id,owner_name,projectname,xml FROM projectinfo WHERE id=%s;', (id,))
    rows = cur.fetchall()
    if len(rows) == 0:
        return None
    projectdata = ProjectData(rows[0][0], rows[0][1], rows[0][2])
    projectdata.projectname = rows[0][3]
    projectdata.xml = rows[0][4]
    cur.close()
    connect.close()
    return projectdata

#get list of user's projects
def GetProjectList(user):
    connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
    cur = connect.cursor()
    cur.execute('SELECT id,projectname,type,belonglesson FROM projectinfo WHERE owner_id = %s', user.id)
    rows = cur.fetchall()
    projs = []
    for row in rows:
        proj = {}
        proj['id'] = row[0]
        proj['projectname'] = row[1]
        proj['type'] = row[2]
        proj['belonglesson'] = row[3]
        projs.append(proj)
    cur.close()
    connect.close()
    return projs

#get list of user's project names
def GetProjectNameList(user):
    connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
    cur = connect.cursor()
    cur.execute('SELECT id,projectname FROM projectinfo WHERE owner_id = %s', user.id)
    rows = cur.fetchall()
    projs = []
    for row in rows:
        proj = {}
        proj['id'] = row[0]
        proj['projectname'] = row[1]
        projs.append(proj)
    cur.close()
    connect.close()
    return projs

#create new project or import project
def CreateProject(user, projectname,type, xml):
    connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
    cur = connect.cursor()
    cur.execute('SELECT id FROM projectinfo WHERE projectname=%s AND owner_id=%s;', (projectname,user.id))
    rows = cur.fetchall()
    if not len(rows) == 0:
        cur.close()
        connect.close()
        return False
    cur.execute('INSERT INTO projectinfo (owner_id,owner_name,projectname,type,xml) VALUES(%s,%s,%s,%s,%s);', (user.id, user.username, projectname, type, xml))
    connect.commit()
    #create table for project
    cur.close()
    connect.close()
    return True

#copy project from lesson
def CopyProjectFromLesson(user, belonglesson):
    connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
    cur = connect.cursor()
    cur.execute('SELECT id FROM projectinfo WHERE projectname=%s AND owner_id=%s;', (belonglesson.project.projectname,user.id))
    rows = cur.fetchall()
    if not len(rows) == 0:
        cur.close()
        connect.close()
        return False
    cur.execute('INSERT INTO projectinfo (owner_id,owner_name,projectname,xml,belonglesson) VALUES(%s,%s,%s,%s,%s);', (user.id, user.username, belonglesson.project.projectname, belonglesson.project.xml, belonglesson.id))
    connect.commit()
    cur.close()
    connect.close()
    return True

#overwride
def SaveProject(user, projectname, xml):
    connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
    cur = connect.cursor()
    cur.execute('UPDATE projectinfo SET projectname=%s, xml=%s WHERE projectname=%s AND owner_id=%s', (projectname, xml, projectname, user.id))
    connect.commit()
    cur.close()
    connect.close()
    return True

#commit
def CommitProject(user, id, xml):
    connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
    cur = connect.cursor()
    cur.execute('UPDATE projectinfo SET projectname=%s, xml=%s WHERE id=%s AND owner_id=%s;', (projectname, xml, id, user.id))
    connect.commit()
    cur.close()
    connect.close()
    return True


#load project by id from database
def LoadProject(user, projectname):
    connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
    cur = connect.cursor()
    cur.execute('SELECT id,owner_id,owner_name,projectname,type,xml FROM projectinfo WHERE projectname=%s AND owner_id=%s;', (projectname,user.id))
    rows = cur.fetchall()
    if len(rows) == 0:
        return None
    projectdata = ProjectData(rows[0][0], rows[0][1], rows[0][2])
    projectdata.projectname = rows[0][3]
    projectdata.type = rows[0][4]
    projectdata.xml = rows[0][5]
    cur.close()
    connect.close()
    return projectdata

#delete project by id from database
def DeleteProject(user, id):
    connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
    cur = connect.cursor()
    n = cur.execute('DELETE FROM projectinfo WHERE id=%s AND owner_id=%s;', (id,user.id))
    connect.commit()
    #delete table for project
    cur.close()
    connect.close()
    if n == 0:
        return False
    return True

#Commit(93)
"""