import React from "react";

const AccountDetails = ({ accountAddress, accountBalance }) => {
    return (
        <div>
            <div className="jumbotron">
                <h1 className="display-5">CryptoBoy NFT Marketplace</h1>
                <p className="lead">
                    这是一个NFT市场，您可以在其中实现ERC721协议{" "}
                    <i>数藏万物NFT</i> 并管理它们
                </p>
                <hr className="my-4" />
                <p className="lead">账号地址 :</p>
                <h4>{accountAddress}</h4>
                <p className="lead">账户余额 :</p>
                <h4>{accountBalance} Ξ</h4>
            </div>
        </div>
    );
};

export default AccountDetails;
