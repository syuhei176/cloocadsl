#!/usr/bin/python

import cgi
import os
import sys
import json

print "Content-type: text/javascript; charset=utf-8\n"

#if os.environ['REQUEST_METHOD'] != "POST":
#	print 'error'
#	sys.exit()

content_length = int(os.environ['CONTENT_LENGTH'])
form = cgi.parse_qs(sys.stdin.read(content_length))

metarole_id = int(form["id"][0])

if metarole_id == 0:
  print '{"name" : "from" , "metaobj_id" : 0 }'
if metarole_id == 1:
  print '{"name" : "to" , "metaobj_id" : 0 }'
if metarole_id == 2:
  print '{"name" : "s_from" , "metaobj_id" : 1 }'
if metarole_id == 3:
  print '{"name" : "to_e" , "metaobj_id" : 2 }'