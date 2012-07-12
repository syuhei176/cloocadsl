# -*- coding: utf-8 -*-
import os
import MySQLdb
import sys
import json
import datetime
from core import UserService
from core import MetaModelService
from core import ProjectService
from xml.etree.ElementTree import *
from flask import url_for, render_template, session, request, make_response, redirect
sys.path.append('../')
import config

"""
"""
def loadToolList(user, connect, page, start, limit):
    cur = connect.cursor()
    cur.execute('SELECT id,name,detail FROM ToolInfo ORDER BY id LIMIT %s WHERE id > %s;', (limit, start, ))
    rows = cur.fetchall()
    cur.close()
    metamodels = []
    for i in range(len(rows)):
        metamodel = {}
        metamodel['id'] = rows[i][0]
        metamodel['name'] = rows[i][1]
        metamodels.append(metamodel)
    return metamodels


def buy_tool(user, tool_id):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    #result
    connect.close()
    return json.dumps(result)


def sell_tool(user, metamodel_id, price, tool_name, tool_detail):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    #result
    #MetaModelInfo+TemplateをToolInfoに圧縮
    connect.close()
    return json.dumps(result)




