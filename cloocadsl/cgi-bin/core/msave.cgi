#!/usr/bin/python

import cgi
import os
import sys
import json
from util import excgi
from MetaModelService import *
from UserService import *

print 'Content-type: text/javascript; charset=utf-8'

form = excgi.getForm()
id = form["id"]
xml= form["xml"]

print ''

user = GetUser()

if user == None:
    print('null')
    sys.exit()

print json.dumps(saveMetaModel(user, id, xml))
