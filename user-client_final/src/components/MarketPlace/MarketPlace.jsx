import React, {useEffect, useState} from "react";
import ColorNFTImage from "../ColorNFTImage/ColorNFTImage";
import ColorNFTDetails from "../CryptoBoyNFTDetails/ColorNFTDetails";
import Loading from "../Loading/Loading";
import FileNFT from "../FileNFT/FileNFT"

const MarketPlace = ({
	                     OwnedEverythings,
	                     accountAddress,
	                     totalTokensMinted,
	                     changeTokenPrice,
	                     toggleForSale,
	                     buyOwnedEverything,
                     }) => {
	const [insideLoading, setInsideLoading] = useState(false);
	
	useEffect(() => {
		if (OwnedEverythings.length !== 0) {
			if (OwnedEverythings[0].metaData !== undefined) {
				setInsideLoading(insideLoading);
			} else {
				setInsideLoading(false);
			}
			console.log(OwnedEverythings)
		}
	}, [OwnedEverythings]);
	
	return (
		<div>
			<div className="card mt-1">
				<div className="card-body align-items-center d-flex justify-content-center">
					<h5>
						Total No. of CryptoBoy's Minted On The Platform :{" "}
						{totalTokensMinted}
					</h5>
				</div>
			</div>
			<div className="d-flex flex-wrap mb-2">
				{OwnedEverythings.map((ownedEverything) => {
					// console.log(ownedEverything.metaData.metaData)
					return (
						<div
							key={ownedEverything.tokenId.toNumber()}
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
		</div>
	);
};

export default MarketPlace;
