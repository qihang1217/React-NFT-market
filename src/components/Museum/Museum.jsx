import React from "react";

class Museum extends React.Component {
    constructor(props) {
        super(props);
        this.props.delete_footer()
    }

    componentWillUnmount() {
        this.props.revive_footer()
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
                    style={{width: "100%", height: "88.7vh", display: "block"}}
                />
            </>)
    }
}

export default Museum