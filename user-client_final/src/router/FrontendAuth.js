import React, {Component} from "react";
import {Redirect, Route} from "react-router-dom";
import storageUtils from "../utils/storageUtils";

class FrontendAuth extends Component {
    render() {
        // console.log('this.props', this.props)
        const {routerConfig, location} = this.props;
        const {pathname} = location;
        var isLogin = false
        if (storageUtils.getToken()) {
            isLogin = true;
        }
        // console.log(isLogin)
        // 如果该路由不用进行权限校验，登录状态下登陆页除外
        // 因为登陆后，无法跳转到登陆页
        // 这部分代码，是为了在非登陆状态下，访问不需要权限校验的路由
        // console.log(pathname)
        const targetRouterConfig = routerConfig.find(
            (item) => {
                //todo:完善路由匹配校验逻辑
                if (pathname.includes('/ownedEverything/detail/'))
                    return true
                return item.path.startsWith(pathname)
            }
        );
        // console.log(targetRouterConfig);
        if (targetRouterConfig && !targetRouterConfig.auth && !isLogin) {
            const {component} = targetRouterConfig;
            return <Route exact path={pathname} component={component}/>;
        }
        if (isLogin) {
            // console.log('isLogin', isLogin);
            // 如果是登陆状态，想要跳转到登陆，重定向到主页
            // console.log(targetRouterConfig)
            if (pathname === "/login") {
                return <Redirect to="/"/>;
            } else if (pathname === "/register") {
                return <Redirect to="/"/>;
            } else {
                // 如果路由合法，就跳转到相应的路由
                // console.log(targetRouterConfig)
                if (targetRouterConfig) {
                    // console.log(targetRouterConfig)
                    return (
                        <Route path={pathname} component={targetRouterConfig.component}/>
                    );
                } else {
                    // 如果路由不合法，重定向到 404 页面
                    return <Redirect to="/404"/>;
                }
            }
        } else {
            // console.log('targetRouterConfig', targetRouterConfig);
            // 非登陆状态下，当路由合法时且需要权限校验时，跳转到登陆页面，要求登陆
            if (targetRouterConfig && targetRouterConfig.auth) {
                return <Redirect to="/login"/>;
            } else {
                // 非登陆状态下，路由不合法时，重定向至 404
                return <Redirect to="/404"/>;
            }
        }
    }
}

export default FrontendAuth;