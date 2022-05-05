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
import {reqOwnedProducts, reqUserById} from "../../api/API";
import ElseAllTokens from "./ElseAllTokens/ElseAllTokens";

const {TabPane} = Tabs;


class MyAccount extends Component {
	
	targetUserId = parseInt(this.props.match.params.id)
	
	constructor(props) {
		super(props);
		this.state = {
			tabKey: 'mintedTokens',
			userdata: {},
		}
	}
	
	//获取个人拥有的nft数据
	reqProductData = async () => {
		let result
		// 发请求获取数据
		const userData = storageUtils.getUser()
		const userId = userData['user_id']
		result = await reqOwnedProducts(userId)
		if (result.status === 0) {
			// 取出数据
			const {total, list} = result.data
			// 更新状态
			console.log(this.state)
			this.setState({myProductsTotal: total, myProductsList: list})
		}
	}
	
	reqUserData = async () => {
		const result = await reqUserById(this.targetUserId)
		if (result.status === 0) {
			this.setState({userdata: result.data})
		}
	}
	
	onTabChanged = (key) => {
		const userId = storageUtils.getUser().user_id
		this.setState({tabKey: key});
		this.props.history.replace({
			pathname: `/space/${userId}/` + key, state: {
				tabKey: key
			}
		});
	}
	
	componentDidMount() {
		//清除外部的边界框
		delete_padding()
		this.reqProductData()
		this.reqUserData()
	}
	
	componentWillUnmount() {
		//恢复外部的边界框
		revive_padding()
	}
	
	
	render() {
		const user = storageUtils.getUser()
		const currentUserId = parseInt(storageUtils.getUser().user_id);
		const OwnedEverythings = storageUtils.getProducts()
		let MyOwnedEverythings = []
		if (OwnedEverythings) {
			MyOwnedEverythings = OwnedEverythings.filter((OwnedEverything) =>
				parseInt(OwnedEverything.currentOwnerId._hex, 16) === currentUserId
			);
		}
		//他人拥有的产品
		let ElseOwnedEverythings = []
		if (OwnedEverythings) {
			ElseOwnedEverythings = OwnedEverythings.filter((OwnedEverything) =>
				parseInt(OwnedEverything.currentOwnerId._hex, 16) === this.targetUserId
			);
		}
		return (
			<>
				<div className='my-account'>
					<div className="my">
						{(this.targetUserId === currentUserId) ?
							(<>
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
														<span className="number">{MyOwnedEverythings.length}</span>
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
												reqProductData={this.reqProductData}
												list={this.state.myProductsList}
												total={this.state.myProductsTotal}
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
												toggleForSale={this.props.toggleForSale}
												changeTokenPrice={this.props.changeTokenPrice}
												list={this.state.myProductsList}
											/>
										</div>
									</TabPane>
								</Tabs>
							</>)
							:
							(<>
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
														<span className="my-name">{this.state.userdata.user_name}</span>
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
														<span className="number">{ElseOwnedEverythings.length}</span>
														<span className="type">数藏万物</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<Tabs
									activeKey={(this.props.location.state && this.props.location.state.tabKey) ? this.props.location.state.tabKey : 'allTokens'}
									className="tabs" centered size="large" tabBarGutter="90px"
									onChange={this.onTabChanged}>
									<TabPane
										tab={
											<span>
									<HeartOutlined/>
									Ta的藏品
								</span>
										}
										key="allTokens"
									>
										<div className="tab2 tab">
											<ElseAllTokens
												connectToMetamask={this.props.connectToMetamask}
												metamaskConnected={this.props.metamaskConnected}
												contractDetected={this.props.contractDetected}
												loading={this.props.loading}
												targetUserId={this.targetUserId}
											/>
										</div>
									</TabPane>
								</Tabs>
							</>)
						}
					</div>
				</div>
			</>
		)
	}
}

export default withRouter(MyAccount);
