# -*- coding:utf-8 -*-
import random
import pymysql
from sqlalchemy import and_
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


# 查询结果转换成json
class MixToJson:
    # 查询单条数据
    def single_to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    # 多条数据
    def double_to_dict(self):
        result = {}
        for key in self.__mapper__.c.keys():
            if getattr(self, key) is not None:
                result[key] = str(getattr(self, key))
            else:
                result[key] = getattr(self, key)
        return result

    # 配合double_to_dict一起使用
    @staticmethod
    def double_to_json(all_vendors):
        v = [ven.double_to_dict() for ven in all_vendors]
        return v


# 创建模型类 - Models
class Users(db.Model, MixToJson):
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


class Categories(db.Model, MixToJson):
    # 创建Categories类，映射到数据库中叫Categories表
    __tablename__ = "Categories"
    # 创建字段： role_id， 主键和自增涨
    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(20), unique=True)


class Products(db.Model, MixToJson):
    # 创建Products类，映射到数据库中叫Products表
    __tablename__ = "Products"
    # 创建字段： product_id， 主键和自增涨
    product_id = db.Column(db.Integer, primary_key=True)
    token_id = db.Column(db.Integer, unique=True)
    product_name = db.Column(db.String(20))
    owner_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'))
    price = db.Column(db.Integer)
    # 通过状态.是否通过审核
    pass_status = db.Column(db.Boolean, default=False)
    # 审核状态,是否已经审核
    examine_status = db.Column(db.Boolean, default=False)
    # 用户有一次重复提交的机会
    usable_chances = db.Column(db.Integer, default=2)
    # 公开状态
    open_status = db.Column(db.Boolean, default=False)
    # 伪删除状态
    delete_status = db.Column(db.Boolean, default=False)
    # 铸造状态
    mint_status = db.Column(db.Boolean, default=False)
    # 防止文件名可能的重复
    file_url = db.Column(db.String(30), unique=True)
    file_type = db.Column(db.String(100))
    token_url = db.Column(db.String(80), unique=True)
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('Categories.category_id'))
    like_count = db.Column(db.Integer, default=0)
    view_count = db.Column(db.Integer, default=0)


class Comments(db.Model, MixToJson):
    # 创建Comments类，映射到数据库中叫Comments表
    __tablename__ = "Comments"
    # 创建字段： comment_id， 主键和自增涨
    comment_id = db.Column(db.Integer, primary_key=True)
    comment_content = db.Column(db.Text, nullable=False)
    create_time = db.Column(db.String(13), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("Users.user_id"))
    user_name = db.Column(db.String(20), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("Products.product_id"))
    like_count = db.Column(db.Integer, default=0)


# 将创建好的实体类映射回数据库
db.create_all()

staffColumns = ("id", "real_name", "id_name", "age", "email", "phone_number", "gender", "user_name", "password")


def add_or_update_users(user_data):
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
            'status': 0,
            'id': new_id,
            'message': result
        }
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


def check_username_repeat(user_data):
    # 防止用户名重复
    try:
        res = db.session.query(Users).filter(Users.user_name == user_data['user_name']).all()
        db.session.commit()
        if len(res) == 0:
            result = '用户名不重复'
        else:
            result = '用户名重复'
        re = {
            'status': 0,
            'message': result
        }
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


def check_users(user_data):
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


def save_upload_product(product_data, upload_file_url):
    user_data = eval(product_data.get('user_data'))
    user_id = user_data.get('user_id')
    work_name = product_data.get('work_name')
    introduction = product_data.get('introduction')
    price = product_data.get('price')
    category_id = product_data.get('category_id')
    file_type = product_data.get('file_type')
    if introduction == 'undefined':
        introduction = ''
    product = Products(product_name=work_name, owner_id=user_id, file_url=upload_file_url, file_type=file_type,
                       pass_status=False, open_status=False,
                       examine_status=False, description=introduction, price=price, category_id=category_id)
    db.session.add(product)
    db.session.commit()


def get_categories():
    try:
        return class_to_dict(db.session.query(Categories).all()), 0
    except Exception as e:
        print(repr(e))
        return [{}], -1
    finally:
        db.session.close()


def get_own_product_list(user_id):
    try:
        return class_to_dict(Products.query.filter(Products.owner_id == user_id).all()), 0
    except Exception as e:
        print(repr(e))
        return [{}], -1
    finally:
        db.session.close()


