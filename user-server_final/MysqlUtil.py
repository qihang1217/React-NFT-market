# -*- coding:utf-8 -*-
import pymysql
from run import db

pymysql.install_as_MySQLdb()

# 单表查询的数据转换为dict,然后可以jsonfiy
def class_to_dict(obj):
    is_list = obj.__class__ == [].__class__
    is_set = obj.__class__ == set().__class__
    if is_list or is_set:
        obj_arr = []
        for o in obj:
            dict = {}
            a = o.__dict__
            if "_sa_instance_state" in a:
                del a['_sa_instance_state']
            dict.update(a)
            obj_arr.append(dict)
        return obj_arr
    else:
        dict = {}
        a = obj.__dict__
        if "_sa_instance_state" in a:
            del a['_sa_instance_state']
        dict.update(a)
        return dict
# {
#   "real_name": "1",
#   "id_number": "1",
#   "age": "1",
#   "email": "1",
#   "prefix": "86",
#   "phone_number": "1",
#   "gender": "男",
#   "user_name": "1",
#   "password": "tF0l/p7VDxtzFoAijp2kEQ==",
#   "confirm": "1",
#   "agreement": true,
#   "email_end": "@qq.com"
# }

# 创建模型类 - Models
class Users(db.Model):
    # 创建Users类，映射到数据库中叫Users表
    __tablename__ = "Users"
    # 创建字段： id， 主键和自增涨
    user_id = db.Column(db.Integer, primary_key=True)
    # 创建字段：username， 长度为20的字符串，不允许为空
    real_name = db.Column(db.String(20), nullable=False)
    # 创建字段：id_name， 长度为18的字符串，不允许为空
    id_number = db.Column(db.String(18), nullable=False)
    # 创建字段：age，整数，不允许为空
    age = db.Column(db.Integer, nullable=False)
    # 创建字段：email，长度为30的字符串，不允许为空
    email = db.Column(db.String(30), nullable=False)
    # 创建字段：phone_number， 长度为20的字符串，不允许为空
    phone_number = db.Column(db.String(20), nullable=False)
    # 创建字段：gender， 长度为20的字符串，不允许为空
    gender = db.Column(db.String(2), nullable=False)
    # 创建字段：user_name， 长度为20的字符串，不允许为空,不可重复
    user_name = db.Column(db.String(20), nullable=False, unique=True)
    # 创建字段：password，长度为44的字符串(存储加密后的密码)，不允许为空
    password = db.Column(db.String(44), nullable=False)

class Products(db.Model):
    # 创建Roles类，映射到数据库中叫Roles表
    __tablename__ = "Products"
    # 创建字段： role_id， 主键和自增涨
    product_id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(20))
    owner_id = db.Column(db.String(20),db.ForeignKey('Users.user_id'))
    price=db.Column(db.Integer)
    pass_status=db.Column(db.Boolean)
    file_url=db.Column(db.String(100))
    description=db.Column(db.Text)

# 将创建好的实体类映射回数据库
# db.create_all()


staffColumns = ("id", "service", "money", "card_number", "name", "phone", "project", \
                "shop_guide", "teacher", "financial", "remarks1", "collect_money", "remarks2")  # id没写可把我害惨了

staffColumns = ("id", "real_name", "id_name", "age", "email", "phone_number", "gender", "user_name", "password")


def addOrUpdateUsers(user_data):
    try:
        # 获取用户id,没有则赋为0
        id = user_data.get('id', 0)
        result = ''
        new_id = id
        perfix = user_data.get('prefix')
        email_end = user_data.get('email_end')
        # 删除与数据库无关的字段
        del user_data['confirm']
        del user_data['agreement']
        # 插入
        if id == 0:
            # 防止用户名重复
            res = db.session.query(Users).filter(Users.user_name == user_data['user_name']).all()
            db.session.commit()
            if len(res) == 0:
                keys = ''
                values = ''
                isFirst = True

                for key, value in user_data.items():
                    # 组装成正确的phone_number
                    if key == 'prefix':
                        continue
                    if key == 'phone_number':
                        value = perfix + '-' + value
                    # 组装成正确的email
                    if key == 'email_end':
                        continue
                    if key == 'email':
                        value = value + email_end
                    if isFirst:
                        isFirst = False
                    else:
                        keys += ','
                        values += ','
                    keys += key
                    if isinstance(value, str):
                        values += ("'%s'" % value)
                    else:
                        values += str(value)

                sql = "INSERT INTO Users (%s) values (%s)" % (keys, values)
                # print(sql)
                result = db.session.execute(sql)
                db.session.commit()
                # 获取插入数据后的主键id
                new_id = result.lastrowid
                result = '添加成功'
                # print(result)
            else:
                result = '用户名重复'
        else:
            # 修改
            update = ''
            isFirst = True
            for key, value in user_data.items():
                if key == 'id':
                    # 这个字段不用考虑，隐藏的
                    continue
                if isFirst:
                    isFirst = False
                else:
                    update += ','  # 相当于除了第一个，其他的都需要在最前面加','
                if value == None:
                    value = ""
                if isinstance(value, str):
                    update += (key + "='" + value + "'")
                else:
                    update += (key + "=" + str(value))
            where = "where id=" + str(id)
            sql = "update Users set %s %s" % (update, where)
            # print("=="*30)
            print(sql)
            db.session.execute(sql)
            db.session.commit()
            result = '更新成功'
            print(result)
        re = {
            'code': 0,
            'id': new_id,
            'message': result
        }
        return re
    except Exception as e:
        print(repr(e))
        re = {
            'code': -1,
            'message': repr(e)
        }
        return re
    finally:
        db.session.close()


def checkUserNameRepeat(user_data):
    # 防止用户名重复
    res = db.session.query(Users).filter(Users.user_name == user_data['user_name']).all()
    db.session.commit()
    if len(res) == 0:
        result = '用户名不重复'
    else:
        result = '用户名重复'
    re = {
        'code': 0,
        'message': result
    }
    db.session.close()
    return re


def checkUsers(user_data):
    # 验证密码是否正确
    try:
        res = db.session.query(Users).filter(Users.user_name == user_data['user_name']).all()
        db.session.commit()
        if len(res) == 0:
            re = {
                'status': -1,
                'message': "用户不存在"
            }
        else:
            # print(res[0])
            if user_data["password"] == res[0].password:
                # 验证成功
                re = {
                    'status': 0,
                    'message': "验证成功",
                    'data': class_to_dict(res)
                }
            else:
                re = {
                    'status': -1,
                    'message': "验证失败"
                }
            return re
        return re
    except Exception as e:
        print(repr(e))
        re = {
            'status': -1,
            'message': repr(e)
        }
        return re
    finally:
        db.session.close()

def saveUploadPorduct(product_data,upload_file_url):
    user_data=eval(product_data.get('user_data'))
    user_id=user_data.get('user_id')
    work_name=product_data.get('work_name')
    introduction=product_data.get('introduction')
    price = product_data.get('price')
    if introduction == 'undefined':
        introduction=''
    product=Products(product_name=work_name,owner_id=user_id,file_url=upload_file_url,pass_status=False,description=introduction,price=price)
    db.session.add(product)
    db.session.commit()