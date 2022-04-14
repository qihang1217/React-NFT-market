import React from "react";
import ApiUtil from "../../utils/ApiUtil";
import Loading from "../Loading/Loading"
import {delete_padding, revive_padding} from "../../utils/ControlPadding";

class Museum extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            loadingVisible: 'flex',
            iframeVisible: 'none'
        }
    }
    
    
    handleHeight = () => {
        const screenHeight = document.documentElement.clientHeight;
        let height = `${screenHeight - 64}px`;
        this.setState({
            height,
        })
    }
    
    
    componentDidMount() {
        //清除外部的边界框
        delete_padding()
        //删除底部
        this.props.delete_footer()
        const screenHeight = document.documentElement.clientHeight;
        let height = `${screenHeight - 64}px`;
        this.setState({
            height,
        })
        window.addEventListener('resize', this.handleHeight);
    }
    
    componentWillUnmount() {
        //恢复外部的边界框
        revive_padding()
        //恢复底部
        this.props.revive_footer()
        window.removeEventListener('resize', this.handleHeight);
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