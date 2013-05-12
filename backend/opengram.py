import cgi
import datetime
import urllib
import webapp2

from google.appengine.ext import db
from google.appengine.api import users

class Pictbook(db.Model):
  """Models an individual picture"""
  #user = db.StringProperty()
  phone_id = db.StringProperty()
  comment = db.StringProperty()
  location = db.GeoPtProperty(default=None)
  picture = db.BlobProperty(default=None)
  date = db.DateTimeProperty(auto_now_add=True)
  
def phone_key(phone_id=None):
  """Constructs a Datastore key for a phone"""
  return db.Key.from_path('Pictbook', phone_id or 'default_phone')
  
class GetImage(webapp2.RequestHandler):
  def get(self):
      title = self.request.get('comment')
      image = getPicture(title)
      if (image and image.picture):
          self.response.headers['Content-Type'] = 'image/jpeg'
          self.response.out.write(image.picture)
      else:
          self.redirect('/static/noimage.jpg')

def getPicture(title):
    result = db.GqlQuery("SELECT * FROM Pictbook WHERE comment = :1 LIMIT 1",title).fetch(1)
    if (len(result) > 0):
        return result[0]
    else:
        return None

class MainPage(webapp2.RequestHandler):
  def get(self):
    phone_id=self.request.get('phone_id')
    self.response.out.write('<html><body>')     
    self.response.write('<blockquote>%s</blockquote>' % phone_id)
    self.response.write('<blockquote>OK</blockquote>')
   
class ReceivePict(webapp2.RequestHandler):
  def post(self):
    phone_id = self.request.get('phone_id')
    pictbook = Pictbook(parent=phone_key(phone_id))
    pictbook.phone_id = self.request.get('phone_id')
    pictbook.comment = self.request.get('comment')
    pictbook.location = self.request.get('location')
    pictbook.picture = self.request.get('file')
    pictbook.put()
    self.response.headers['Content-Type'] = 'text/plain'
    self.response.write('OK added!')
    
app = webapp2.WSGIApplication([('/', MainPage),
                               ('/image', GetImage),
                               ('/receive', ReceivePict)],
                               debug=True)