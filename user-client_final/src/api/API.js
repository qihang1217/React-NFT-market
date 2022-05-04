//实际使用的各种API
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


//获取个人拥有的NFT列表
export const reqOwnedProducts = (userId) => {
    return HttpUtil.get(ApiUtil.API_OWN_PRODUCT_LIST + `?userId=${userId}`)
}


//根据NFT ID获取NFT详细信息
export const reqProduct = (productId) => {
    return HttpUtil.get(ApiUtil.API_PRODUCT_BY_ID + `?productId=${productId}`)
}

//根据NFT ID再次重新提交审核
export const reqResubmit = (productId) => {
    return HttpUtil.post(ApiUtil.API_PRODUCT_RESUBMIT, {'productId': productId})
}

//根据NFT ID删除铸造申请
export const reqDelete = (productId) => {
    return HttpUtil.post(ApiUtil.API_PRODUCT_DELETE, {'productId': productId})
}

//根据NFT ID申请进行铸造
export const reqProductMint = (productId) => {
    return HttpUtil.get(ApiUtil.API_UPLOAD_MINT + `?productId=${productId}`)
}

//根据NFT ID确认铸造成功
export const reqConfirmMinted = (productId) => {
    return HttpUtil.get(ApiUtil.API_CONFIRM_MINTED + `?productId=${productId}`)
}

//更新用户个人信息
export const reqUpdateUserInfo = (userId, key, value) => {
    return HttpUtil.post(ApiUtil.API_UPDATE_USER_INFO, {userId, key, value})
}

// 根据分类id获取分类
export const reqCategory = (categoryId) => {
    return HttpUtil.get(ApiUtil.API_CATEGORY_BY_ID + `?categoryId=${categoryId}`)
}

// 获取所有评论
export const reqComments = (productId) => {
    return HttpUtil.get(ApiUtil.API_GET_COMMENTS + `?productId=${productId}`)
}

// 添加评论
export const reqAddComment = (timestamp, userId, userName, productId, commentContent) => {
    return HttpUtil.post(ApiUtil.API_ADD_COMMENT, {timestamp, userId, userName, productId, commentContent})
}

// 评论点赞和取消点赞
export const reqCommentLike = (commentId, action) => {
    return HttpUtil.get(ApiUtil.API_COMMENT_LIKE + `?commentId=${commentId}&action=${action}`)
}

// 公开和不公开
export const reqOpenOrClose = (productId, action) => {
    return HttpUtil.get(ApiUtil.API_PRODUCT_OPEN_OR_CLOSE + `?productId=${productId}&action=${action}`)
}

// 根据用户id获取用户数据
export const reqUserById = (userId) => {
    return HttpUtil.get(ApiUtil.API_USER_BY_ID + `?userId=${userId}`)
}

// 作品点赞和取消点赞
export const reqProductLike = (productId, action) => {
    return HttpUtil.get(ApiUtil.API_PRODUCT_LIKE + `?productId=${productId}&action=${action}`)
}

// 浏览量加1
export const reqProductView = (productId) => {
    return HttpUtil.get(ApiUtil.API_PRODUCT_ViEW + `?productId=${productId}`)
}