def resubmit_product(product_id):
    try:
        Products.query.filter(Products.product_id == product_id).update({'examine_status': False})
        db.session.commit()
        return 0
    except Exception as e:
        print(repr(e))
        return -1
    finally:
        db.session.close()


def delete_product(product_id):
    try:
        Products.query.filter(Products.product_id == product_id).update({'delete_status': True})
        db.session.commit()
        return 0
    except Exception as e:
        print(repr(e))
        return -1
    finally:
        db.session.close()


def get_product_by_id(product_id):
    try:
        res = Products.query.get(product_id)
        db.session.commit()
        return res.single_to_dict(), 0
    except Exception as e:
        print(repr(e))
        return [{}], -1
    finally:
        db.session.close()


def set_minted_product_by_id(product_id, tokenId, token_url):
    try:
        Products.query.filter(Products.product_id == product_id).update(
            {Products.mint_status: True, Products.token_url: token_url, Products.token_id: tokenId})
        db.session.commit()
        return 0
    except Exception as e:
        print(repr(e))
        return -1
    finally:
        db.session.close()


def update_user_info(user_id, key, value):
    try:
        Users.query.filter(Users.user_id == user_id).update({key: value})
        db.session.commit()
        return 0
    except Exception as e:
        print(repr(e))
        return -1
    finally:
        db.session.close()


def get_category_by_id(category_id):
    try:
        res = Categories.query.filter(Categories.category_id == category_id).first()
        db.session.commit()
        return res.single_to_dict(), 0
    except Exception as e:
        print(repr(e))
        return [{}], -1
    finally:
        db.session.close()


def get_comments_by_product_id(product_id):
    try:
        res = class_to_dict(Comments.query.filter(Comments.product_id == product_id).all())
        db.session.commit()
        return res, 0
    except Exception as e:
        print(repr(e))
        return [{}], -1
    finally:
        db.session.close()


def add_comment(comment_data):
    try:
        comment = Comments(comment_content=comment_data.get('commentContent'),
                           create_time=comment_data.get('timestamp'),
                           user_id=comment_data.get('userId'), user_name=comment_data.get('userName'),
                           product_id=comment_data.get('productId'))
        db.session.add(comment)
        db.session.commit()
        return 0
    except Exception as e:
        print(repr(e))
        return -1
    finally:
        db.session.close()


def comment_like(comment_id, action):
    try:
        comment = Comments.query.filter(Comments.comment_id == comment_id).first()
        if action == 'add':
            comment.like_count = comment.like_count + 1
        elif action == 'reduce':
            comment.like_count = comment.like_count - 1
        else:
            return -1
        db.session.commit()
        return 0
    except Exception as e:
        print(repr(e))
        return -1
    finally:
        db.session.close()


def product_open(product_id, action):
    try:
        product = Products.query.filter(Products.product_id == product_id).first()
        if action == 'open':
            product.open_status = True
        elif action == 'close':
            product.open_status = False
        else:
            return -1
        db.session.commit()
        return 0
    except Exception as e:
        print(repr(e))
        return -1
    finally:
        db.session.close()


def get_user_by_id(user_id):
    try:
        user = Users.query.filter(Users.user_id == user_id).first()
        db.session.commit()
        return user.single_to_dict(), 0
    except Exception as e:
        print(repr(e))
        return [{}], -1
    finally:
        db.session.close()


def product_like(product_id, action):
    try:
        product = Products.query.filter(Products.product_id == product_id).first()
        if action == 'add':
            product.like_count = product.like_count + 1
        elif action == 'reduce':
            product.like_count = product.like_count - 1
        else:
            return -1
        db.session.commit()
        return 0
    except Exception as e:
        print(repr(e))
        return -1
    finally:
        db.session.close()


def product_view(product_id):
    try:
        product = Products.query.filter(Products.product_id == product_id).first()
        product.view_count = product.view_count + 1
        db.session.commit()
        return 0
    except Exception as e:
        print(repr(e))
        return -1
    finally:
        db.session.close()


def get_museum_product_data():
    try:
        product = Products.double_to_json(Products.query.filter(and_(Products.file_type == 'image',
                                                                     Products.token_id.isnot(None))).all())
        if len(product) >= 13:
            product_data = random.sample(product, 13)
        else:
            product_data = random.sample(product, len(product))
        # print(product_data)
        db.session.commit()
        return product_data, 0
    except Exception as e:
        print(repr(e))
        return [{}], -1
    finally:
        db.session.close()
