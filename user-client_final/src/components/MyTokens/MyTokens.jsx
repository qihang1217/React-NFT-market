import React, {useEffect, useState} from "react";
import CryptoBoyNFTImage from "../CryptoBoyNFTImage/CryptoBoyNFTImage";
import MyCryptoBoyNFTDetails from "../MyCryptoBoyNFTDetails/MyCryptoBoyNFTDetails";
import Loading from "../Loading/Loading";
import {Button, Card, Col, Empty, Row} from 'antd';
import './MyTokens.less'
import {reqOwnedProducts} from "../../api/API";
import ApiUtil from "../../utils/ApiUtil";
import FileViewer from 'react-file-viewer';

const empty = require('./empty.svg')

const MyTokens = ({
	                  accountAddress,
	                  cryptoBoys,
	                  totalTokensOwnedByAccount,
                  }) => {
	const [loading, setLoading] = useState(false);
	const [myCryptoBoys, setMyCryptoBoys] = useState([]);
	const [products, setProducts] = useState([]);
	const [productTotal, setProductTotal] = useState(0);
	const [productCard, setProductCard] = useState([]);
	
	
	useEffect(() => {
		if (cryptoBoys.length !== 0) {
			if (cryptoBoys[0].metaData !== undefined) {
				setLoading(loading);
			} else {
				setLoading(false);
			}
		}
		const my_crypto_boys = cryptoBoys.filter(
			(cryptoboy) => cryptoboy.currentOwner === accountAddress
		);
		setMyCryptoBoys(my_crypto_boys);
	}, [cryptoBoys]);
	
	
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
	
	
	useEffect(() => {
		reqProductData()
	}, []);
	// {
	//     "0": {
	//     "category_id": 9,
	//         "description": "4",
	//         "file_type": "image/jpeg",
	//         "file_url": "16497037748897.jpg",
	//         "owner_id": 1,
	//         "pass_status": true,
	//         "price": 3,
	//         "product_id": 1,
	//         "product_name": "1"
	// }
	// }
	const card_cols = 6
	
	useEffect(() => {
		if (products) {
			setProductCard(products.map(item => {
				let status_name
				if (item.pass_status === true) {
					status_name = '审核通过'
				} else if (item.pass_status === false)
					status_name = '审核未通过'
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
							filePath={src}/>
					)
				}
				return (<Col span={card_cols}>
					<Card
						hoverable
						bordered
						cover={
							previewContent
						}
					>
						<div style={{display: 'flex', 'justify-content': 'space-between'}}>
							<div>
								<div className='top-attribute'>NFT名字</div>
								<div>{item.product_name}</div>
							</div>
							<div className='right-content'>
								<div className='top-attribute'>状态</div>
								<Button type="primary" className='bottom-value'>{status_name}</Button>
							</div>
						</div>
					</Card>
				</Col>)
			}))
		}
	}, [products]);
	
	
	return (
		<div>
			<Card title="待上链的NFT">
				<Row gutter={[24, 16]}>
					{productCard}
				</Row>
			</Card>
			{!totalTokensOwnedByAccount ? (
					<Empty
						image={empty}
						imageStyle={{
							height: 120,
						}}
						description={
							<span>
                            您还没有专属于您的NFT哦,快去创建一个吧~
                        </span>
						}
					>
						<Button type="primary" href="/mint">立即创建</Button>
					</Empty>) :
				(
					<div>
						<div className="card mt-1">
							<div className="card-body align-items-center d-flex justify-content-center">
								<h5>
									Total No. of CryptoBoy's You Own : {totalTokensOwnedByAccount}
								</h5>
							</div>
						</div>
						<div className="d-flex flex-wrap mb-2">
							{myCryptoBoys.map((cryptoboy) => {
								return (
									<div
										key={cryptoboy.tokenId.toNumber()}
										className="w-50 p-4 mt-1 border"
									>
										<div className="row">
											<div className="col-md-6">
												{!loading ? (
													<CryptoBoyNFTImage
														colors={
															cryptoboy.metaData !== undefined
																? cryptoboy.metaData.metaData.colors
																: ""
														}
													/>
												) : (
													<Loading/>
												)}
											</div>
											<div className="col-md-6 text-center">
												<MyCryptoBoyNFTDetails
													cryptoboy={cryptoboy}
													accountAddress={accountAddress}
												/>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}
		</div>
	);
};

export default MyTokens;
