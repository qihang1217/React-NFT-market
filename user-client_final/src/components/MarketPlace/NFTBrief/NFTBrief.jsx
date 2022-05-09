import React, {Component} from "react";
import {ADDRESS_DISPLAY_LENGTH} from "../../../constants/constants";
import './NFTBrief.less'
import {Button, Modal} from "antd";

class NFTBrief extends Component {
	price = window.web3.utils.fromWei(
		parseInt(this.props.item.price._hex, 16).toString(),
		"Ether"
	)
	
	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewTitle: '',
		}
	}
	
	handleCancel = () => {
		this.setState({previewVisible: false})
	}
	
	handleOk = () => {
		this.setState({previewVisible: false})
		this.props.buyOwnedEverything(
			parseInt(this.props.item.tokenId._hex, 16),
			this.price
		)
	}
	
	render() {
		const {previewVisible, previewTitle} = this.state;
		return (
			<div className='nft-brief'>
				<div key={parseInt(this.props.item.tokenId)} className="mt-4 info-brief">
					<p>
						<span className="font-weight-bold">数藏万物ID</span> :{" "}
						{parseInt(this.props.item.tokenId._hex, 16)}
					</p>
					<p>
						<span className="font-weight-bold">名字</span> :{" "}
						{this.props.item.tokenName}
					</p>
					<p>
						<span className="font-weight-bold">铸造者</span> :{" "}
						{this.props.item.mintedBy.substr(0, ADDRESS_DISPLAY_LENGTH) +
							"..." +
							this.props.item.mintedBy.slice(
								this.props.item.mintedBy.length - ADDRESS_DISPLAY_LENGTH
							)}
					</p>
					<p>
						<span className="font-weight-bold">拥有者</span> :{" "}
						{this.props.item.currentOwner.substr(0, ADDRESS_DISPLAY_LENGTH) +
							"..." +
							this.props.item.currentOwner.slice(
								this.props.item.currentOwner.length - ADDRESS_DISPLAY_LENGTH
							)}
					</p>
					<p>
						<span className="font-weight-bold">上一个拥有者</span> :{" "}
						{this.props.item.previousOwner.substr(0, ADDRESS_DISPLAY_LENGTH) +
							"..." +
							this.props.item.previousOwner.slice(
								this.props.item.previousOwner.length - ADDRESS_DISPLAY_LENGTH
							)}
					</p>
					<p>
						<span className="font-weight-bold">价格</span> :{" "}{this.price}{" "}Ξ
					</p>
					<p>
						<span className="font-weight-bold">累计交易次数</span> :{" "}
						{parseInt(this.props.item.numberOfTransfers._hex, 16)}
					</p>
					<div className='trade-button'>
						{this.props.accountAddress !== this.props.item.currentOwner ? (
							this.props.item.forSale ? (
								<Button
									type='primary'
									block
									value={parseInt(this.props.item.price._hex, 16).toString()}
									onClick={(e) => {
										// console.log(e.target.value)
										this.props.buyOwnedEverything(
											parseInt(this.props.item.tokenId._hex, 16),
											this.price
										)
									}
									}
								>
									用{" "}{this.price}{" "}Ξ拥有它
								</Button>
							) : (
								<>
									<Button
										disabled
										dangerous
										block
									>
										当前它不出售!
									</Button>
								</>
							)
						) : (this.props.item.forSale ? (
								<Button
									type='danger'
									block
									value={parseInt(this.props.item.price._hex, 16).toString()}
									onClick={(e) => {
										// console.log(e.target.value)
										this.setState({previewVisible: true})
									}}
								>
									用{" "}{this.price}{" "}Ξ拥有它
								</Button>
							) : (
								<>
									<Button
										disabled
										dangerous
										block
									>
										当前它不出售!
									</Button>
								</>
							)
						)}
					</div>
				</div>
				<Modal
					className='warn-modal'
					width='600px'
					visible={previewVisible}
					title={previewTitle}
					okText='确定购买'
					cancelText='取消购买'
					onCancel={this.handleCancel}
					onOk={this.handleOk}
					okButtonProps={{type: 'danger'}}
				>
					<div className='warn-text'>
						<p className='warn-title'>您所使用的钱包账户拥有此数藏万物，无需再次购买！</p>
						<p className='warn-subtitle'>即使再次购买也很可能失败!</p>
					</div>
				</Modal>
			</div>
		);
	}
}

export default NFTBrief;
