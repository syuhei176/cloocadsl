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
    f.write(out)
    f.close()
    return out

if __name__ == '__main__':
    encode_module()
