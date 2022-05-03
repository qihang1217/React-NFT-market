import React, {Component} from "react";
import {delete_padding, revive_padding} from "../../utils/ControlPadding";
import head from "./image/head.png"
import "./MyAccount.less";
import {Tabs,} from 'antd';
import {AppstoreOutlined, FormatPainterOutlined, HeartOutlined, PayCircleOutlined,} from '@ant-design/icons';
import MyMintedTokens from "./MyMintedTokens/MyMintedTokens";
import MyAllTokens from "./MyAllTokens/MyAllTokens";
import MyWalletDetails from "./MyWalletDetails/MyWalletDetails"
import storageUtils from "../../utils/storageUtils";
import MyAccountInformation from "./MyAccountInformation/MyAccountInformation";
import Paragraph from "antd/es/typography/Paragraph";
import {withRouter} from "react-router-dom";

const {TabPane} = Tabs;


class MyAccount extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			tabKey: 'mintedTokens',
		}
	}
	
	onTabChanged = (key) => {
		this.setState({tabKey: key});
		this.props.history.replace({
			pathname: '/space/' + key, state: {
				tabKey: key
			}
		});
	}
	
	componentDidMount() {
		//清除外部的边界框
		delete_padding()
	}
	
	componentWillUnmount() {
		//恢复外部的边界框
		revive_padding()
	}
	
	
	render() {
		const user = storageUtils.getUser()
		console.log(this.props.location.state)
		return (
			<>
				<div className='my-account'>
					<div className="my">
						<div className="art-container">
							<div className="ant-spin-nested-loading">
								<div className="ant-spin-container">
									<div className="top-bg">
										<img className="avatar" src={head} alt="头像"/>
									</div>
									<div className="middle-info">
										<div className="title">
										</div>
										<div className="username">
											<div className="info-area-auth">
												<span className="my-name">{user.user_name}</span>
												<span className="address-info">
													钱包账户地址
													<Paragraph
														copyable={{
															tooltips: ['复制您的钱包账户地址', '复制成功!'],
														}}
														className="address-code"
														id='code'
													>
														{this.props.accountAddress}
													</Paragraph>
                                                </span>
											</div>
										</div>
										<div className="num-info">
											<div className="item">
												<span className="number">32</span>
												<span className="type">关注</span>
											</div>
											<div className="item">
												<span className="number">47</span>
												<span className="type">粉丝</span>
											</div>
											<div className="item">
												<span className="number">{this.props.totalTokensOwnedByAccount}</span>
												<span className="type">数藏万物</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<Tabs
							activeKey={(this.props.location.state && this.props.location.state.tabKey) ? this.props.location.state.tabKey : 'mintedTokens'}
							className="tabs" centered size="large" tabBarGutter="90px"
							onChange={this.onTabChanged}>
							<TabPane
								tab={
									<span>
										<PayCircleOutlined/>
										我的资产
									</span>
								}
								key="walletDetails"
							>
								<div className="tab4 tab">
									<MyWalletDetails
										accountAddress={this.props.accountAddress}
										accountBalance={this.props.accountBalance}
									/>
								</div>
							</TabPane>
							<TabPane
								tab={
									<span>
										<AppstoreOutlined/>
										我的账号
									</span>
								}
								key="accountInfo"
							>
								<div className="tab3 tab">
									<MyAccountInformation/>
								</div>
							</TabPane>
							<TabPane
								tab={
									<span>
										<FormatPainterOutlined/>
										我的铸造
									</span>
								}
								key="mintedTokens"
							>
								<div className="tab1 tab">
									<MyMintedTokens
										connectToMetamask={this.props.connectToMetamask}
										metamaskConnected={this.props.metamaskConnected}
										contractDetected={this.props.contractDetected}
										loading={this.props.loading}
										accountAddress={this.props.accountAddress}
										toggleForSale={this.props.toggleForSale}
										changeTokenPrice={this.props.changeTokenPrice}
										mintMyFileNFT={this.props.mintMyFileNFT}
									/>
								</div>
							</TabPane>
							<TabPane
								tab={
									<span>
										<HeartOutlined/>
										我的藏品
									</span>
								}
								key="allTokens"
							>
								<div className="tab2 tab">
									<MyAllTokens
										connectToMetamask={this.props.connectToMetamask}
										metamaskConnected={this.props.metamaskConnected}
										contractDetected={this.props.contractDetected}
										loading={this.props.loading}
										accountAddress={this.props.accountAddress}
										totalTokensOwnedByAccount={
											this.props.totalTokensOwnedByAccount
										}
										toggleForSale={this.props.toggleForSale}
										changeTokenPrice={this.props.changeTokenPrice}
									/>
								</div>
							</TabPane>
						</Tabs>
					</div>
				</div>
			</>
		)
	}
}

export default withRouter(MyAccount);
