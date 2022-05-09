import React, {useEffect, useState} from "react";
import Loading from "../../Loading/Loading";
import {Button, Card, Empty, Row} from 'antd';
import ConnectToMetamask from "../../ConnectMetamask/ConnectToMetamask";
import ContractNotDeployed from "../../ContractNotDeployed/ContractNotDeployed";
import storageUtils from "../../../utils/storageUtils";
import ChainTokenItem from "../ChainTokenItem/ChainTokenItem";

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
	
	const userId = storageUtils.getUser().user_id;
	const OwnedEverythings = storageUtils.getProducts()
	let MyOwnedEverythings = []
	if (OwnedEverythings) {
		MyOwnedEverythings = OwnedEverythings.filter((OwnedEverything) =>
			parseInt(OwnedEverything.currentOwnerId._hex, 16) === userId
		);
	}
	
	const loadNftData = (OwnedEverythings) => {
		if (OwnedEverythings) {
			if (OwnedEverythings.length !== 0) {
				setProducts(list)
				//筛选出个人所拥有的数藏万物
				setChainDataCard(MyOwnedEverythings.map((item) => {
						return (
							<ChainTokenItem
								item={item}
								accountAddress={accountAddress}
								toggleForSale={toggleForSale}
								changeTokenPrice={changeTokenPrice}
								products={products}
								insideLoading={insideLoading}
							/>
						)
					}
				))
				//加载完毕
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
								<Button type="primary" href="/upload_mint">立即创建</Button>
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
