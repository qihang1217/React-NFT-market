import React, {Component} from "react";
import {delete_padding, revive_padding} from "../../utils/ControlPadding";
import head from "./image/head.png"
import "./ElseAccount.less";
import {Tabs,} from 'antd';
import {HeartOutlined,} from '@ant-design/icons';
import storageUtils from "../../utils/storageUtils";
import Paragraph from "antd/es/typography/Paragraph";
import {withRouter} from "react-router-dom";
import {reqOwnedProducts} from "../../api/API";
import ElseAllTokens from "./ElseAllTokens/ElseAllTokens";

const {TabPane} = Tabs;


class ElseAccount extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			tabKey: 'mintedTokens',
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
			this.setState({total, list})
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
	}
	
	componentWillUnmount() {
		//恢复外部的边界框
		revive_padding()
	}
	
	
	render() {
		const user = storageUtils.getUser()
		// console.log(this.props.location.state)
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
										accountAddress={this.props.accountAddress}
										totalTokensOwnedByAccount={
											this.props.totalTokensOwnedByAccount
										}
										toggleForSale={this.props.toggleForSale}
										changeTokenPrice={this.props.changeTokenPrice}
										list={this.state.list}
										total={this.state.total}
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

export default withRouter(ElseAccount);
