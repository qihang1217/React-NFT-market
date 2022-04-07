import React from "react";

import "./bootstrap.min.css";
import 'antd/dist/antd.css';
import {BrowserRouter as Router, Switch} from "react-router-dom";
import routerMap from "./router/routerMap.js"
import ReactDOM from "react-dom";
import FrontendAuth from "./router/FrontendAuth";


ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                {/*利用高阶组件进行路由有效性检验和响应跳转*/}
                <FrontendAuth routerConfig={routerMap}/>
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById("root")
);
