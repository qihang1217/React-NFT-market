import React, {useEffect, useState} from "react";
import ColorNFTImage from "../../ColorNFTImage/ColorNFTImage";
import Loading from "../../Loading/Loading";
import {Button, Card, Col, Empty, Form, Input, message, Row} from 'antd';
import '../../MyTokenDetail/MyTokenDetail.less'
import {reqConfirmMinted, reqDelete, reqOpenOrClose, reqProductMint, reqResubmit} from "../../../api/API";
import ApiUtil from "../../../utils/ApiUtil";
import FileViewer from 'react-file-viewer';
import ConnectToMetamask from "../../ConnectMetamask/ConnectToMetamask";
import ContractNotDeployed from "../../ContractNotDeployed/ContractNotDeployed";
import storageUtils from "../../../utils/storageUtils";
import {card_cols} from "../../../constants/constants";
import FileNFT from "../../FileNFT/FileNFT";

const empty = require('../../MyTokenDetail/empty.svg')

const MyMintedTokens = ({
	                        connectToMetamask,
	                        metamaskConnected,
	                        contractDetected,
	                        loading,
	                        accountAddress,
	                        toggleForSale,
	                        changeTokenPrice,
	                        mintMyFileNFT,
	                        list,
	                        total,
                        }) => {
	const [insideLoading, setInsideLoading] = useState(true);
	const [products, setProducts] = useState(list);
	const [productTotal, setProductTotal] = useState(total);
	const [productCard, setProductCard] = useState([]);
	const [chainDataCard, setChainDataCard] = useState([]);
	const OwnedEverythings = storageUtils.getProducts()
	let MyOwnedEverythings = []
	if (OwnedEverythings) {
		MyOwnedEverythings = OwnedEverythings.filter((OwnedEverything) =>
			OwnedEverything.currentOwner === accountAddress && OwnedEverything.mintedBy === accountAddress
		);
	}
	
	const loadNftData = (OwnedEverythings) => {
		if (OwnedEverythings) {
			if (OwnedEverythings.length !== 0) {
				setProducts(list)
				setProductTotal(total)
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
							return (<Col span={card_cols}>
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
	
	
	//获取个人拥有的nft数据后进行渲染
	useEffect(() => {
		if (products) {
			const productCard = products.map((item) => {
				//处理铸造或者重新提交
				const handleCastOrRetry = async (e) => {
					const value = e.target.innerHTML
					const object = e.target
					// const product=item
					if (value === '开始铸造') {
						const productId = item.product_id;
						object.setAttribute('disabled', true)
						object.offsetParent.setAttribute('disabled', true)
						object.innerHTML = '铸造中'
						// console.log(object)
						const result = await reqProductMint(productId)
						// console.log(result)
						const tokenURI = result.tokenURI
						const status = await mintMyFileNFT(item, tokenURI);
						if (status === 0) {
							//	表示铸造成功
							// console.log('铸造成功')
							const status = await reqConfirmMinted(productId)
							if (status.status === 0) {
								const submitButton = document.getElementById(item.product_id)
								submitButton.setAttribute('disabled', true)
								submitButton.innerHTML = '已铸造'
								message.success('铸造成功且更新铸造状态成功~')
								// console.log('铸造成功且更新铸造状态成功')
							} else {
								// console.log('铸造成功但更新铸造状态失败')
								message.error('铸造成功但更新铸造状态失败~')
							}
						} else {
							// console.log('铸造失败')
							message.error('铸造失败,请稍后重试~')
							object.setAttribute('disabled', false)
							object.innerHTML = '重新铸造'
						}
					} else if (value === '重新提交') {
						const result = await reqResubmit(item.product_id)
						object.setAttribute('disabled', true)
						object.offsetParent.setAttribute('disabled', true)
						if (result.status === 0) {
							//删除成功后,禁用提交按钮并修改其中内容为审核中
							object.setAttribute('disabled', true)
							object.offsetParent.setAttribute('disabled', true)
							object.innerHTML = '审核中'
							message.success('重新提交审核成功~')
						} else {
							message.error('重新提交审核失败,请稍后重试~')
							object.setAttribute('disabled', true)
							object.offsetParent.setAttribute('disabled', true)
							object.innerHTML = '重新提交'
						}
					}
				}
				
				//处理删除
				const handleDelete = async (e) => {
					const value = e.target.innerHTML
					const object = e.target
					// console.log(e.target)
					if (value === '删 除') {
						object.setAttribute('disabled', true)
						object.offsetParent.setAttribute('disabled', true)
						const result = await reqDelete(item.product_id)
						if (result.status === 0) {
							//提交成功后,禁用提交按钮
							const submitButton = document.getElementById(item.product_id)
							submitButton.setAttribute('disabled', true)
							object.setAttribute('disabled', true)
							object.offsetParent.setAttribute('disabled', true)
							object.innerHTML = '已删除'
							message.success('删除成功~')
						}
					}
				}
				
				
				let examine_status_name, examine_status_content, examine_status_action, examine_disabled_status = false,
					delete_name = '删除', delete_disabled_status = false, examine_status_color = '#000'
				if (item.pass_status === true) {
					//审核通过
					if (item.examine_status === true) {
						examine_status_name = '审核通过'
						examine_status_action = '开始铸造'
						examine_status_color = '#4bbf73'
						examine_status_content = examine_status_name
					}
				} else if (item.pass_status === false) {
					//审核状态不是通过
					examine_status_name = '审核中'
					examine_disabled_status = true
					if (item.examine_status === true) {
						//已经审核
						examine_status_name = '审核未通过'
						examine_disabled_status = false
						examine_status_color = '#F63638FF'
						if (item.usable_chances === 0) {
							//可用的尝试机会为0
							examine_status_name = '无剩余审核机会'
							examine_disabled_status = true
							examine_status_color = '#F63638FF'
						}
					}
					examine_status_action = '重新提交'
					examine_status_content = examine_status_name
				}
				
				if (item.delete_status) {
					//	如果已经删除
					delete_disabled_status = true
					examine_disabled_status = true
					delete_name = '已删除'
					examine_status_color = '#F63638FF'
					examine_status_content = delete_name
				}
				
				if (item.mint_status) {
					//如果已经铸造
					delete_disabled_status = true
					examine_disabled_status = true
					examine_status_content = '已铸造'
					examine_status_action = '已铸造'
					examine_status_color = '#4bbf73'
				}
				// console.log(examine_status_name)
				const filename = item.file_url
				const ext = filename.substring(filename.lastIndexOf('.') + 1);
				const filetype = item.file_type
				const src = ApiUtil.API_FILE_URL + filename
				let previewContent
				if (/^image\/\S+$/.test(filetype)) {
					previewContent = (<img src={src} alt={filename} className='file'/>)
				} else if (/^video\/\S+$/.test(filetype)) {
					previewContent = (<video src={src} loop preload controls className='file'/>)
				} else if (/^audio\/\S+$/.test(filetype)) {
					previewContent = (
						<audio controls preload className='file'>
							<source src={src}/>
							<embed src={src}/>
						</audio>
					)
				} else {
					previewContent = (
						<FileViewer
							fileType={ext}
							filePath={src}
						/>
					)
				}
				return (
					<Col span={card_cols} key={item.product_id}>
						<Card
							key={item.product_id}
							className='inside-card'
							hoverable
							bordered
							//封面
							cover={
								previewContent
							}
							//下方操作
							actions={[
								<Button
									type='primary'
									id={item.product_id}
									disabled={examine_disabled_status}
									onClick={(e) => {
										handleCastOrRetry(e)
									}}
								>
									{examine_status_action}
								</Button>,
								<Button
									danger
									type="primary"
									disabled={delete_disabled_status}
									onClick={(e) => {
										handleDelete(e)
									}}
								>
									{delete_name}
								</Button>,
							]}
						>
							<div style={{display: 'flex', justifyContent: 'space-between'}}>
								<div>
									<div className='top-attribute'>NFT名字</div>
									<div>{item.product_name}</div>
								</div>
								<div className='right-content'>
									<div className='top-attribute'>状态</div>
									<span style={{color: examine_status_color}}>{examine_status_content}</span>
								</div>
							</div>
						</Card>
					</Col>)
			})
			setProductCard(productCard)
		}
	}, [products]);
	
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
					<span>您的所创造的<span id='nft_name' style={{fontSize: 32}}>数藏万物</span></span>
				</div>
				<Card className='under-chain' title="待上链的NFT" extra={<span>总数:{productTotal}</span>}>
					{
						productTotal === 0 ? (<Empty
							image={empty}
							imageStyle={{
								height: 120,
							}}
							description={<span>您还没有专属于您的NFT哦,快去创建一个吧~</span>
							}
						>
							<Button type="primary" href="/mint">立即创建</Button>
						</Empty>) : (
							<Row gutter={[24, 16]}>
								{productCard}
							</Row>
						)
					}
				</Card>
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

export default MyMintedTokens;
