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
自分のプロジェクト
自分の作ったツール
自分が買ったツール
アカウント設定
"""
def mydashboard(user):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    myprojects = ProjectService.loadMyOwnProjectList(user, connect)
    mymetamodels = MetaModelService.loadMyOwnMetaModelList(user, connect)
    mytools = MetaModelService.loadMyTools(user, connect)
    #accountinfo = UserService.getAccountInfo()
    connect.close()
    return render_template('mydashboard.html',
                           myprojects=json.dumps(myprojects),
                           mymetamodels=json.dumps(mymetamodels),
                           mytools=json.dumps(mytools))

def myprojects(session):
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        myprojects = ProjectService.loadMyOwnProjectList(session['user'], connect)
        connect.close()
        return json.dumps(myprojects)
    
def mymetamodels(session):
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        mymetamodels = MetaModelService.loadMyOwnMetaModelList(session['user'], connect)
        connect.close()
        return json.dumps(mymetamodels)
    
def mytools(session):
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        mytools = MetaModelService.loadMyTools(session['user'], connect)
        connect.close()
        return json.dumps(mytools)

"""
def myaccount():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        accountinfo = UserService.getAccountInfo()
        connect.close()
        return json.dumps(accountinfo)
"""

"""
グループのプロジェクト
グループのツール　　　　＊グループの管理者のみ
グループで買ったツール　＊グループの管理者のみ
グループの設定　　　　　＊グループの管理者のみ
"""
def dashboard(gid):
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        cur = connect.cursor()
        cur.execute('SELECT group_id,role FROM JoinInfo WHERE user_id=%s AND group_id=%s;', (session['user']['id'], id, ))
        rows = cur.fetchall()
        cur.close()
        if not len(rows) == 0:
            joinInfo = {}
            joinInfo['id'] = int(id)
            joinInfo['role'] = int(rows[0][1])
            if joinInfo['role'] == 0:
                return render_template('dashboard.html',
                                       loggedin = True,
                                       username = session['user']['uname'],
                                       mymetamodel = json.dumps(MetaModelService.loadMyMetaModelList(session['user'], id, connect)),
                                       myproject = json.dumps(ProjectService.loadMyProjectList(session['user'], id, connect)),
                                       metamodels = json.dumps(MetaModelService.loadMetaModelList(session['user'], id, connect)),
                                       group = GroupService.getGroup(session['user'], joinInfo['id'], connect),
#                                       members = GroupService.getGroupMember(session['user'], joinInfo['id'], connect),
                                       group_id = joinInfo['id'])
            elif joinInfo['role'] == 1:
                return render_template('dashboard1.html',
                                       loggedin = True,
                                       username = session['user']['uname'],
                                       mymetamodel = json.dumps(MetaModelService.loadMyMetaModelList(session['user'], id, connect)),
                                       groupmetamodel = json.dumps(MetaModelService.loadGroupMetaModelList(session['user'], id, connect)),
                                       myproject = json.dumps(ProjectService.loadMyProjectList(session['user'], id, connect)),
                                       metamodels = json.dumps(MetaModelService.loadMetaModelList(session['user'], id, connect)),
                                       group = GroupService.getGroup(session['user'], joinInfo['id'], connect),
                                       members = GroupService.getGroupMember(session['user'], joinInfo['id'], connect),
                                       group_id = joinInfo['id'],hash_key = hash(joinInfo['id']))
    else:
        return redirect(url_for('login_view'))
    return render_template('request_deny.html')

"""
自分の所属しているグループたち
"""
def mygroups():
    pass

"""
公開グループたち
"""
def groups():
    pass

"""
＊ワークベンチャのみ
自分の作っているツール
販売中のツール
"""
def wb_dashboard():
    pass

def wb_mytools():
    pass

def wb_mytoolsforsell():
    pass
