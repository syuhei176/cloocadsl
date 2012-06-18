import os
import sys
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
    f.write('/* Copyright (C) 2012 Technical Rockstars Co.,Ltd. All Rights Reserved. */'+out)
    f.close()
    return out

import pexpect

SERVER = "175.41.241.201"
USER = "ec2-user"
SOMEDIR = "~/"
UPLOADDIR = "baz_dir"
PRIVATE_KEY = "/Users/hiyashuuhei/privatekey.pem"

remote_dirs = ['../www-dsl', '/var/www/www-dsl']

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

def access_aws():
    scp = pexpect.spawn('sftp -i %s %s@%s' % (PRIVATE_KEY, USER, SERVER))
    scp.expect('sftp>')
    scp.sendline('cd ../www-dsl')
    return scp

def access_qito():
    scp = pexpect.spawn('sftp %s@%s' % ('syuhei', '49.212.147.106'))
    scp.expect('sword: ', 10)
    scp.sendline('un1verse7')
    scp.expect('sftp>')
    scp.sendline('cd /var/www/www-dsl')
    return scp

def access_aws_www_group():
    scp = pexpect.spawn('sftp -i %s %s@%s' % (PRIVATE_KEY, "ubuntu", "54.248.98.237"))
    scp.expect('sftp>')
    scp.sendline('cd /var/www/www-group')
    return scp

def access_aws_www_game():
    scp = pexpect.spawn('sftp %s@%s' % ('syuhei', 'xxx.xxx.xxx.xxx'))
    scp.expect('sword: ', 10)
    scp.sendline('un1verse7')
    scp.expect('sftp>')
    scp.sendline('cd /var/www/www-game')
    return scp

def deploy_common(scp):
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
    cd(scp, '../../')


def deploy_group_edition(scp):
    cd(scp, 'cgi-bin/group')
    scp.expect('sftp>')
    scp.sendline('mput %s' % '*.py')
    scp.readline()
    print scp.readline()
    
    cd(scp, '../mvcs')
    scp.expect('sftp>')
    scp.sendline('mput %s' % '*.py')
    scp.readline()
    print scp.readline()
    
    cd(scp, '../../templates/group')
    scp.expect('sftp>')
    scp.sendline('mput %s' % '*.html')
    scp.readline()
    print scp.readline()
    
    cd(scp, '../../static/js/group')
    scp.expect('sftp>')
    scp.sendline('mput %s' % '*.js')
    scp.readline()
    print scp.readline()
    
    cd(scp, '../../../')
    send(scp, 'clooca_group.py')
    send(scp, 'mysite.wsgi')
    scp.expect('sftp>')
    scp.sendline('exit')
    scp.close()

def deploy_game_edition(scp):
    cd(scp, 'cgi-bin/core')
    scp.expect('sftp>')
    scp.sendline('mput %s' % '*.py')
    scp.readline()
    print scp.readline()

    cd(scp, '../game')
    scp.expect('sftp>')
    scp.sendline('mput %s' % '*.py')
    scp.readline()
    print scp.readline()
    
    cd(scp, '../mvcs')
    scp.expect('sftp>')
    scp.sendline('mput %s' % '*.py')
    scp.readline()
    print scp.readline()
    
    cd(scp, '../../templates/game')
    scp.expect('sftp>')
    scp.sendline('mput %s' % '*.html')
    scp.readline()
    print scp.readline()
    
    cd(scp, '../../static/js/game')
    scp.expect('sftp>')
    scp.sendline('mput %s' % '*.js')
    scp.readline()
    print scp.readline()
    
    cd(scp, '../../../')
    send(scp, 'clooca_game.py')
    send(scp, 'mysite.wsgi')
    scp.expect('sftp>')
    scp.sendline('exit')
    scp.close()

def deploy(server_name):
    if server_name == 'dsl':
        scp = access_aws()
        deploy_common(scp)
    elif server_name == 'group':
        scp = access_aws_www_group()
        deploy_common(scp)
        deploy_group_edition(scp)
    elif server_name == 'game':
        scp = access_aws_www_game()
        deploy_common(scp)
        deploy_game_edition(scp)
    elif server_name == 'www':
        pass
    elif server_name == 'dev':
        pass

if __name__ == '__main__':
    server_name = raw_input("input server name? >")
    encode_module()
    deploy(server_name)
