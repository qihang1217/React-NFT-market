import React, {useEffect, useState} from "react";
import ColorNFTImage from "../ColorNFTImage/ColorNFTImage";
import NFTBrief from "./NFTBrief/NFTBrief";
import Loading from "../Loading/Loading";
import FileNFTContent from "../FileNFTContent/FileNFTContent"
import storageUtils from "../../utils/storageUtils";
import empty from "../MyAccount/image/empty.svg";
import './MarketPlace.less'
import {Col, Empty, Row} from "antd";
import {setPreview} from "../../utils/SetPreview";

const MarketPlace = ({
	                     accountAddress,
	                     totalTokensMinted,
	                     changeTokenPrice,
	                     toggleForSale,
	                     buyOwnedEverything,
                     }) => {
	const [insideLoading, setInsideLoading] = useState(false);
	
	const userId = storageUtils.getUser().user_id;
	
	let OwnedEverythings = storageUtils.getProducts()
	let ElseOwnedEverythings = []
	
	if (OwnedEverythings) {
		ElseOwnedEverythings = OwnedEverythings.filter((OwnedEverything) =>
			parseInt(OwnedEverything.currentOwnerId._hex, 16) !== userId
		);
	}
	useEffect(() => {
		if (OwnedEverythings) {
			if (OwnedEverythings.length !== 0) {
				if (OwnedEverythings[0].metaData !== undefined) {
					setInsideLoading(insideLoading);
				} else {
					setInsideLoading(false);
				}
			}
		}
	}, [OwnedEverythings]);
	
	
	return (
		storageUtils.getFinish() ? (ElseOwnedEverythings.length !== 0 ? (
				<div>
					<div className='content-mainTitle'>
						<span>链上总共有<span id='nft_name' style={{fontSize: 32}}>{totalTokensMinted}个数藏万物</span></span>
					</div>
					<Row justify="space-around" gutter={[16, 32]} className="nfts-container">
						{ElseOwnedEverythings.map((item) => {
							const tokenId = parseInt(item.tokenId._hex, 16)
							
							const filename = item.metaData.fileUrl
							const ext = filename.substring(filename.lastIndexOf('.') + 1);
							const filetype = item.metaData.fileType
							const src = item.metaData.tokenUrl
							let previewContent = setPreview(item, filename, ext, filetype, src)
							
							return (
								<Col span={8} key={tokenId}>
									<div
										className="nft-container"
									>
										<div>
											{!insideLoading ? (
												(item.metaData.metaData.type === 'color') ?
													(<ColorNFTImage
														colors={item.metaData.metaData.colors}
													/>) : (<FileNFTContent
														tokenId={tokenId}
														previewContent={previewContent}
													/>)
											) : (
												<Loading/>
											)}
											<NFTBrief
												item={item}
												accountAddress={accountAddress}
												changeTokenPrice={changeTokenPrice}
												toggleForSale={toggleForSale}
												buyOwnedEverything={buyOwnedEverything}
											/>
										</div>
									</div>
								</Col>
							);
						})}
					</Row>
				</div>) : (
				<Empty
					image={empty}
					imageStyle={{
						height: 120,
					}}
					description={<span>还没有其他人所拥有的NFT~</span>
					}
				>
				</Empty>
			)
		) : (
			<Loading/>
		)
	);
};

export default MarketPlace;
