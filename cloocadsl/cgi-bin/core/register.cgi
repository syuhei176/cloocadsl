#!/usr/bin/python
# coding : utf-8

import cgi
import os
import sys
import json
import re
import smtplib
sys.path.append('../')
from util import excgi
from UserService import *
from util.MySession import *

reg_email = re.compile('^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$')

print "Content-type: text/javascript; charset=utf-8"

form = excgi.getForm()

if not form.has_key("username"):
	print "false"
	sys.exit()

if not form.has_key("password"):
	print "false"
	sys.exit()

username = form["username"]
password = form["password"]
#email = form["email"][0]

if CreateUser(username, password):
	print "\ntrue"
else:
	print "\nfalse"