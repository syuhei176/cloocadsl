#!/usr/bin/python

import cgi
import os
import sys
import json
sys.path.append('../')
from Controller.ModelCompiler import *


print 'Content-type: text/javascript; charset=utf-8\n'

if os.environ['REQUEST_METHOD'] != "POST":
	print 'error'
#	sys.exit()

#content_length = int(os.environ['CONTENT_LENGTH'])
#form = cgi.parse_qs(sys.stdin.read(content_length))

generator = BaseGenerator('t1.txt')

generator.GenerateCode();
