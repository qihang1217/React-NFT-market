import React, {useEffect, useState} from "react";
import CryptoBoyNFTImage from "../CryptoBoyNFTImage/CryptoBoyNFTImage";
import MyCryptoBoyNFTDetails from "../MyCryptoBoyNFTDetails/MyCryptoBoyNFTDetails";
import Loading from "../Loading/Loading";

import {Button, Empty} from 'antd';
const empty=require('./empty.svg')

const MyTokens = ({
                      accountAddress,
                      cryptoBoys,
                      totalTokensOwnedByAccount,
                  }) => {
    const [loading, setLoading] = useState(false);
    const [myCryptoBoys, setMyCryptoBoys] = useState([]);

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

    return (
        <div>
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
