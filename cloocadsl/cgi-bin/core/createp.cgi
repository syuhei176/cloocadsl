#!/usr/bin/python

import cgi
import os
import sys
import json
from util import excgi
from ProjectService import *
from UserService import *

print('Content-type: text/javascript; charset=utf-8')

form = excgi.getForm()
name = form["name"]
xml = form["xml"]
metamodel_id = form["metamodel_id"]

user = GetUser()
if user == None:
    sys.exit()

print('')
project = createProject(user, name, xml, metamodel_id)
print(json.dumps(project))
