#!/usr/bin/python

import cgi
import os
import sys
import json
from Controller.MetaModelService import *

print "Content-type: text/javascript; charset=utf-8\n\n"

#if os.environ['REQUEST_METHOD'] != "POST":
#	print 'error'
#	sys.exit()

content_length = int(os.environ['CONTENT_LENGTH'])
form = cgi.parse_qs(sys.stdin.read(content_length))

metamodel_id = int(form["id"][0])

print json.dumps(GetMetaModel(metamodel_id))
