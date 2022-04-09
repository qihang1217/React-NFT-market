import React, {Component} from "react";
import AccountDetails from "../AccountDetails/AccountDetails";
import ConnectToMetamask from "../ConnectMetamask/ConnectToMetamask";
import ContractNotDeployed from "../ContractNotDeployed/ContractNotDeployed";
import Loading from "../Loading/Loading";


class MyAccount extends Component {

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
                        <AccountDetails
                            accountAddress={this.props.accountAddress}
                            accountBalance={this.props.accountBalance}
                        />
                    )
                }
            </div>
        )
    }
}

export default MyAccount;
