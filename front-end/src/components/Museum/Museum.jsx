import React from "react";
import ApiUtil from "../../Utils/ApiUtil";
import Loading from "../Loading/Loading"

class Museum extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            loadingVisible: 'flex',
            iframeVisible: 'none'
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
                <div style={{display: this.state.loadingVisible, alignItems: "center", height: this.state.height}}>
                    <Loading/>
                </div>
                <iframe
                    src={ApiUtil.API_MUSEUM}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    scrolling="auto"
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0"
                    onLoad={() => {
                        this.setState({
                            loadingVisible: 'none',
                            iframeVisible: 'block'
                        })
                    }}
                    style={{width: "100%", height: this.state.height, display: this.state.iframeVisible}}
                />
            </>
        )

    }
}

export default Museum