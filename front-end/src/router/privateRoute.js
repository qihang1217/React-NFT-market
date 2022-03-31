import React from 'react';
import {Route, withRouter} from 'react-router-dom';
import Login from "../pages/Login";

//私有路由，只有登录的用户才能访问
class PrivateRoute extends React.Component {
    componentWillMount() {
        let isAuthenticated = sessionStorage.getItem("userName") ? true : false;
        this.setState({isAuthenticated: isAuthenticated})
    }

    render() {
        console.log(this.props)
        let {component: component, path = "/", exact = false, strict = false} = this.props;
        return this.state.isAuthenticated ? (
            <Route path={path} exact={exact} strict={strict} render={() => (<component {...this.props}/>)}/>
        ) : <Route
            component={Login}
        />;
    }
}

export default withRouter(PrivateRoute);