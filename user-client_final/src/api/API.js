import ApiUtil from "../utils/ApiUtil";
import HttpUtil from "../utils/HttpUtil";

// 请求登陆
export const reqLogin = (e) => {
    return HttpUtil.post(ApiUtil.API_LOGIN, e)
}
