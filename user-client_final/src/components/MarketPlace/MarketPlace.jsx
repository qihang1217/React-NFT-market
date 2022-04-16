import React, {useEffect, useState} from "react";
import ColorNFTImage from "../ColorNFTImage/ColorNFTImage";
import ColorNFTDetails from "../CryptoBoyNFTDetails/ColorNFTDetails";
import Loading from "../Loading/Loading";
import FileNFT from "../FileNFT/FileNFT"
import storageUtils from "../../utils/storageUtils";

const MarketPlace = ({
	                     accountAddress,
	                     totalTokensMinted,
	                     changeTokenPrice,
	                     toggleForSale,
	                     buyOwnedEverything,
                     }) => {
	const [insideLoading, setInsideLoading] = useState(false);
	let OwnedEverythings = storageUtils.getProducts()
	
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
		storageUtils.getFinish() ? (
			<div>
				<div className='content-mainTitle'>
					<span>链上总共有<span id='nft_name' style={{fontSize: 32}}>{totalTokensMinted}个数藏万物</span></span>
				</div>
				<div className="d-flex flex-wrap mb-2">
					{OwnedEverythings.map((ownedEverything) => {
						return (
							<div
								key={parseInt(ownedEverything.tokenId._hex, 16)}
								className="w-50 p-4 mt-1 border"
							>
								{!insideLoading ? (
									(ownedEverything.metaData.metaData.type === 'color') ?
										(<ColorNFTImage
											colors={
												ownedEverything.metaData !== undefined
													? ownedEverything.metaData.metaData.colors
													: ""
											}
										/>) : (
											<FileNFT
												tokenURL={
													ownedEverything.metaData !== undefined
														? ownedEverything.metaData.metaData.file_url.file_tokenURl
														: ""
												}
												productId={
													ownedEverything.metaData !== undefined
														? ownedEverything.metaData.productId
														: ""
												}
											/>
										)
								) : (
									<Loading/>
								)}
								<ColorNFTDetails
									ownedEverything={ownedEverything}
									accountAddress={accountAddress}
									changeTokenPrice={changeTokenPrice}
									toggleForSale={toggleForSale}
									buyOwnedEverything={buyOwnedEverything}
								/>
							</div>
						);
					})}
				</div>
			</div>) : (
			<Loading/>
		)
	);
};

export default MarketPlace;
