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
	print '{"metarelation_id" : 0 , "src" : 0, "dest" : 0}'
if metaobject_id == 1:
	print '{"metarelation_id" : 0 , "src" : 1, "dest" : 0}'
if metaobject_id == 2:
	print '{"metarelation_id" : 0 , "src" : 0, "dest" : 2}'
