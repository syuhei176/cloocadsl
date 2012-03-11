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
from util.Gmail import *

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
email = form["email"][0]

if CreateUser(username, password):
	if reg_email.match(email):
		from_addr = 'hiya@clooca.com'
		to_addr = email
		session = GetSession()
		session.setAttribute("enablemail-id", session.getSessionID())
		session.setAttribute("email-address", email)
		fin_register_url = 'http://localhost/cgi/enablemail.cgi?id='+session.getSessionID()
		content = 'Thank you for register.\nyour name is '+username+'.\nplease login '+fin_register_url
		msg = create_message(from_addr, to_addr, 'clooca educational version', content)
		send_via_gmail(from_addr, to_addr, msg)
		print "\ntrue"
	else:
		print "\nfalse"
else:
	print "\nfalse"