import React, {Component} from 'react';
import html from './index.js'
import Navbar from "../Navbar/Navbar";

class ErrorPage extends Component {
    constructor() {
        super();
        this.state = {
            height: 0
        }
    }

    componentDidMount() {
        const screenHeight = document.documentElement.clientHeight;
        let height = `${screenHeight - 64}px`;
        this.setState({
            height,
        })
        window.addEventListener('resize', this.handleHeight);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleHeight);
    }

    handleHeight = () => {
        const screenHeight = document.documentElement.clientHeight;
        let height = `${screenHeight - 64}px`;
        this.setState({
            height,
        })
    }

    render() {
        return (<>
                <Navbar/>
                <iframe
                    title="resg"
                    srcDoc={html}
                    style={{width: "100%", height: `${this.state.height}`, display: "block"}}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    scrolling="auto"
                />
            </>
        )
    }
}

export default ErrorPage;