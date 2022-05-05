import React, {useEffect, useState} from "react";
import ColorNFTImage from "../../ColorNFTImage/ColorNFTImage";
import Loading from "../../Loading/Loading";
import {Button, Card, Col, Empty, Form, Input, message, Row} from 'antd';
import FileNFT from "../../FileNFT/FileNFT";
import ConnectToMetamask from "../../ConnectMetamask/ConnectToMetamask";
import ContractNotDeployed from "../../ContractNotDeployed/ContractNotDeployed";
import storageUtils from "../../../utils/storageUtils";
import {CARD_COLS} from "../../../constants/constants";
import {reqOpenOrClose} from "../../../api/API";

const empty = require('../image/empty.svg')

const MyAllTokens = ({
	                     connectToMetamask,
	                     metamaskConnected,
	                     contractDetected,
	                     loading,
	                     accountAddress,
	                     toggleForSale,
	                     changeTokenPrice,
	                     list,
                     }) => {
	const [insideLoading, setInsideLoading] = useState(true);
	const [chainDataCard, setChainDataCard] = useState([]);
	const [products, setProducts] = useState(list);
	const OwnedEverythings = storageUtils.getProducts()
	let MyOwnedEverythings = []
	if (OwnedEverythings) {
		MyOwnedEverythings = OwnedEverythings.filter((OwnedEverything) =>
			OwnedEverything.currentOwner === accountAddress
		);
	}
	
	const loadNftData = (OwnedEverythings) => {
		if (OwnedEverythings) {
			if (OwnedEverythings.length !== 0) {
				setProducts(list)
				//筛选出个人所拥有的数藏万物
				const ChainDataCard = MyOwnedEverythings.map((item) => {
					let {
						tokenName,
						price,
					} = item;
					price = parseInt(price._hex, 16).toString()
					
					//进行上架或者下架操作
					const handleUnderOrUp = () => {
						toggleForSale(
							parseInt(item.tokenId._hex, 16),
						)
					}
					
					const handleOpenOrClose = async (e) => {
						// console.log(item.metaData.productId)
						let action = ''
						const object = e.target
						//禁用按钮
						object.setAttribute('disabled', true)
						object.offsetParent.setAttribute('disabled', true)
						if (e.target.innerHTML === '公 开') {
							action = 'open'
						} else if (e.target.innerHTML === '不公开') {
							action = 'close'
						}
						const productId = item.metaData.productId
						const result = await reqOpenOrClose(productId, action)
						if (result.status === 0) {
							message.success('修改可见状态成功~')
							if (action === 'open') {
								object.innerHTML = '不公开'
								object.offsetParent.classList.add('ant-btn-dangerous')
							} else if (action === 'close') {
								object.innerHTML = '公 开'
								object.offsetParent.classList.remove('ant-btn-dangerous')
							}
						} else {
							message.error('修改可见状态失败!')
						}
						//取消禁用按钮
						object.removeAttribute('disabled')
						object.offsetParent.removeAttribute('disabled')
					}
					
					//点击被隐藏的按钮,进行表单提交
					const handleChangePriceClick = (e) => {
						const text = item.tokenId
						const submit = document.getElementById(text)
						submit.click()
					}
					
					const callChangeTokenPriceFromApp = (tokenId, newPrice) => {
						changeTokenPrice(tokenId, newPrice);
					};
					
					//处理表单提交的数据
					const handlePriceChangeSubmit = (value) => {
						const price = value.price
						callChangeTokenPriceFromApp(
							parseInt(item.tokenId._hex, 16),
							price
						);
					}
					
					//设置出售状态及其样式
					const sale_status = (accountAddress === item.currentOwner) ?
						(item.forSale ? ('下架') : ('上架')) : null
					const sale_status_button_style = (accountAddress === item.currentOwner) ?
						(!!item.forSale) : null
					
					if (products) {
						const current_product = products.find(inItem => {
							return (inItem.product_id === item.metaData.productId)
						})
						if (current_product) {
							// console.log(current_product)
							const openStatus = current_product.open_status
							
							const open_status = (accountAddress === item.currentOwner) ?
								(openStatus ? ('不公开') : ('公开')) : null
							const open_status_button_style = (accountAddress === item.currentOwner) ?
								(!!openStatus) : null
							const tokenId = parseInt(item.tokenId._hex, 16)
							return (<Col span={CARD_COLS}>
									<Card
										className='inside-card'
										hoverable
										bordered
										cover={!insideLoading ? (
											(item.metaData.metaData.type === 'color') ?
												(<ColorNFTImage
													colors={
														item.metaData
															? item.metaData.metaData.colors
															: ""
													}
												/>) : (
													<FileNFT
														tokenURL={
															item.metaData
																? item.metaData.metaData.file_url.file_tokenURl
																: ""
														}
														tokenId={tokenId}
													/>
												)
										) : (
											<Loading/>
										)}
										actions={[
											<div className='action-buttons'>
												<Button type="primary" ghost
												        onClick={(e) => {
													        handleChangePriceClick(e)
												        }}
												>
													修改价格
												</Button>
												<Button type='primary' danger={sale_status_button_style}
												        onClick={() => handleUnderOrUp()}
												>
													{sale_status}
												</Button>
												<Button type='primary' danger={open_status_button_style}
												        onClick={(e) => handleOpenOrClose(e)}
												>
													{open_status}
												</Button>
											</div>,
										]}
									>
										<div style={{display: 'flex', justifyContent: 'space-between'}}>
											<div>
												<div className='top-attribute'>NFT名字</div>
												<div>{tokenName}</div>
											</div>
											<div className='right-content'>
												<div className='top-attribute'>价格</div>
												{window.web3.utils.fromWei(price.toString(), "Ether")} Ξ
											</div>
										</div>
										<Form
											onFinish={handlePriceChangeSubmit}
										>
											<Form.Item
												name="price"
												initialValue={window.web3.utils.fromWei(price.toString(), "Ether") || ''}
												rules={[
													{required: true, message: '价格必须输入'},
													{
														validator(rule, value, callback) {
															if (value === '') {
																return Promise.reject()
															} else if (value * 1 <= 0) {
																return Promise.reject('价格必须大于0')
															} else {
																return Promise.resolve()
															}
														}
													}
												]}
											>
												<Input type="number" placeholder="请输入新的价格"/>
											</Form.Item>
											<Form.Item style={{height: 0, width: 0}}>
												<Button type="primary" htmlType="submit" style={{height: 0, width: 0}}
												        id={item.tokenId}/>
											</Form.Item>
										</Form>
									</Card>
								</Col>
							)
						}
					}
				})
				setChainDataCard(ChainDataCard)
				setInsideLoading(false)
			}
		}
	}
	
	//加载个人在链上拥有的nft数据
	useEffect(() => {
		loadNftData(OwnedEverythings)
	}, [OwnedEverythings]);
	
	
	return (
		!metamaskConnected ? (
			<ConnectToMetamask connectToMetamask={connectToMetamask}/>
		) : !contractDetected ? (
			<ContractNotDeployed/>
		) : loading ? (
			<Loading/>
		) : (
			<div className='my-token'>
				<div className='content-mainTitle'>
					<span>您的所收藏的<span id='nft_name' style={{fontSize: 32}}>数藏万物</span></span>
				</div>
				<Card title="已上链的NFT" extra={<span>总数:{MyOwnedEverythings.length}</span>}>
					{!MyOwnedEverythings.length ? (
							<Empty
								image={empty}
								imageStyle={{
									height: 120,
								}}
								description={<span>您还没有专属于您的NFT哦,快去创建一个吧~</span>
								}
							>
								<Button type="primary" href="/mint">立即创建</Button>
							</Empty>) :
						(
							<Row gutter={[24, 16]}>
								{chainDataCard}
							</Row>
						)}
				</Card>
			
			</div>)
	);
};

export default MyAllTokens;
