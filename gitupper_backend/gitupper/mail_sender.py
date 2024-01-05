import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import environ
import os

env = environ.Env()
environ.Env.read_env()

username = os.environ.get("GMAIL_USERNAME") or env('GMAIL_USERNAME')
password = os.environ.get("GMAIL_APP_PASSWORD") or env('GMAIL_APP_PASSWORD')

FRONTEND_URL = os.environ.get('FRONTEND_URL') or env('FRONTEND_URL')


def send_mail(token=None, text='Email_body', subject='Hello word', from_email='', to_emails=[]):
    assert isinstance(to_emails, list)
    msg = MIMEMultipart('alternative')
    msg['From'] = from_email
    msg['To'] = ", ".join(to_emails)
    msg['Subject'] = subject
    txt_part = MIMEText(text, 'plain')
    msg.attach(txt_part)

    html_part = MIMEText(
        f"<p>Clique no botão abaixo ou insira o token disponível no fim deste email na página de reset de senha para resetar sua senha</p> <a href='{FRONTEND_URL}/reset-password/?token={token}'> <button> Resetar senha </button> </a> <p><h1>{token}</h1></p>", 'html')
    msg.attach(html_part)
    msg_str = msg.as_string()

    server = smtplib.SMTP(host='smtp.gmail.com', port=587)
    server.ehlo()
    server.starttls()
    server.login(username, password)
    server.sendmail(from_email, to_emails, msg_str)
    server.quit()