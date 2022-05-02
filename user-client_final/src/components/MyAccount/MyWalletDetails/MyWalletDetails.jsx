import React from "react";
import {Card} from "antd";
import './MyWalletDetails.less'

const MyWalletDetails = ({accountAddress, accountBalance}) => {
    return (
        <div className='wallet-details'>
            <div className='content-mainTitle'>
                <span>您在<span id='nft_name' style={{fontSize: 32}}>数藏万物</span>的以太坊钱包</span>
            </div>
            <Card title="数藏万物">
                <p className="lead">
                    这是一个NFT市场，您可以在其中铸造{" "}
                    <span>数藏万物NFT</span> 并管理它们
                </p>
                <hr className="my-4"/>
                <div style={{marginBottom: 10}}>
                    <p className="lead">账号地址 :</p>
                    <h4>{accountAddress}</h4>
                </div>
                <div>
                    <p className="lead">账户余额 :</p>
                    <h4>{accountBalance} Ξ</h4>
                </div>
            </Card>
        </div>
    );
};

export default MyWalletDetails;
