export default class ApiUtil {
    static URL_IP = 'http://127.0.0.1:5000';
    static URL_ROOT = '/api/v1';
    static URL_WEB = '/api';
    static UPLOAD_FOLDER = '/upload_folder/';
    static URL_INTERFACE = ApiUtil.URL_IP + ApiUtil.URL_ROOT
    
    static API_MUSEUM = ApiUtil.URL_IP + ApiUtil.URL_WEB + '/museum'
    
    static API_UPLOAD = ApiUtil.URL_INTERFACE + '/upload';
    static API_LOGIN = ApiUtil.URL_INTERFACE + '/login';
    static API_REGISTER = ApiUtil.URL_INTERFACE + '/register';
    static API_CHECK_USERNAME = ApiUtil.URL_INTERFACE + '/checkUserName';
    static API_CATEGORY_LIST = ApiUtil.URL_INTERFACE + '/category/list';
    static API_OWN_PRODUCT_LIST = ApiUtil.URL_INTERFACE + '/product/own/list';
    static API_PRODUCT_BY_ID = ApiUtil.URL_INTERFACE + '/product/id';
    static API_FILE_URL = ApiUtil.URL_IP + ApiUtil.UPLOAD_FOLDER;
}