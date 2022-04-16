import React from "react";

const MyCryptoBoyNFTDetails = (props) => {
    const {
        tokenId,
        tokenName,
        price,
        mintedBy,
        previousOwner,
        numberOfTransfers,
    } = props.cryptoboy;
    return (
        <div key={tokenId.toNumber()} className="mt-4 ml-3">
            <p>
                <span className="font-weight-bold">代币号</span> :{" "}
                {tokenId.toNumber()}
            </p>
            <p>
                <span className="font-weight-bold">名字</span> : {tokenName}
            </p>
            <p>
                <span className="font-weight-bold">价格</span> :{" "}
                {window.web3.utils.fromWei(price.toString(), "Ether")} Ξ
            </p>
            <p>
                <span className="font-weight-bold">转让次数</span> :{" "}
                {numberOfTransfers.toNumber()}
            </p>
            {props.accountAddress === mintedBy &&
            props.accountAddress !== previousOwner ? (
                <div className="alert alert-success w-50 text-center m-auto">
                    已铸造
                </div>
            ) : (
                <div className="alert alert-info w-50 text-center m-auto">已购买</div>
            )}
        </div>
    );
};

export default MyCryptoBoyNFTDetails;
