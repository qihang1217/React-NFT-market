import React, {useEffect, useState} from "react";
import ColorNFTImage from "../../ColorNFTImage/ColorNFTImage";
import Loading from "../../Loading/Loading";
import {Card, Col, Empty, Row} from 'antd';
import FileNFT from "../../FileNFT/FileNFT";
import ConnectToMetamask from "../../ConnectMetamask/ConnectToMetamask";
import ContractNotDeployed from "../../ContractNotDeployed/ContractNotDeployed";
import storageUtils from "../../../utils/storageUtils";
import {CARD_COLS} from "../../../constants/constants";
import {reqOwnedProducts} from "../../../api/API";


const empty = require('../image/empty.svg')

const ElseAllTokens = ({
	                       connectToMetamask,
	                       metamaskConnected,
	                       contractDetected,
	                       loading,
	                       targetUserId,
                       }) => {
	const [insideLoading, setInsideLoading] = useState(true);
	const [chainDataCard, setChainDataCard] = useState([]);
	const [elseProducts, setElseProducts] = useState([]);
	
	const OwnedEverythings = storageUtils.getProducts()
	
	//他人拥有的产品
	let ElseOwnedEverythings = []
	if (OwnedEverythings) {
		ElseOwnedEverythings = OwnedEverythings.filter((OwnedEverything) =>
			parseInt(OwnedEverything.currentOwnerId._hex, 16) === targetUserId
		);
	}
	
	//获取个人拥有的nft数据
	const reqProductData = async () => {
		// 发请求获取数据
		const result = await reqOwnedProducts(targetUserId)
		if (result.status === 0) {
			// 取出数据
			const {total, list} = result.data
			// 更新状态
			setElseProducts(list)
		}
	}
	
	
	const loadNftData = (OwnedEverythings) => {
		if (OwnedEverythings) {
			if (OwnedEverythings.length !== 0) {
				//渲染出其所拥有的数藏万物
				let tempChainDataCard = ElseOwnedEverythings.map((item) => {
					if (elseProducts) {
						const current_product = elseProducts.find(inItem => {
							return (inItem.product_id === item.metaData.productId)
						})
						if (current_product) {
							//将不显示的数据设置为null
							if (!current_product.open_status) {
								return null
							}
						}
						let {
							tokenName,
							price,
						} = item;
						price = parseInt(price._hex, 16).toString()
						const tokenId = parseInt(item.tokenId._hex, 16)
						return (
							<Col span={CARD_COLS}>
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
								</Card>
							</Col>
						)
					}
				})
				//去除之前设置的null
				tempChainDataCard = tempChainDataCard.filter((item) =>
					item !== null
				)
				// console.log(tempChainDataCard)
				setChainDataCard(tempChainDataCard)
				setInsideLoading(false)
			}
		}
	}
	
	//加载个人在链上拥有的nft数据
	useEffect(() => {
		loadNftData(OwnedEverythings)
	}, [OwnedEverythings]);
	
	useEffect(() => {
		reqProductData()
	}, [])
	
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
					<span>Ta的所收藏的<span id='nft_name' style={{fontSize: 32}}>数藏万物</span></span>
				</div>
				<Card title="已上链的NFT" extra={
					<span>总数:{ElseOwnedEverythings.length} 可见数:{chainDataCard.length}</span>}
				>
					{!(chainDataCard.length) ? (
							<Empty
								image={empty}
								imageStyle={{
									height: 120,
								}}
								description={<span>Ta还没有公开的数藏万物,敬请期待~</span>
								}
							>
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

export default ElseAllTokens;
