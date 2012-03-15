#!/usr/bin/python

import cgi
import os
import sys
import json
from util import excgi
from MetaModelService import *
from UserService import *

print('Content-type: text/javascript; charset=utf-8')

form = excgi.getForm()
name = form["name"]
xml = form["xml"]
visibillity = form["visibillity"]

user = GetUser()
if user == None:
    sys.exit()

print('')
project = createMetaModel(user, name, xml, visibillity)
print(json.dumps(project))
