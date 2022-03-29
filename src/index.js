import React from "react";

import "./bootstrap.min.css";
import 'antd/dist/antd.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {mainRouters} from "./router/router.js"
import ErrorPage from "./components/ErrorPage/ErrorPage";
import ReactDOM from "react-dom";


ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                {mainRouters.map(route => {
                    return <Route key={route.path} {...route}/>
                })}
                <Route component={ErrorPage}/>
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById("root")
);
