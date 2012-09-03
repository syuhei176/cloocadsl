import json

class CloocaResponse(object):
    def __init__(self,code=0,content='',success=False):
        self.code = code
        self.content = content
        self.success = success
    
    def dumps(self):
        return json.dumps({'code':self.code,'content':self.content,'success':self.success})