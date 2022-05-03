import React, {useEffect, useState} from "react";
import ColorNFTImage from "../../ColorNFTImage/ColorNFTImage";
import Loading from "../../Loading/Loading";
import {Button, Card, Col, Empty, Row} from 'antd';
import FileNFT from "../../FileNFT/FileNFT";
import ConnectToMetamask from "../../ConnectMetamask/ConnectToMetamask";
import ContractNotDeployed from "../../ContractNotDeployed/ContractNotDeployed";
import storageUtils from "../../../utils/storageUtils";
import {card_cols} from "../../../constants/constants";

const empty = require('../../MyTokenDetail/empty.svg')

const ElseAllTokens = ({
	                       connectToMetamask,
	                       metamaskConnected,
	                       contractDetected,
	                       loading,
	                       totalTokensOwnedByAccount,
	                       list,
                       }) => {
	const [insideLoading, setInsideLoading] = useState(true);
	const [chainDataCard, setChainDataCard] = useState([]);
	const [products, setProducts] = useState(list);
	const OwnedEverythings = storageUtils.getProducts()
	let MyOwnedEverythings = []
	if (OwnedEverythings) {
		MyOwnedEverythings = OwnedEverythings.filter((OwnedEverything) =>
			parseInt(OwnedEverything.currentOwnerId._hex, 16) === 2
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
					
					if (products) {
						const current_product = products.find(inItem => {
							return (inItem.product_id === item.metaData.productId)
						})
						if (current_product) {
							// console.log(current_product)
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
			
			</div>)
	);
};

export default ElseAllTokens;
