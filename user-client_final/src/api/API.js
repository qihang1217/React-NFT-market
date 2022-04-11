import ApiUtil from "../utils/ApiUtil";
import HttpUtil from "../utils/HttpUtil";

// 请求登陆
export const reqLogin = (e) => {
    return HttpUtil.post(ApiUtil.API_LOGIN, e)
}

//检查用户名重复性
export const checkedAccount = (data) => {
    return HttpUtil.post(ApiUtil.API_CHECK_USERNAME, data)
}

//注册账号
export const registerAccount = (values) => {
    return HttpUtil.post(ApiUtil.API_REGISTER, values)
}

//文件上传
export const uploadMint = (formData) => {
    return new Promise((resolve, reject) => {
        fetch(ApiUtil.API_UPLOAD, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => resolve(result))
            .catch(error => {
                reject(error);
            })
    })
}

//请求分类列表
export const reqCategories = () => {
    return HttpUtil.get(ApiUtil.API_CATEGORY_LIST)
}
