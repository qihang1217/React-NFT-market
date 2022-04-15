# coding=utf-8
import json
import os
import time
from random import randint

import configs
from flask import Flask, send_from_directory, request, jsonify, render_template, current_app
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, SignatureExpired, BadSignature
from flask_cors import CORS
import MysqlUtil as DBUtil
from flask_sqlalchemy import SQLAlchemy
import ipfshttpclient

app = Flask(__name__)
# 加载配置文件
app.config.from_object(configs)
db = SQLAlchemy(app)
# db绑定app
db.init_app(app)
# 解决cors问题
cors = CORS(app, supports_credentials=True)

# api接口前缀
apiPrefix = '/api/v1/'

########## 文件铸造API

# 设置文件上传的目标文件夹
UPLOAD_FOLDER = 'upload'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'bmp', 'png', 'gif', 'jpg', 'jpeg', 'mp4', 'mp3', 'docx', 'pdf'}  # 允许上传的文件后缀

########## 颜色铸造API

# 设置颜色铸造数据上传的目标文件夹
COLOR_UPLOAD_FOLDER = 'color_upload'
app.config['COLOR_UPLOAD_FOLDER'] = COLOR_UPLOAD_FOLDER

basedir = os.path.abspath(os.path.dirname(__file__))  # 获取当前项目的绝对路径


# 判断文件是否合法
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route(apiPrefix + 'upload', methods=['POST'], strict_slashes=False)
def api_upload():
    # print(request.form.to_dict().get('user_data'))
    token = request.values.get('token', None)
    if verify_login(token):
        # 校验是否登陆
        file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'])  # 拼接成合法文件夹地址
        if not os.path.exists(file_dir):
            os.makedirs(file_dir)  # 文件夹不存在就创建
        f = request.files.get('file')  # 从表单的file字段获取文件
        file_type = request.files.get('file').content_type  # 获取文件类型(例如image/jpeg)
        if f and allowed_file(f.filename):  # 判断是否是允许上传的文件类型
            file_name = f.filename
            ext = file_name.rsplit('.', 1)[1]  # 获取文件后缀
            unix_time = int(time.time())
            new_filename = str(unix_time) + str(randint(1000, 9999)) + '.' + ext  # 修改文件名
            f.save(os.path.join(file_dir, new_filename))  # 保存文件到upload目录
            product_data = request.form.to_dict()
            print(product_data)
            DBUtil.save_upload_product(product_data, new_filename, file_type)
            return jsonify({"message": "上传成功", "status": 0})
        else:
            return jsonify({"message": "上传失败", "status": -1, "detail_message": "文件类型不合格"})
    else:
        return jsonify({"message": "上传失败", 'token_message': '未登录', "status": -1})


# 上传文件的铸造
@app.route(apiPrefix + 'upload_mint', methods=['GET'], strict_slashes=False)
def upload_mint():
    args = request.args.to_dict()
    product_id = args.get('productId')
    res, status = DBUtil.get_product_by_id(product_id)
    tokenURI = ''
    # 如果查询到响应的数据,则进行将文件上传操作
    if status == 0:
        # 将用户上传的文件上传到ipfs
        ipfs = ipfshttpclient.connect('/dns/localhost/tcp/5001/http')
        file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'])
        # print(file_dir)
        filename = file_dir + '\\' + res.get('file_url')
        cid = ipfs.add(filename)
        # print(cid)
        tokenURI = 'http://127.0.0.1:8080/ipfs/' + cid.get('Hash')
        # print(tokenURI)
        # 修改其状态为已铸造
        # status = DBUtil.set_minted_product_by_id(product_id)
    response = {
        'status': status,
        'tokenURI': tokenURI,
    }
    return jsonify(response)


# 确认已经铸造
@app.route(apiPrefix + 'confirm_minted', methods=['GET'], strict_slashes=False)
def confirm_minted():
    args = request.args.to_dict()
    product_id = args.get('productId')
    # 修改其状态为已铸造
    status = DBUtil.set_minted_product_by_id(product_id)
    response = {
        'status': status,
    }
    return jsonify(response)


@app.route(apiPrefix + 'color_upload', methods=['POST'], strict_slashes=False)
def api_color_upload():
    # print(request.form.to_dict().get('user_data'))
    token = request.values.get('token', None)
    if verify_login(token):
        # 校验是否登陆
        file_dir = os.path.join(basedir, app.config['COLOR_UPLOAD_FOLDER'])  # 拼接成合法文件夹地址
        if not os.path.exists(file_dir):
            os.makedirs(file_dir)  # 文件夹不存在就创建
        print(request.data)
        # f = request.files.get('file')  # 从表单的file字段获取文件
        # file_type = request.files.get('file').content_type  # 获取文件类型(例如image/jpeg)
        # if f and allowed_file(f.filename):  # 判断是否是允许上传的文件类型
        #     file_name = f.filename
        #     ext = file_name.rsplit('.', 1)[1]  # 获取文件后缀
        #     unix_time = int(time.time())
        #     new_filename = str(unix_time) + str(randint(1000, 9999)) + '.' + ext  # 修改文件名
        #     f.save(os.path.join(file_dir, new_filename))  # 保存文件到upload目录
        #     product_data = request.form.to_dict()
        #     print(product_data)
        #     DBUtil.save_upload_product(product_data, new_filename, file_type)
        #     return jsonify({"message": "上传成功", "status": 0})
        # else:
        #     return jsonify({"message": "上传失败", "status": -1, "detail_message": "文件类型不合格"})
    else:
        return jsonify({"message": "上传失败", 'token_message': '未登录', "status": -1})


