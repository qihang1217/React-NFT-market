import React, {useEffect, useState} from "react";
import ColorNFTImage from "../ColorNFTImage/ColorNFTImage";
import Loading from "../Loading/Loading";
import {Button, Card, Col, Empty, Form, Input, Row} from 'antd';
import './MyTokens.less'
import {reqOwnedProducts} from "../../api/API";
import ApiUtil from "../../utils/ApiUtil";
import FileViewer from 'react-file-viewer';

const empty = require('./empty.svg')

const MyTokens = ({
	                  accountAddress,
	                  OwnedEverythings,
	                  totalTokensOwnedByAccount,
	                  toggleForSale,
	                  changeTokenPrice,
                  }) => {
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState([]);
	const [productTotal, setProductTotal] = useState(0);
	const [productCard, setProductCard] = useState([]);
	const [chainDataCard, setChainDataCard] = useState([]);
	
	//加载个人在链上拥有的nft数据
	useEffect(() => {
		if (OwnedEverythings.length !== 0) {
			if (OwnedEverythings[0].metaData !== undefined) {
				setLoading(loading);
			} else {
				setLoading(false);
			}
		}
		
		//筛选出个人所拥有的数藏万物
		const MyOwnedEverythings = OwnedEverythings.filter(
			(OwnedEverything) => OwnedEverything.currentOwner === accountAddress
		);
		
		const ChainDataCard = MyOwnedEverythings.map((item) => {
			const {
				tokenName,
				price,
			} = item;
			
			//进行上架或者下架操作
			const handleUnderOrUp = () => {
				toggleForSale(
					item.tokenId.toNumber()
				)
			}
			
			//点击被隐藏的按钮,进行表单提交
			const handleChangePrice = (e) => {
				const text = item.tokenId
				const submit = document.getElementById(text)
				submit.click()
			}
			
			const callChangeTokenPriceFromApp = (tokenId, newPrice) => {
				changeTokenPrice(tokenId, newPrice);
			};
			
			//处理表单提交的数据
			const handleSubmit = (value) => {
				const price = value.price
				callChangeTokenPriceFromApp(
					item.tokenId.toNumber(),
					price
				);
			}
			
			
			//设置出售状态及其样式
			const sale_status = (accountAddress === item.currentOwner) ?
				(item.forSale ? ('下架') : ('上架')) : null
			const sale_status_button_style = (accountAddress === item.currentOwner) ?
				(!!item.forSale) : null
			
			return (<Col span={card_cols}>
					<Card
						className='inside-card'
						hoverable
						bordered
						cover={!loading ? (
							<ColorNFTImage
								colors={
									item.metaData !== undefined ?
										item.metaData.metaData.colors : ""
								}
							/>) : (<Loading/>)
						}
						actions={[
							<Button type="primary" ghost
							        onClick={(e) => {
								        handleChangePrice(e)
							        }}
							>
								修改价格
							</Button>,
							<Button type='primary' danger={sale_status_button_style}
							        onClick={() => handleUnderOrUp()}
							>
								{sale_status}
							</Button>,
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
							onFinish={handleSubmit}
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
		})
		setChainDataCard(ChainDataCard)
	}, [OwnedEverythings]);
	
	//获取个人拥有的nft数据
	const reqProductData = async () => {
		let result
		// 发请求获取数据
		const userData = JSON.parse(localStorage.getItem('user_data'))
		const userId = userData['user_id']
		result = await reqOwnedProducts(userId)
		if (result.status === 0) {
			// 取出数据
			const {total, list} = result.data
			// 更新状态
			setProducts(list)
			setProductTotal(total)
		}
	}
	
	//初次加载时获取个人拥有的nft数据
	useEffect(() => {
		reqProductData()
	}, []);
	
	const handleCastOrRetry = async (e) => {
		const value = e.target.innerHTML
		if (value === '开始铸造') {
		
		} else if (value === '重新提交') {
		
		}
	}
	
	const card_cols = 6
	
	//获取个人拥有的nft数据后进行渲染
	useEffect(() => {
		if (products) {
			setProductCard(products.map(item => {
				let status_name, status_content, status_action
				if (item.pass_status === true) {
					status_name = '审核通过'
					status_action = '开始铸造'
					status_content = (<span className='bottom-value'>{status_name}</span>)
				} else if (item.pass_status === false) {
					status_name = '审核未通过'
					status_action = '重新提交'
					status_content = (
						<span style={{color: '#F63638FF'}} className='bottom-value'>{status_name}</span>)
				}
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
				return (<Col span={card_cols}>
					<Card
						className='inside-card'
						hoverable
						bordered
						cover={
							previewContent
						}
						actions={[
							<Button type='primary' onClick={(e) => handleCastOrRetry(e)}>{status_action}</Button>,
							<Button type="primary" danger>删除</Button>,
						]}
					>
						<div style={{display: 'flex', justifyContent: 'space-between'}}>
							<div>
								<div className='top-attribute'>NFT名字</div>
								<div>{item.product_name}</div>
							</div>
							<div className='right-content'>
								<div className='top-attribute'>状态</div>
								{status_content}
							</div>
						</div>
					</Card>
				</Col>)
			}))
		}
	}, [products]);
	
	
	return (
		<div className='my-token'>
			<div className='content-title'>
				<span>您的<span id='nft_name' style={{fontSize: 32}}>数藏万物</span></span>
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
				<Card title="已上链的NFT" extra={<span>总数:{totalTokensOwnedByAccount}</span>}>
					{!totalTokensOwnedByAccount ? (
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
			</Card>
		</div>
	);
};

export default MyTokens;
