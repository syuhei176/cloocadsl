#!/usr/bin/python

import os
import sys
import json
sys.path.append('../')
from util import excgi
from UserService import *

excgi.Header()

form = excgi.getForm()

username = form["username"]
password = form["password"]
user = Login(username, password)
#delete passwd
if not user == None:
    user['passwd'] = '********'
    
excgi.Content()

print json.dumps(user)