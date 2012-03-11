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

def saveProject(pid, xml):
    connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE ProjectInfo SET xml=%s WHERE id = %s;',(xml, pid, ))
    connect.commit()
    cur.close()
    connect.close()
    return True

def loadProject(pid):
    connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml FROM ProjectInfo WHERE id=%s;',(pid, ))
    rows = cur.fetchall()
    cur.close()
    project = {}
    project['id'] = rows[0][0]
    project['name'] = rows[0][1]
    project['xml'] = rows[0][2]
    connect.close()
    return project

def loadMyProjectList(user):
    connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT project_id FROM hasProject WHERE user_id=%s;',(user['id'], ))
    rows = cur.fetchall()
    projects = []
    for i in range(len(rows)):
        cur.close()
        cur = connect.cursor()
        cur.execute('SELECT id,name,xml FROM ProjectInfo WHERE id=%s;',(rows[i][0], ))
        metamodel_rows = cur.fetchall()
        project = {}
        project['id'] = metamodel_rows[0][0]
        project['name'] = metamodel_rows[0][1]
#        metamodel['xml'] = metamodel_rows[0][2]
        projects.append(project)
        cur.close()
    connect.close()
    return projects
