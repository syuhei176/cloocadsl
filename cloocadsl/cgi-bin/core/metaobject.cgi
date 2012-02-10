#!/usr/bin/python

import cgi
import os
import sys
import json

print "Content-type: text/javascript; charset=utf-8\n\n"

#if os.environ['REQUEST_METHOD'] != "POST":
#	print 'error'
#	sys.exit()

content_length = int(os.environ['CONTENT_LENGTH'])
form = cgi.parse_qs(sys.stdin.read(content_length))

metaobject_id = int(form["id"][0])

if metaobject_id == 0:
	print '{"name" : "state" , "abstract" : 0 , "graphic" : 0 , "tool" : 1 }'
if metaobject_id == 1:
	print '{"name" : "startstate" , "abstract" : 0 , "graphic" : 1 , "tool" : 1 }'
if metaobject_id == 2:
	print '{"name" : "endstate" , "abstract" : 0 , "graphic" : 2 , "tool" : 1 }'
