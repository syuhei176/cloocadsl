import sys
import os
import shutil
import MySQLdb
import json
from mako.template import Template
from mako.lookup import TemplateLookup
from mako.runtime import Context
from StringIO import StringIO
import config
import codecs
from ProjectService import *
from MetaModelService import *
import TemplateService
from string import Template as stringTemplate
from mako.exceptions import RichTraceback
import CodeGenerator

def CreateClass():
    class klass: pass
    setattr(klass, 'name', None)
    return klass

def GenerateClass(dict):
    class klass: pass
    for k in dict.keys():
        setattr(klass, k, None)

class BaseGenerator(object):
    
    def __init__(self):
        self.input = config.CLOOCA_CGI + '/template'
        self.outpath = config.CLOOCA_CGI + '/out'
        self.userpath = None
        self.projectpath = None
        self.model = None
        self.templates = {}
    
    def GenerateCode(self, user, pid, target):
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        project = loadProject(user, pid, connect)
        metamodel = loadMetaModel(connect, user, project['metamodel_id'], check=False)
        files = TemplateService.tree(project['metamodel_id'], connect)
        connect.close()
        for f in files:
            if f['path'] == target:
                self.templates[f['name']] = f['content']
        self.input = self.input + '/t' + str(metamodel['id'])
        self.userpath = self.outpath + '/' + user['uname']
        self.projectpath = self.userpath + '/p' + str(project['id'])
        if not os.path.exists(self.userpath):
            os.mkdir(self.userpath)
        #clear directory
        shutil.rmtree(self.projectpath)
        if not os.path.exists(self.projectpath):
            os.mkdir(self.projectpath)
        #
        self.model = parseJSON(project['xml'], metamodel['xml'])
        global message
        message = ''
        wbconf = json.loads(metamodel['config']);
        for t in wbconf['targets']:
            if t['name'] == target:
                self.parseXML(t)
        return message
    
    def parseXML(self, target_conf):
        for m in target_conf['mapping']:
            self.parseDirTemp(m)
    
    def parseDirTemp(self, m):
        if m['type'] == 'template':
            self.parseTemplate(m)
        if m['type'] == 'template_diagram':
            self.parseTemplateForDiagram(m)
        if m['type'] == 'copy':
            self.parseCopy(m)
    
    def parseTemplate(self, m):
        src = m['src']
        dest = m['dest']
        self.FileGen(src, dest)

    def parseTemplateForDiagram(self, m):
        src = m['src']
        dest = m['dest']
        diagram = m['diagram']
        for key in self.model.diagrams:
            if str(self.model.diagrams[key].meta_id) == str(diagram):
                template = stringTemplate(dest)
                d = {'id': self.model.diagrams[key].id}
                self.FileGenByDiagram(src, template.substitute(d), self.model.diagrams[key])
    
    def parseCopy(self, m):
        src = m['src']
        dest = m['dest']
        self.templates[src]
        hf = codecs.open(self.projectpath + '/' + dest, 'w', encoding='utf-8')
        hf.write(self.templates[src])
        hf.close()
    
    def FileGen(self, src, dest):
        try:
            tmpl = Template(u''+self.templates[src], input_encoding='utf-8')
            buf = StringIO()
            model = self.model
            ctx = Context(buf, root = model)
            tmpl.render_context(ctx)
            hf = codecs.open(self.projectpath + '/' + dest, 'w', encoding='utf-8')
            hf.write(buf.getvalue())
            hf.close()
        except Exception as e:
            global message
            message += e.message
    
    def FileGenByDiagram(self, src, dest, diagram):
        try:
            tmpl = Template(self.templates[src], input_encoding='utf-8')
            buf = StringIO()
            model = diagram
            ctx = Context(buf, root = model)
            tmpl.render_context(ctx)
            hf = codecs.open(self.projectpath + '/' + dest, 'w', encoding='utf-8')
            hf.write(buf.getvalue())
            hf.close()
        except Exception as e:
            global message
            message += e.message
