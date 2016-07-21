# -*- endcoding=UTF-8 -*-
from nowstagram import app,db
from flask_script import Manager
from nowstagram.models import User,Image,Comment
from sqlalchemy import or_,and_
import random

manager = Manager(app)

def get_image_url():
   return 'http://images.nowcoder.com/head/' + str(random.randint(0, 1000)) + 'm.png'
@manager.command
def init_database():
    db.drop_all()
    db.create_all()
    for i in range(0,100):  #创建一百个用户 做下测试
        db.session.add(User('User'+str(i),'a'+str(i)))
        for j in range(0,10):
            db.session.add(Image(get_image_url(),i+1))
            for k in range(0,10):
                db.session.add(Comment('this is a comment'+str(k),1+3*i+j,i+1))
    db.session.commit()
    #更新
    for i in range(50,100,2):
        user =  User.query.get(i)
        user.username='[New]' + user.username

    #第二种更新方法
    User.query.filter_by(id=49).update({'username':'[new2]'})
    db.session.commit()

    #删除工作
    for i in range(50,100,2):
        comment = Comment.query.get(i+1)
        db.session.delete(comment)
    db.session.commit()
    #查询工作
    print 1,User.query.all()
    print 2,User.query.get(3)
    print 3,User.query.filter_by(id=5).first()
    print 4,User.query.order_by(User.id.desc()).offset(1).limit(2).all() #逆序 摘除一位 取两个
    print 5,User.query.filter(User.username.endswith('0')).limit(3).all()
    print 6,User.query.filter(or_(User.id==88,User.id==99)).all()
    print 7,User.query.filter(and_(User.id>88,User.id<93)).all()
    print 8,User.query.paginate(page=1,per_page=10).items  #分页
    user = User.query.get(1)
    print 9,user.images
    image =Image.query.get(1)
    print 10,image,image.user
    '''
python manage.py init_database
测试结果如下：
2 <User 3 User2 >
3 <User 5 User4 >
4 [<User 99 User98 >, <User 98 User97 >]
5 [<User 1 User0 >, <User 11 User10 >, <User 21 User20 >]
6 [<User 88 User87 >, <User 99 User98 >]
7 [<User 89 User88 >, <User 90 User89 >, <User 91 User90 >, <User 92 User91 >]
8 [<User 1 User0 >, <User 2 User1 >, <User 3 User2 >, <User 4 User3 >, <User 5 User4 >, <User 6 User5 >, <User 7 User6 >, <User 8 User7 >, <User 9 User8 >, <User 10 User9 >]
'''
if __name__ == '__main__':
    manager.run()
