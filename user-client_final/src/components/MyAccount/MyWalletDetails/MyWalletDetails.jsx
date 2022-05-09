import React from "react";
import {Card} from "antd";
import './MyWalletDetails.less'
import ConnectToMetamask from "../../ConnectMetamask/ConnectToMetamask";
import ContractNotDeployed from "../../ContractNotDeployed/ContractNotDeployed";
import Loading from "../../Loading/Loading";

const MyWalletDetails = ({
	                         accountAddress,
	                         accountBalance,
	                         connectToMetamask,
	                         metamaskConnected,
	                         contractDetected,
	                         loading,
                         }) => {
	return (
		!metamaskConnected ? (
			<ConnectToMetamask connectToMetamask={connectToMetamask}/>
		) : !contractDetected ? (
			<ContractNotDeployed/>
		) : loading ? (
			<Loading/>
		) : (
			<div className='wallet-details'>
				<div className='content-mainTitle'>
					<span>您在<span id='nft_name' style={{fontSize: 32}}>数藏万物</span>的以太坊钱包</span>
				</div>
				<Card title="数藏万物">
					<p style={{fontSize: 18}}>
						这是一个NFT市场，您可以在其中铸造{" "}
						<span>数藏万物NFT</span> 并管理它们
					</p>
					<hr/>
					<div style={{marginBottom: 10}}>
						<p>账号地址 :</p>
						<h4>{accountAddress}</h4>
					</div>
					<div>
						<p>账户余额 :</p>
						<h4>{accountBalance} Ξ</h4>
					</div>
				</Card>
			</div>
		)
	);
};

export default MyWalletDetails;
