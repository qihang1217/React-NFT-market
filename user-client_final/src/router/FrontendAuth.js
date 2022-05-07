import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import ErrorPage from "../components/ErrorPage/ErrorPage";

const FrontendAuth = (routes, authed, authPath = '/login', extraProps = {}, switchProps = {}) =>
    routes ? (
        <Switch {...switchProps}>
            {routes.map((route, i) => (
                <Route
                    key={route.key || i}
                    path={route.path}
                    exact={!!route.exact}
                    strict={route.strict}
                    render={props => {
                        if (!route.requiresAuth || authed || route.path === authPath) {
                            return <route.component {...props} {...extraProps} route={route}/>;
                        }
                        return (
                            <Redirect
                                to={{pathname: authPath, state: {from: props.location}}}
                            />
                        );
                    }}
                />
            ))}
            <Route component={ErrorPage}/>
        </Switch>
    ) : null;

export default FrontendAuth;
