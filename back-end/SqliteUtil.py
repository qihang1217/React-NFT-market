# -*- coding:utf-8 -*-
import pymysql
from flask_sqlalchemy import SQLAlchemy

from run import app

pymysql.install_as_MySQLdb()
db = SQLAlchemy(app)


# 创建模型类 - Models
class CreateUsers(db.Model):
    # 创建Users类，映射到数据库中叫Users表
    __tablename__ = "Users"
    # 创建字段： id， 主键和自增涨
    id = db.Column(db.Integer, primary_key=True)
    # 创建字段：username， 长度为20的字符串，不允许为空
    username = db.Column(db.String(20), nullable=False)
    # 创建字段：age，整数
    age = db.Column(db.Integer)
    # 创建字段：email，长度为30的字符串
    email = db.Column(db.String(30))
    # 创建字段：password，长度为50的字符串
    password = db.Column(db.String(44))


# 将创建好的实体类映射回数据库
db.create_all()
# conn = sqlite3.connect(db_name + '.db', check_same_thread=False)

# def createTables():
#     try:
#         sql_create_t_staff = '''create table IF NOT EXISTS t_staff(
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             service VARCHAR(20) NOT NULL,
#             money VARCHAR(10),
#             card_number VARCHAR(40),
#             name VARCHAR(20),
#             phone VARCHAR(20),
#             project VARCHAR(20),
#             shop_guide VARCHAR(20),
#             teacher VARCHAR(20),
#             financial VARCHAR(100),
#             remarks1 VARCHAR(100),
#             collect_money VARCHAR(100),
#             remarks2 VARCHAR(100),
#             create_time TIMESTAMP NOT NULL DEFAULT (datetime('now','localtime')),
#             modify_tiem TIMESTAMP NOT NULL DEFAULT (datetime('now','localtime'))
#         )'''
#         cursor.execute(sql_create_t_staff)
#     except Exception as e:
#         print(repr(e))
#
# createTables()
#
#
# staffColumns = ("id", "service", "money", "card_number", "name", "phone", "project",\
#                 "shop_guide", "teacher", "financial", "remarks1", "collect_money", "remarks2")  #id没写可把我害惨了
#
# def addOrUpdateStaff(json_str):
#     try:
#         print(json_str) #{"service":"1","money":"2","card_number":"3","name":"4","phone":"1"}
#         # print("=="*30)
#         staff = json.loads(json_str)
#         id = staff.get('id', 0)
#         result = ''
#         newId = id
#
#         if id == 0:  # 新增
#             keys = ''
#             values = ''
#             isFirst = True
#             for key, value in staff.items():
#                 if isFirst:
#                     isFirst = False
#                 else:
#                     keys += ','
#                     values += ','
#                 keys += key
#                 if isinstance(value, str):
#                     values += ("'%s'" % value)
#                 else:
#                     values += str(value)
#
#             sql = "INSERT INTO t_staff (%s) values (%s)" % (keys, values)
#
#             print(sql)
#             cursor.execute(sql)
#             result = '添加成功'
#             newId = cursor.lastrowid
#             print(result, "newId:", newId)
#         else:
#             #修改
#             update = ''
#             isFirst = True
#             for key,value in staff.items():  #假如{"service":"1","money":"2"}
#                 if key=='id':
#                     #这个字段不用考虑，隐藏的
#                     continue
#                 if isFirst:
#                     isFirst = False
#                 else:
#                     update += ','  #相当于除了第一个，其他的都需要在最前面加','
#                 if value==None:
#                     value = ""
#                 if isinstance(value, str):
#                     update += (key + "='" + value + "'")
#                 else:
#                     update += (key + "=" + str(value))
#             #update: service='1',money='2'
#             where = "where id=" + str(id)
#             sql = "update t_staff set %s %s" % (update, where)
#             # print("=="*30)
#             print(sql) #update t_staff set service='1',money='2' where id='4'
#             cursor.execute(sql)
#             result = '更新成功'
#             print(cursor.rowcount, result)
#
#         conn.commit()
#         re = {
#             'code': 0,
#             'id': newId,
#             'message': result
#         }
#         return re
#     except Exception as e:
#         print(repr(e))
#         re = {
#             'code': -1,
#             'message': repr(e)
#         }
#         return re
#
# def deleteStaff(id):
#     #根据staff的id号来删除该条记录
#     try:
#         sql = "delete from t_staff where id=%d" % (id)
#         print(sql)
#         cursor.execute(sql)
#         conn.commit()
#         re = {
#             'code':0,
#             'message':'删除成功',
#         }
#         return json.dumps(re)
#     except Exception as e:
#         re = {
#             'code': -1,
#             'message': repr(e)
#         }
#         return json.dumps(re)
#
# def getStaffList(job):
#     # 当job为0时，表示获取所有数据
#     tableName = 't_staff'
#     where = ''
#
#     columns = ','.join(staffColumns)
#     order = ' order by id desc'  #按照id的递减顺序排列，之后要改
#     sql = "select %s from %s%s%s" % (columns, tableName, where, order)
#     print(sql)
#
#     cursor.execute(sql)
#
#     dateList = cursor.fetchall()     # fetchall() 获取所有记录
#     return dateList
#
# def searchStaff_3(where):
#     #只搜索3个属性
#     try:
#         sql_where = ''
#         sql_like = ''
#
#         if where.get('job', 0) > 0:
#             sql_where = ("where job=" + str(where['job']))
#
#         where_like_items = []
#         for key, value in where.items():
#             if value=="":
#                 #如果为空的话，就不把该字段计入了
#                 continue
#             if isinstance(value, str) and len(value.strip()) > 0:
#                 where_item = (key + " like '%" + value + "%'")
#                 where_like_items.append(where_item)
#
#         if len(where_like_items) > 0:
#             sql_like = "(%s)" % ' or '.join(where_like_items)
#
#         if len(sql_where) > 0:
#             if len(sql_like) > 0:
#                 sql_where += (" and " + sql_like)
#         else:
#             if len(sql_like) > 0:
#                 sql_where = "where " + sql_like
#
#         my_tmp_staffColumns = ("card_number", "name", "phone")
#         columns = ','.join(my_tmp_staffColumns)
#         order = ' order by id desc'
#         sql = "select %s from t_staff %s%s" % (columns, sql_where, order)
#         print(sql)
#
#         cursor.execute(sql)
#
#         dateList = cursor.fetchall()     # fetchall() 获取所有记录
#         return dateList
#     except Exception as e:
#         print(repr(e))
#         return []
#
# def getStaffsFromData_3(dataList):
#     #只取第一条数据，因为只想获得"card_number", "name", "phone"
#     itemArray = dataList[0] if dataList else None
#     # print("itemArray:",itemArray)  #itemArray: ('1', '1', '12')
#     return itemArray
#
# def getStaffsFromData(dataList):
#     staffs = []
#     for itemArray in dataList:   # dataList数据库返回的数据集，是一个二维数组
#         #itemArray: ('1', '1', '2', '3', '4')
#         staff = {}
#         for columnIndex, columnName in enumerate(staffColumns):
#             columnValue = itemArray[columnIndex]
#             # if columnValue is None: #后面remarks要用，现在不需要
#             #     columnValue = 0 if columnName in (
#             #         'job', 'education', 'birth_year') else ''
#             staff[columnName] = columnValue
#
#         staffs.append(staff)
#
#     return staffs
#
# def toMd5(data):
#     #采用md5加密
#     return hashlib.md5(data.encode(encoding='UTF-8')).hexdigest()
#
# def myCheck(json_str):
#     #验证密码是否正确
#     #{"username":"1","password":"2"}
#     # my_set_username = "1"
#     # my_set_password_md5 = "c81e728d9d4c2f636f067f89cc14862c" #2的md5
#
#     my_set_username = "hello1288"  #真实账号
#     my_set_password_md5 = "247e6102dc5cc40ebcba02c1a0517be9" #真实密码的md5
#     data = json.loads(json_str)
#     try:
#         if data["username"]==my_set_username and toMd5(data["password"])==my_set_password_md5:
#             #验证成功
#             re = {
#                 'code': 0,
#                 'message': "验证通过"
#             }
#         else:
#             re = {
#                 'code': 1,
#                 'message': "验证失败"
#             }
#         return re
#     except Exception as e:
#         print(repr(e))
#         re = {
#             'code': -1,
#             'message': repr(e)
#         }
#         return re
