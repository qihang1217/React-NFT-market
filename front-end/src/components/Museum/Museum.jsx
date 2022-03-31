import React from "react";

class Museum extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0
        }
    }

    componentWillUnmount() {
        this.props.revive_footer()
        window.removeEventListener('resize', this.handleHeight);
    }

    componentDidMount() {
        this.props.delete_footer()
        const screenHeight = document.documentElement.clientHeight;
        let height = `${screenHeight - 64}px`;
        this.setState({
            height,
        })
        window.addEventListener('resize', this.handleHeight);
    }

    handleHeight = () => {
        const screenHeight = document.documentElement.clientHeight;
        let height = `${screenHeight - 64}px`;
        this.setState({
            height,
        })
    }

    render() {
        return (
            <>
                <iframe
                    title="resg"
                    src="http://127.0.0.1:5001/api/museum"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    scrolling="auto"
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0"
                    style={{width: "100%", height: `${this.state.height}`, display: "block"}}
                />
            </>)
    }
}

export default Museum