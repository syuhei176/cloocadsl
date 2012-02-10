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

metadiagram_id = form["id"][0]

obj0 = '{"id" : 0, "name" : "state", "graphic" : "rect"}'
obj1 = '{"id" : 1, "name" : "startstate", "graphic" : "circle"}'
obj2 = '{"id" : 2, "name" : "endstate", "graphic" : "fillcircle"}'
print '{"name" : "StateDiagram" , "objs" : ['+obj0+','+obj1+','+obj2+'] , "bindings" : [0,1,2] , "relations" : [0]}'