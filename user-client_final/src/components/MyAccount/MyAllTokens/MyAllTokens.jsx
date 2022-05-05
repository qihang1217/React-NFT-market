import React, {useEffect, useState} from "react";
import Loading from "../../Loading/Loading";
import {Button, Card, Empty, Row} from 'antd';
import ConnectToMetamask from "../../ConnectMetamask/ConnectToMetamask";
import ContractNotDeployed from "../../ContractNotDeployed/ContractNotDeployed";
import storageUtils from "../../../utils/storageUtils";
import FileViewer from 'react-file-viewer';
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
	
	const OwnedEverythings = storageUtils.getProducts()
	let MyOwnedEverythings = []
	if (OwnedEverythings) {
		MyOwnedEverythings = OwnedEverythings.filter((OwnedEverything) =>
			OwnedEverything.currentOwner === accountAddress
		);
	}
	
	let previewContent
	
	const setPreview = (item, filename, ext, filetype, src) => {
		previewContent = (
			<FileViewer
				fileType={ext}
				filePath={src}
			/>
		)
		if (/^image\/\S+$/.test(filetype)) {
			previewContent = (<img src={src} alt={filename} className='file'/>)
		} else if (/^video\/\S+$/.test(filetype)) {
			previewContent = (<video src={src} loop preload className='file'/>)
		} else if (/^audio\/\S+$/.test(filetype)) {
			previewContent = (
				<audio preload className='file'>
					<source src={src}/>
					<embed src={src}/>
				</audio>
			)
		}
		return previewContent
	}
	
	const loadNftData = (OwnedEverythings) => {
		if (OwnedEverythings) {
			if (OwnedEverythings.length !== 0) {
				setProducts(list)
				//筛选出个人所拥有的数藏万物
				const ChainDataCard = MyOwnedEverythings.map((item) => {
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
				)
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
