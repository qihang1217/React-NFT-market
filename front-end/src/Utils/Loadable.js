import React from 'react';
import Loadable from 'react-loadable';
import Loading from "../components/Loading/Loading";

export default function asyncLoad (loader) {
    return Loadable({
        loader,
        loading: props => {
            if (props.pastDelay) {
                return <Loading />;
            } else {
                return null;
            }
        },
        delay: 500,
    });
}