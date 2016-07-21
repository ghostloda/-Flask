# -*- coding:utf-8 -*-
from flask import Flask,render_template,request,make_response,redirect,flash,get_flashed_messages


app = Flask(__name__)
'''flash message
发送
获取接口信息，flash(msg)
获取
get_flashed_messages
属性
通过session传递信息
'''
app.secret_key="nowcoder" #确保session ID能产生
@app.route('/')
def hello_world():
    res = ''
    for msg in get_flashed_messages():
        res = res + msg+'<br>'
    res += 'hello'
    return res

@app.route('/login')
def login():
    flash('登录成功')
    return redirect('/') #跳转
if __name__ == '__main__':
    app.run()
