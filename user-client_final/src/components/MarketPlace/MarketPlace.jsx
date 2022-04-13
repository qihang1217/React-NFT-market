import React, {useEffect, useState} from "react";
import ColorNFTImage from "../ColorNFTImage/ColorNFTImage";
import CryptoBoyNFTDetails from "../CryptoBoyNFTDetails/CryptoBoyNFTDetails";
import Loading from "../Loading/Loading";

const MarketPlace = ({
                         OwnedEverythings,
                         accountAddress,
                         totalTokensMinted,
                         changeTokenPrice,
                         toggleForSale,
                         buyCryptoBoy,
                     }) => {
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (OwnedEverythings.length !== 0) {
            if (OwnedEverythings[0].metaData !== undefined) {
                setLoading(loading);
            } else {
                setLoading(false);
            }
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
                {OwnedEverythings.map((cryptoboy) => {
                    return (
                        <div
                            key={cryptoboy.tokenId.toNumber()}
                            className="w-50 p-4 mt-1 border"
                        >
                            {!loading ? (
                                <ColorNFTImage
                                    colors={
                                        cryptoboy.metaData !== undefined
                                            ? cryptoboy.metaData.metaData.colors
                                            : ""
                                    }
                                />
                            ) : (
                                <Loading/>
                            )}
                            <CryptoBoyNFTDetails
                                cryptoboy={cryptoboy}
                                accountAddress={accountAddress}
                                changeTokenPrice={changeTokenPrice}
                                toggleForSale={toggleForSale}
                                buyCryptoBoy={buyCryptoBoy}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MarketPlace;
