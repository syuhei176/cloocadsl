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
id = form["id"]

print('')

user = GetUser()

if user == None:
    print('null')
    sys.exit()

project = loadMetaModel(user, id)
print(json.dumps(project))
