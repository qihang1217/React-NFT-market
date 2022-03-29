import React, {Component} from "react";
import StepOne from "./stepOne";
import StepTwo from "./stepTwo";
import StepThree from "./stepThree";
import {Button, Steps} from "antd";
import "antd/dist/antd.css";

function getSteps() {
    return [
        "step one",
        "step two",
        "step three"
    ];
}

class Mint extends Component {
    state = {
        activeStep: 0
    };

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return <StepOne/>;
            case 1:
                return <StepTwo/>;
            case 2:
                return <StepThree/>;
            default:
                return "Unknown stepIndex";
        }
    }

    handleNext = () => {
        if (this.state.state === 2) {
            this.setState({activeStep: 0})
        } else {
            this.setState({activeStep: this.state.activeStep + 1})
        }
    };
    handleBack = () => {
        this.setState({activeStep: this.state.activeStep - 1})
    };

    render() {
        const steps = getSteps();
        const {activeStep} = this.state;
        return (
            <div style={{paddingTop: 70}}>
                <Steps size="small" current={activeStep}>
                    {steps.map(label => (
                        <Steps.Step key={label} title={label}></Steps.Step>
                    ))}
                </Steps>
                <div>
                    {this.getStepContent(activeStep)}
                    {
                        activeStep > 0 && activeStep <= 2 ?
                            <Button
                                disabled={activeStep === 0}
                                onClick={this.handleBack}
                            >
                                Back
                            </Button> : null
                    }
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                    >
                        {activeStep === 2
                            ? "Finish"
                            : "Next"}
                    </Button>
                </div>
            </div>
        );
    }
}

export default Mint;