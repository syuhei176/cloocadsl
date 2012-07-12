import sys
import os
import shutil
import json
from mako.template import Template
from mako.lookup import TemplateLookup
from mako.runtime import Context
from StringIO import StringIO
import config
import codecs
from string import Template as stringTemplate
from mako.exceptions import RichTraceback

def parseJSON(xml, meta_text):
    global g_metamodel_dict
    global g_model_dict
    g_metamodel_dict = json.loads(meta_text)
    g_model_dict = json.loads(xml)
    ConfigureEntity()
    ConfigureReference()
    return g_model

"""
"""
def ConfigureEntity():
    global g_model
    class klass: pass
    setattr(klass, 'diagrams', {})
    setattr(klass, 'objects', {})
    setattr(klass, 'relationships', {})
    setattr(klass, 'properties', {})
    g_model = klass()
    for key in g_model_dict['diagrams']:
        if not g_model_dict['diagrams'][key]['ve']['ver_type'] == 'delete':
            g_model.diagrams[key] = dict2object(g_model_dict['diagrams'][key])
    for key in g_model_dict['objects']:
        if not g_model_dict['objects'][key]['ve']['ver_type'] == 'delete':
            g_model.objects[key] = dict2object(g_model_dict['objects'][key])
    for key in g_model_dict['relationships']:
        if not g_model_dict['relationships'][key]['ve']['ver_type'] == 'delete':
            g_model.relationships[key] = dict2object(g_model_dict['relationships'][key])
    for key in g_model_dict['properties']:
        if not g_model_dict['properties'][key]['ve']['ver_type'] == 'delete':
            g_model.properties[key] = dict2object(g_model_dict['properties'][key])

def dict2object(d):
    class klass: pass
    for key in d:
        if isinstance(d[key], dict):
            setattr(klass, key, dict2object(d[key]))
        elif isinstance(d[key], list):
            setattr(klass, key, list2object(d[key]))
        else:
            setattr(klass, key, d[key])
    return klass()

def list2object(l):
    ret = []
    for e in l:
        if isinstance(e, dict):
            ret.append(dict2object(e))
        elif isinstance(e, list):
            ret.append(list2object(e))
        else:
            ret.append(e)
    return ret


def ConfigureReference():
    diagram = g_model.diagrams[str(g_model_dict['root'])]
    meta_diagram = g_metamodel_dict['metadiagrams'][str(diagram.meta_id)]
    setattr(g_model, meta_diagram['name'], diagram)
    for key in g_model.diagrams:
        for obj_id in g_model.diagrams[key].objects:
            if g_model.objects.has_key(str(obj_id)):
                obj = g_model.objects[str(obj_id)]
                meta_name = g_metamodel_dict['metaobjects'][str(obj.meta_id)]['name']
                if not hasattr(g_model.diagrams[key], meta_name):
                    setattr(g_model.diagrams[key], meta_name, [])
                getattr(g_model.diagrams[key], meta_name).append(obj)
        for rel_id in g_model.diagrams[key].relationships:
            if g_model.relationships.has_key(str(rel_id)):
                rel = g_model.relationships[str(rel_id)]
                meta_name = g_metamodel_dict['metarelations'][str(rel.meta_id)]['name']
                if not hasattr(g_model.diagrams[key], meta_name):
                    setattr(g_model.diagrams[key], meta_name, [])
                getattr(g_model.diagrams[key], meta_name).append(rel)
    for key in g_model.objects:
        if not g_model.objects[key].diagram == None:
            g_model.objects[key].diagram = g_model.diagrams[str(g_model.objects[key].diagram)]
        for plist in g_model.objects[key].properties:
            for prop_id in plist.children:
                if g_model.properties.has_key(str(prop_id)):
                    prop = g_model.properties[str(prop_id)]
                    meta_name = g_metamodel_dict['metaproperties'][str(plist.meta_id)]['name']
                    if not hasattr(g_model.objects[key], meta_name):
                        setattr(g_model.objects[key], meta_name, [])
                    getattr(g_model.objects[key], meta_name).append(prop)
    for key in g_model.relationships:
        g_model.relationships[key].src = g_model.objects[str(g_model.relationships[key].src)]
        g_model.relationships[key].dest = g_model.objects[str(g_model.relationships[key].dest)]
        for plist in g_model.relationships[key].properties:
            for prop_id in plist.children:
                if g_model.properties.has_key(str(prop_id)):
                    prop = g_model.properties[str(prop_id)]
                    meta_name = g_metamodel_dict['metaproperties'][str(plist.meta_id)]['name']
                    if not hasattr(g_model.relationships[key], meta_name):
                        setattr(g_model.relationships[key], meta_name, [])
                    getattr(g_model.relationships[key], meta_name).append(prop)


