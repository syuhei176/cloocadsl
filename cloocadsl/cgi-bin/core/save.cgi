#!/usr/bin/python

import cgi
import os
import sys
import json
from Controller.CommandService import *

print 'Content-type: text/javascript; charset=utf-8'

if os.environ['REQUEST_METHOD'] != "POST":
	print 'error'
	sys.exit()

content_length = int(os.environ['CONTENT_LENGTH'])
form = cgi.parse_qs(sys.stdin.read(content_length))

project_id = form["pid"][0]
command = form["command"][0]

print ''
print json.dumps(ParseCommand(project_id, command))
