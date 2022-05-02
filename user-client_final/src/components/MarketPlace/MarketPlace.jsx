import React, {useEffect, useState} from "react";
import ColorNFTImage from "../ColorNFTImage/ColorNFTImage";
import NFTDetails from "./NFTDetails/NFTDetails";
import Loading from "../Loading/Loading";
import FileNFT from "../FileNFT/FileNFT"
import storageUtils from "../../utils/storageUtils";
import empty from "../MyTokenDetail/empty.svg";
import {Empty} from "antd";

const MarketPlace = ({
	                     accountAddress,
	                     totalTokensMinted,
	                     changeTokenPrice,
	                     toggleForSale,
	                     buyOwnedEverything,
                     }) => {
	const [insideLoading, setInsideLoading] = useState(false);
	let OwnedEverythings = storageUtils.getProducts()
	let ElseOwnedEverythings = []
	if (OwnedEverythings) {
		ElseOwnedEverythings = OwnedEverythings.filter((OwnedEverything) =>
			OwnedEverything.currentOwner !== accountAddress
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
					<div className="d-flex flex-wrap mb-2">
						{ElseOwnedEverythings.map((ownedEverything) => {
							const tokenId = parseInt(ownedEverything.tokenId._hex, 16)
							return (
								<div
									key={tokenId}
									className="w-50 p-4 mt-1 border"
								>
									{!insideLoading ? (
										(ownedEverything.metaData.metaData.type === 'color') ?
											(<ColorNFTImage
												colors={ownedEverything.metaData.metaData.colors}
										/>) : (<FileNFT
											tokenURL={ownedEverything.metaData.metaData.file_url.file_tokenURl}
											tokenId={tokenId}
										/>)
								) : (
									<Loading/>
								)}
								<NFTDetails
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
