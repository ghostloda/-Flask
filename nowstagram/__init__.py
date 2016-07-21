# -*- endcoding=UTF-8 -*-
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
#定义一个应用/ 初始化
app=Flask(__name__)
app.jinja_env.add_extension('jinja2.ext.loopcontrols')
app.config.from_pyfile('app.conf')
app.secret_key='nowcoder'
db =SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view='/regloginpage/'   #如果没有注册，设置的自动要跳到的网页
from nowstagram import views,models
