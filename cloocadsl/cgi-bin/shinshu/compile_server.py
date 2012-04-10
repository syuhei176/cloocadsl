import cgi
import os
import sys
import json
import zipfile
import config
import itertools
import mimetools
import mimetypes
from cStringIO import StringIO
import urllib
import urllib2


def checkfile(fname, pname):
    if fname == pname + '.zip':
        return True
    return False

#URL='http://160.252.135.71'
#URL='http://localhost/cgi/testnxt.cgi'
#d = {"uploaded" : open(filepath)}
#req = urllib2.Request(URL, headers=d)
#u = urllib2.urlopen(req)
#print u.read()


class MultiPartForm(object):
    """Accumulate the data to be used when posting a form."""

    def __init__(self):
        self.form_fields = []
        self.files = []
        self.boundary = mimetools.choose_boundary()
        return
    
    def get_content_type(self):
        return 'multipart/form-data; boundary=%s' % self.boundary

    def add_field(self, name, value):
        """Add a simple field to the form data."""
        self.form_fields.append((name, value))
        return

    def add_file(self, fieldname, filename, fileHandle, mimetype=None):
        """Add a file to be uploaded."""
        body = fileHandle.read()
        if mimetype is None:
            mimetype = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
        self.files.append((fieldname, filename, mimetype, body))
        return
    
    def __str__(self):
        """Return a string representing the form data, including attached files."""
        parts = []
        part_boundary = '--' + self.boundary
        
        parts.extend(
            [ part_boundary,
              'Content-Disposition: form-data; name="%s"' % name,
              '',
              value,
            ]
            for name, value in self.form_fields
            )
        
        parts.extend(
            [ part_boundary,
              'Content-Disposition: file; name="%s"; filename="%s"' % \
                 (field_name, filename),
              'Content-Type: %s' % content_type,
              '',
              body,
            ]
            for field_name, filename, content_type, body in self.files
            )
        
        flattened = list(itertools.chain(*parts))
        flattened.append('--' + self.boundary + '--')
        flattened.append('')
        return '\r\n'.join(flattened)

def reserve(user, pid, pname):
    userpath = config.CLOOCA_CGI+'/out/' + user['uname']
    projectpath = userpath + '/p' + pid
    filepath = projectpath + '/' + pname + '.zip'
    if os.path.exists(projectpath) == True:
        if os.path.exists(filepath) == True:
            os.remove(filepath)
        zip = zipfile.ZipFile(filepath, 'w', zipfile.ZIP_DEFLATED)
        filelist=os.listdir(projectpath)
        for n in range(len(filelist)):
            if not checkfile(filelist[n].encode('ascii'), pname):
                zip.write(projectpath + '/' + filelist[n].encode('ascii'), filelist[n].encode('ascii'))
        zip.close()
        form = MultiPartForm()
        form.add_field('user_id', str(user['id']))
        form.add_field('user', user['uname'])
        form.add_file('file', 'test', open(filepath))
        
        request = urllib2.Request('http://160.252.135.71/upload')
        request.add_header('User-agent', 'PyMOTW (http://www.doughellmann.com/PyMOTW/)')
        body = str(form)
        request.add_header('Content-type', form.get_content_type())
        request.add_header('Content-length', len(body))
        request.add_data(body)
        
        res = urllib2.urlopen(request)
        if res.code == 200:
            return res.read()
        else:
            return None
    else:
        return None