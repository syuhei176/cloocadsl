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
pid = int(form["pid"])

user = GetUser()
if user == None:
    sys.exit()

print('')
result = deleteProject(user, pid)
print(json.dumps(result))
