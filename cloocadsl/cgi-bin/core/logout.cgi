#!/usr/bin/python

import cgi
import os
import sys
import json
from util.MySession import *

print "Content-type: text/html; charset=utf-8"

#if os.environ['REQUEST_METHOD'] != "POST":
#	print 'error'
#	sys.exit()

#content_length = int(os.environ['CONTENT_LENGTH'])
#form = cgi.parse_qs(sys.stdin.read(content_length))

#form = json.loads(sys.stdin.read(content_length))

#form = cgi.FieldStorage()

session = GetSession()
if session._is_new():
  print '\n'
  print 'false'
else:
  session.setMaxInactiveInterval(5)
  print '\n'
  print 'true'

