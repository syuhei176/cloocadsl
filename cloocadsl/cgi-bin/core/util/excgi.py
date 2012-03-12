import cgi
import os
import sys

def Header():
    sys.stdout.write('Content-type: text/javascript; charset=utf-8\n')

def Content():
    sys.stdout.write('\n\n')
    
def getForm():
    params = {}
    if os.environ['REQUEST_METHOD'] == "POST":
        content_length = int(os.environ['CONTENT_LENGTH'])
        form = cgi.parse_qs(sys.stdin.read(content_length))
        for k in form.keys():
            params[k] = form[k][0]
    if os.environ['REQUEST_METHOD'] == "GET":
        form = cgi.FieldStorage()
        for k in form.keys():
            params[k] = form[k].value
    return params

def getFormByPost():
    params = {}
    if os.environ['REQUEST_METHOD'] == "POST":
        content_length = int(os.environ['CONTENT_LENGTH'])
        form = cgi.parse_qs(sys.stdin.read(content_length))
        for k in form.keys():
            params[k] = form[k][0]
    if os.environ['REQUEST_METHOD'] == "GET":
        print "error"
        sys.exit()
    return params

def getFormByGet():
    params = {}
    if os.environ['REQUEST_METHOD'] == "POST":
        print "error"
        sys.exit()
    if os.environ['REQUEST_METHOD'] == "GET":
        form = cgi.FieldStorage()
        for k in form.keys():
            params[k] = form[k].value
    return params