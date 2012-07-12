import sha, time, Cookie, os, shelve

def GetSession():
  cookie = Cookie.SimpleCookie(os.environ.get('HTTP_COOKIE', ''))
#  string_cookie = os.environ.get('HTTP_COOKIE')
  if not cookie.has_key('csid'):
    sid = sha.new(repr(time.time())).hexdigest()
    cookie['csid'] = sid
    _is_new = True
    print cookie
  else:
#    cookie.load(string_cookie)
#    if cookie.has_key('sid'):
    sid = cookie['csid'].value
    _is_new = False
#    else:
#      sid = sha.new(repr(time.time())).hexdigest()
#      cookie['sid'] = sid
#      _is_new = True
  cookie['csid']['expires'] = 7 * 24 * 60 * 60
  cookie['csid']['httponly'] = True
  cookie['csid']['secure'] = False
  return Session(cookie, _is_new)


class Session:
  def __init__(self, cookie, __is_new):
    self.cookie = cookie
    self.__is_new = __is_new
      #    session_dir = os.environ['DOCUMENT_ROOT'] + '/tmp/session'
    session_dir = '/tmp/session'
    self.attrs = shelve.open(session_dir + '/sess_' + cookie['csid'].value, writeback=True)

  def getSessionID(self):
    return self.cookie['csid'].value

  def _is_new(self):
    return self.__is_new

  def setMaxInactiveInterval(self, interval):
    self.cookie['csid']['expires'] = interval
    print self.cookie

  def setAttribute(self, attr, value):
    self.attrs[attr] = value

  def getAttribute(self, attr):
    if self.attrs.has_key(attr):
      return self.attrs[attr];
    return None

  def delAttribute(self, attr):
    del self.attrs[attr]

