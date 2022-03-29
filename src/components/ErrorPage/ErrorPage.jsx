import React from 'react';
import html from './index.js'
import Navbar from "../Navbar/Navbar";

const ErrorPage = () => {
    return (<>
            <Navbar/>
            <iframe
                title="resg"
                srcDoc={html}
                style={{width: "100%", height: "88.7vh", display: "block"}}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                scrolling="auto"
            />
        </>
    )
}
export default ErrorPage;