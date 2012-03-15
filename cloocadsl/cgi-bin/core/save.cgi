#!/usr/bin/python

import cgi
import os
import sys
import json
from util import excgi
from ProjectService import *
from UserService import *

print 'Content-type: text/javascript; charset=utf-8'

form = excgi.getForm()
project_id = form["pid"]
xml= form["xml"]

print ''

user = GetUser()

if user == None:
    print('null')
    sys.exit()

print json.dumps(saveProject(user, project_id, xml))
