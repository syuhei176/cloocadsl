import os
import config
from slimit import minify

modulelist = ['core', 'editor','workbench']

def encode_module():
    for m in modulelist:
        listingfile(m)
        
def listingfile(m):
    content = ''
    for f in os.listdir(config.CLOOCA_ROOT+'/static/js/dev/'+m):
        print 'm='+m+',f='+f
        filepath = config.CLOOCA_ROOT + '/static/js/dev/' + m + '/' + f
        if os.path.isfile(filepath):
            fd = open(filepath, 'r')
            for line in fd:
                content += line
            fd.close()
            content += '\n'
    out =  minify(content, mangle=True)
    f = open(config.CLOOCA_ROOT+'/static/js/'+m+'.js', 'w')
    f.write('/* Copyright (C) 2012 clooca All Rights Reserved. */'+out)
    f.close()
    return out

import pexpect

SERVER = "175.41.241.201"
USER = "ec2-user"
SOMEDIR = "~/"
UPLOADDIR = "baz_dir"
PRIVATE_KEY = "/Users/hiyashuuhei/privatekey.pem"


def cd(scp, path):
    scp.expect('sftp>')
    scp.sendline('cd %s' % path)
    scp.readline()
#    print scp.readline()
    scp.expect('sftp>')
    scp.sendline('lcd %s' % path)
    scp.readline()
#    print scp.readline()
    
def send(scp, fname):
    scp.expect('sftp>')
    scp.sendline('put %s' % fname)
    scp.readline()
    print scp.readline()
    
def deploy():
    scp = pexpect.spawn('sftp -i %s %s@%s' % (PRIVATE_KEY, USER, SERVER))
    scp.expect('sftp>')
    scp.sendline('cd ../www-dsl')
    print scp.readline()
    scp.expect('sftp>')
    scp.sendline('ls')
    scp.readline()
    print scp.readline()
    scp.expect('sftp>')
    scp.sendline('lls')
    scp.readline()
    print scp.readline()
    
    cd(scp, 'static/js')
    
    send(scp, 'core.js')
    send(scp, 'editor.js')
    send(scp, 'workbench.js')
    cd(scp, '../../cgi-bin/core')
    
    scp.expect('sftp>')
    scp.sendline('mput *.py')
    scp.readline()
    print scp.readline()
    
    cd(scp, '../mvcs')
    
    scp.expect('sftp>')
    scp.sendline('mput %s' % '*.py')
    scp.readline()
    print scp.readline()
    
    cd(scp, '../../')
    send(scp, 'clooca.py')
    send(scp, 'mysite.wsgi')
    scp.expect('sftp>')
    scp.sendline('exit')
    scp.close()

if __name__ == '__main__':
    encode_module()
    deploy()
