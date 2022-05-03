import React from "react";

import "./bootstrap.min.css";
import 'antd/dist/antd.css';
import {BrowserRouter as Router} from "react-router-dom";
import routerMap from "./router/routerMap.js"
import ReactDOM from "react-dom";
import FrontendAuth from "./router/FrontendAuth";
import {ConfigProvider} from "antd";
import zhCN from "antd/lib/locale/zh_CN"
import storageUtils from "./utils/storageUtils";


let isLogin = false;
if (storageUtils.getToken()) {
    isLogin = true;
}
ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <React.StrictMode>
            <Router>
                {/*利用高阶组件进行路由有效性检验和响应跳转*/}
                {FrontendAuth(routerMap, isLogin)}
            </Router>
        </React.StrictMode>
    </ConfigProvider>,
    document.getElementById("root")
);
