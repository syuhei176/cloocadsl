#!/usr/bin/python

import cgi
import os
import sys
import json
sys.path.append('../')
from UserService import *

print "Content-type: text/javascript; charset=utf-8"

if os.environ['REQUEST_METHOD'] != "POST":
	print 'error'
	sys.exit()

user = CheckLoggedin()

#if not loginInfo.loggedin:
#  print "Location: http://127.0.0.1/DashBoard.html"

print '\n'

print json.dumps(user)