########## React访问flask资源

RESOURCE_FOLDER = 'resource'


@app.route('/js/<path:filename>')
def send_js(filename):
    dir_path = os.path.join(app.root_path, RESOURCE_FOLDER + '/js')
    return send_from_directory(dir_path, filename, as_attachment=True)


########## 后台访问前台flask暂存的用户上传文件

UPLOAD_FOLDER = 'upload'


@app.route('/upload_folder/<path:filename>')
def send_file(filename):
    dir_path = os.path.join(app.root_path, UPLOAD_FOLDER)
    print(dir_path)
    return send_from_directory(dir_path, filename, as_attachment=True)


########## React访问flask上的NTF博物馆
@app.route('/api/museum', methods=['GET'], strict_slashes=False)
def api_museum():
    if request.method == 'GET':
        return render_template('index.html')


########## Token接口
def generate_auth_token(data):
    expiration = 3600
    s = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)  # expiration是过期时间
    # 利用唯一的用户名生成token
    token = s.dumps({'user_name': data['user_name']})
    # print(token)
    return token.decode()


def verify_auth_token(token):
    s = Serializer(app.config['SECRET_KEY'])
    # print('qi', token)
    if token is not None:
        try:
            data = s.loads(token)
            return 'success'
        except SignatureExpired:
            return 'expired'  # valid token,but expired
        except BadSignature:
            return 'invalid'  # invalid token
        # if data.get('user_name') == user_data.get('user_name'):
        #     return 'success'
    else:
        return 'empty'


def verify_login(token):
    _token = verify_auth_token(token)
    if _token == 'success':
        return True
    else:
        return False


########## 注册接口
@app.route(apiPrefix + 'register', methods=['POST'], strict_slashes=False)
def register_user():
    json_str = request.get_data(as_text=True)
    user_data = json.loads(json_str)
    response = DBUtil.add_or_update_users(user_data)
    return jsonify(response)


# 动态检验用户名是否可用
@app.route(apiPrefix + 'checkUserName', methods=['POST'], strict_slashes=False)
def check_username():
    json_str = request.get_data(as_text=True)
    user_data = json.loads(json_str)
    response = DBUtil.check_username_repeat(user_data)
    return jsonify(response)


########## 登陆接口
@app.route(apiPrefix + 'login', methods=['POST'], strict_slashes=False)
def login_user():
    json_str = request.get_data(as_text=True)
    user_data = json.loads(json_str)
    # print('user_data',user_data)
    token = user_data.get('token', None)
    _token = verify_auth_token(token)
    response = DBUtil.check_users(user_data)
    if _token == 'success':
        response['token_message'] = _token
    elif response['message'] == '验证成功':
        # token并没有验证通过,但账号密码验证通过则生成新的token
        new_token = generate_auth_token(user_data)
        response['token_message'] = _token
        response['token'] = new_token
    # print('response',response)
    return jsonify(response)


@app.route(apiPrefix + 'category/list', methods=['GET'], strict_slashes=False)
def get_category_list():
    res, status = DBUtil.get_categories()
    response = {
        'status': status,
        'data': res,
    }
    return jsonify(response)


@app.route(apiPrefix + 'product/own/list', methods=['GET'], strict_slashes=False)
def get_own_product_list():
    args = request.args.to_dict()
    user_id = args.get('userId')
    res, status = DBUtil.get_own_product_list(user_id)
    total = len(res)
    response = {
        'status': status,
        'data': {'list': res, 'total': total},
    }
    return jsonify(response)


@app.route(apiPrefix + 'product/resubmit', methods=['POST'], strict_slashes=False)
def resubmit_product():
    json_str = request.get_data(as_text=True)
    product_data = json.loads(json_str)
    print(product_data)
    product_id = product_data.get('productId')
    print(product_id)
    status = DBUtil.resubmit_product(product_id)
    response = {
        'status': status,
    }
    return jsonify(response)


@app.route(apiPrefix + 'product/delete', methods=['POST'], strict_slashes=False)
def delete_product():
    json_str = request.get_data(as_text=True)
    product_data = json.loads(json_str)
    print(product_data)
    product_id = product_data.get('productId')
    print(product_id)
    status = DBUtil.delete_product(product_id)
    response = {
        'status': status,
    }
    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
