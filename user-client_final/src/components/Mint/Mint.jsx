import React, {Component} from "react";
import {Button, message, Steps} from 'antd';
import "./Mint.css"
import ConnectToMetamask from "../ConnectMetamask/ConnectToMetamask";
import ContractNotDeployed from "../ContractNotDeployed/ContractNotDeployed";
import Loading from "../Loading/Loading";

const {Step} = Steps;


const steps = [
    {
        title: '第一步',
        content: 'First-content',
    },
    {
        title: '第二步',
        content: 'Second-content',
    },
    {
        title: '最后一步',
        content: 'Last-content',
    },
];


class Mint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        };
    }

    setCurrent = (value) => {
        this.setState(
            {current: value}
        )
    }

    next = () => {
        this.setCurrent(this.state.current + 1);
    };

    prev = () => {
        this.setCurrent(this.state.current - 1);
    };

    render() {
        return (
            <div>
                {
                    !this.props.metamaskConnected ? (
                        <ConnectToMetamask connectToMetamask={this.props.connectToMetamask}/>
                    ) : !this.props.contractDetected ? (
                        <ContractNotDeployed/>
                    ) : this.props.loading ? (
                        <Loading/>
                    ) : (
                        <div className="top">
                            <Steps current={this.state.current}>
                                {steps.map(item => (
                                    <Step key={item.title} title={item.title}/>
                                ))}
                            </Steps>
                            <div className="steps-content">{steps[this.state.current].content}</div>
                            <div className="steps-action">
                                {this.state.current < steps.length - 1 && (
                                    <Button type="primary" onClick={() => this.next()}>
                                        Next
                                    </Button>
                                )}
                                {this.state.current === steps.length - 1 && (
                                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                                        Done
                                    </Button>
                                )}
                                {this.state.current > 0 && (
                                    <Button style={{margin: '0 8px'}} onClick={() => this.prev()}>
                                        Previous
                                    </Button>
                                )}
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }

}

export default Mint;