import os
import time

from flask import Flask, send_from_directory, request, jsonify, render_template
from flask_cors import CORS

# import SqliteUtil as DBUtil

# 设置项目的根目录作为静态文件的文件夹
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:root@localhost:3306/ntf-market"
cors = CORS(app)

# api接口前缀
apiPrefix = '/api/v1/'

########## 文件上传API
UPLOAD_FOLDER = 'upload'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER  # 设置文件上传的目标文件夹
basedir = os.path.abspath(os.path.dirname(__file__))  # 获取当前项目的绝对路径
ALLOWED_EXTENSIONS = {'bmp', 'png', 'gif', 'jpg', 'jpeg', 'mp4', 'rmvb', 'avi', 'ts'}  # 允许上传的文件后缀


# 判断文件是否合法
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route(apiPrefix + 'upload', methods=['POST'], strict_slashes=False)
def api_upload():
    file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'])  # 拼接成合法文件夹地址
    if not os.path.exists(file_dir):
        os.makedirs(file_dir)  # 文件夹不存在就创建
    f = request.files['file']  # 从表单的file字段获取文件
    if f and allowed_file(f.filename):  # 判断是否是允许上传的文件类型
        fname = f.filename
        ext = fname.rsplit('.', 1)[1]  # 获取文件后缀
        unix_time = int(time.time())
        new_filename = str(unix_time) + '.' + ext  # 修改文件名
        f.save(os.path.join(file_dir, new_filename))  # 保存文件到upload目录
        return jsonify({"errno": 0, "errmsg": "上传成功"})
    else:
        return jsonify({"errno": 1001, "errmsg": "上传失败"})


########## React访问flask资源

RESOURCE_FOLDER = 'resource'


@app.route('/js/<path:filename>')
def send_js(filename):
    dirpath = os.path.join(app.root_path, RESOURCE_FOLDER + '/js')
    return send_from_directory(dirpath, filename, as_attachment=True)


@app.route('/image/<path:filename>')
def send_image(filename):
    dirpath = os.path.join(app.root_path, RESOURCE_FOLDER + '/image')
    return send_from_directory(dirpath, filename, as_attachment=True)


@app.route('/css/<path:filename>')
def send_css(filename):
    dirpath = os.path.join(app.root_path, RESOURCE_FOLDER + '/css')
    return send_from_directory(dirpath, filename, as_attachment=True)


########## React访问flask上的NTF博物馆

@app.route(apiPrefix + 'museum', methods=['GET'], strict_slashes=False)
def api_museum():
    if request.method == 'GET':
        return render_template('index.html')


# # show photo
# @app.route('/show/<string:filename>', methods=['GET'])
# def show_photo(filename):
#     file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'])
#     if request.method == 'GET':
#         if filename is None:
#             pass
#         else:
#             image_data = open(os.path.join(file_dir, '%s' % filename), "rb").read()
#             response = make_response(image_data)
#             response.headers['Content-Type'] = 'image/png'
#             return response
#     else:
#         pass

########## 登陆接口


########## 注册接口
@app.route(apiPrefix + 'register', methods=['POST'])
def register_user():
    data = request.get_data(as_text=True)
    print(data)
    return


########## Staff接口

# @app.route(apiPrefix + 'updateStaff', methods=['POST'])
# def updateStaff():
#     data = request.get_data(as_text=True)
#     re = DBUtil.addOrUpdateStaff(data)
#     # if re['code'] >= 0: # 数据保存成功，移动附件
#     #     FileUtil.fileMoveDir(re['id'])
#     return json.dumps(re)
#
#
# @app.route(apiPrefix + 'getStaffList/<int:job>')
# def getStaffList(job):
#     array = DBUtil.getStaffList(job)  # [('1', '1', '1', '1', '1'), ('1', '1', '2', '3', '4'), ...] 二维数组
#     jsonStaffs = DBUtil.getStaffsFromData(array)
#     # print("jsonStaffs:", jsonStaffs)
#     return json.dumps(jsonStaffs)
#
#
# @app.route(apiPrefix + 'deleteStaff/<int:id>')
# def deleteStaff(id):
#     # return str(id)+"hi"
#     re = DBUtil.deleteStaff(id)
#     return re
#
#
# @app.route(apiPrefix + 'searchStaff_3')
# def searchStaff_3():
#     data = request.args.get('where')
#     print('searchStaff_3:', data)
#     where = json.loads(data)
#     array = DBUtil.searchStaff_3(where)
#     jsonStaffs = DBUtil.getStaffsFromData_3(array)
#     re = json.dumps(jsonStaffs)
#     return re
#
#
# ########## 管理员接口
#
# @app.route(apiPrefix + 'checkPassword', methods=['POST'])
# def checkPassword():
#     data = request.get_data(as_text=True)
#     re = DBUtil.myCheck(data)
#     return json.dumps(re)
#
#
# @app.route(apiPrefix + 'gotoAdmin')  # 进入管理员状态
# def gotoAdmin(data):
#     pass
#
#
# @app.route(apiPrefix + 'export_to_file')  # 导出到文件
# def export_to_file():
#     array = DBUtil.getStaffList(0)  # [('1', '1', '1', '1', '1'), ('1', '1', '2', '3', '4'), ...] 二维数组
#     re = Data2File.saveToFile(array)
#     return json.dumps(re)


if __name__ == "__main__":
    app.run(debug=True, port=5001)
