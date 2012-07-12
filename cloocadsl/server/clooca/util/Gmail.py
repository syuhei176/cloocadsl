import cgi
import os
import sys
import smtplib
from email.MIMEText import MIMEText
from email.Utils import formatdate

def create_message(from_addr, to_addr, subject, body):
    msg = MIMEText(body.encode('utf-8'))
    msg.set_charset('utf-8')
    msg['Subject'] = subject
    msg['From'] = from_addr
    msg['To'] = to_addr
    msg['Date'] = formatdate()
    return msg

def send_via_gmail(from_addr, to_addr, msg):
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.ehlo()
    s.starttls()
    s.ehlo()
    s.login('confirm@clooca.com', 'fj3fh4aw')
    s.sendmail(from_addr, [to_addr], msg.as_string())
    s.close()