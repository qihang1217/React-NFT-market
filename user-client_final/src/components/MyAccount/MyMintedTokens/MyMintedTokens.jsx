import React, {useEffect, useState} from "react";
import Loading from "../../Loading/Loading";
import {Button, Card, Empty, Row} from 'antd';
import ConnectToMetamask from "../../ConnectMetamask/ConnectToMetamask";
import ContractNotDeployed from "../../ContractNotDeployed/ContractNotDeployed";
import storageUtils from "../../../utils/storageUtils";
import UnderChainTokenItem from "../UnderChainTokenItem/UnderChainTokenItem";

const empty = require('../image/empty.svg')

const MyMintedTokens = ({
	                        connectToMetamask,
	                        metamaskConnected,
	                        contractDetected,
	                        loading,
	                        accountAddress,
	                        toggleForSale,
	                        changeTokenPrice,
	                        mintMyFileNFT,
	                        reqProductData,
	                        list,
	                        total,
                        }) => {
	const [insideLoading, setInsideLoading] = useState(true);
	const [products, setProducts] = useState([]);
	const [productTotal, setProductTotal] = useState(0);
	const [productCard, setProductCard] = useState([]);
	
	const userId = storageUtils.getUser().user_id;
	const OwnedEverythings = storageUtils.getProducts()
	let MyOwnedEverythings = []
	if (OwnedEverythings) {
		MyOwnedEverythings = OwnedEverythings.filter((OwnedEverything) =>
			(parseInt(OwnedEverything.currentOwnerId._hex, 16) === userId) && OwnedEverything.mintedBy === accountAddress
		);
	}
	
	//获取个人拥有的nft数据后进行渲染
	useEffect(() => {
		setProducts(list)
		setProductTotal(total)
		if (products) {
			const productCard = products.map((item) => {
				return (
					<UnderChainTokenItem
						item={item}
						mintMyFileNFT={mintMyFileNFT}
						reqProductData={reqProductData}
					/>
				)
			})
			setProductCard(productCard)
		}
	}, [products, list]);
	
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
					<span>您将要创造的<span id='nft_name' style={{fontSize: 32}}>数藏万物</span></span>
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
			</div>)
	);
};

export default MyMintedTokens;
