export default class ApiUtil {
    static URL_IP = 'http://127.0.0.1:5000';
    static URL_ROOT = '/api/v1';
    static URL_WEB = '/api';
    static UPLOAD_FOLDER = '/upload_folder/';
    
    //服务器文件获取接口
    static API_FILE_URL = ApiUtil.URL_IP + ApiUtil.UPLOAD_FOLDER;
    //服务器nft博物馆接口
    static API_MUSEUM = ApiUtil.URL_IP + ApiUtil.URL_WEB + '/museum'
    
    //各种数据接口
    static URL_INTERFACE = ApiUtil.URL_IP + ApiUtil.URL_ROOT
    
    static API_UPLOAD = ApiUtil.URL_INTERFACE + '/upload';
    static API_LOGIN = ApiUtil.URL_INTERFACE + '/login';
    static API_REGISTER = ApiUtil.URL_INTERFACE + '/register';
    static API_CHECK_USERNAME = ApiUtil.URL_INTERFACE + '/checkUserName';
    static API_CATEGORY_LIST = ApiUtil.URL_INTERFACE + '/category/list';
    static API_OWN_PRODUCT_LIST = ApiUtil.URL_INTERFACE + '/product/own/list';
    static API_PRODUCT_BY_ID = ApiUtil.URL_INTERFACE + '/product/id';
    static API_PRODUCT_RESUBMIT = ApiUtil.URL_INTERFACE + '/product/resubmit';
    static API_PRODUCT_DELETE = ApiUtil.URL_INTERFACE + '/product/delete';
    static API_UPLOAD_MINT = ApiUtil.URL_INTERFACE + '/upload_mint';
	static API_CONFIRM_MINTED= ApiUtil.URL_INTERFACE + '/confirm_minted';
    
}