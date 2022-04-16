import React from "react";

const ContractNotDeployed = () => {
    return (
        <div className="jumbotron">
            <h3>数藏万物智能合约尚未部署到此网络</h3>
            <hr className="my-4"/>
            <p className="lead">
            将Metamask连接到Kovan Testnet或运行自定义RPC（如Ganache）的本地端口7545
            </p>
        </div>
    );
};

export default ContractNotDeployed;
