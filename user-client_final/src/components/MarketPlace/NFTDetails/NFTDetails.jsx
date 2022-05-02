import React, {Component} from "react";

class NFTDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCryptoBoyPrice: "",
        };
    }
    
    render() {
        return (
            <div key={parseInt(this.props.ownedEverything.tokenId)} className="mt-4">
                <p>
                    <span className="font-weight-bold">数藏万物ID</span> :{" "}
                    {parseInt(this.props.ownedEverything.tokenId._hex, 16)}
                </p>
                <p>
                    <span className="font-weight-bold">名字</span> :{" "}
                    {this.props.ownedEverything.tokenName}
                </p>
                <p>
                    <span className="font-weight-bold">铸造者</span> :{" "}
                    {this.props.ownedEverything.mintedBy.substr(0, 5) +
                        "..." +
                        this.props.ownedEverything.mintedBy.slice(
                            this.props.ownedEverything.mintedBy.length - 5
                        )}
                </p>
                <p>
                    <span className="font-weight-bold">拥有者</span> :{" "}
                    {this.props.ownedEverything.currentOwner.substr(0, 5) +
                        "..." +
                        this.props.ownedEverything.currentOwner.slice(
                            this.props.ownedEverything.currentOwner.length - 5
                        )}
                </p>
                <p>
                    <span className="font-weight-bold">上一个拥有者</span> :{" "}
                    {this.props.ownedEverything.previousOwner.substr(0, 5) +
                        "..." +
                        this.props.ownedEverything.previousOwner.slice(
                            this.props.ownedEverything.previousOwner.length - 5
                        )}
                </p>
                <p>
                    <span className="font-weight-bold">价格</span> :{" "}
                    {
                        window.web3.utils.fromWei(
                            parseInt(this.props.ownedEverything.price._hex, 16).toString(),
                            "Ether"
                        )}{" "}
                    Ξ
                </p>
                <p>
                    <span className="font-weight-bold">累计交易次数</span> :{" "}
                    {parseInt(this.props.ownedEverything.numberOfTransfers._hex, 16)}
                </p>
                <div>
                    {this.props.accountAddress !== this.props.ownedEverything.currentOwner ? (
                        this.props.ownedEverything.forSale ? (
                            <button
                                className="btn btn-outline-primary mt-3 w-50"
                                value={parseInt(this.props.ownedEverything.price._hex, 16).toString()}
                                style={{fontSize: "0.8rem", letterSpacing: "0.14rem"}}
                                onClick={(e) => {
                                    console.log(e.target.value)
                                    this.props.buyOwnedEverything(
                                        parseInt(this.props.ownedEverything.tokenId._hex, 16),
                                        e.target.value
                                    )
                                }
                                }
                            >
                                用{" "}
                                {window.web3.utils.fromWei(
                                    parseInt(this.props.ownedEverything.price._hex, 16).toString(),
                                    "Ether"
                                )}{" "}
                                Ξ拥有它
                            </button>
                        ) : (
                            <>
                                <button
                                    disabled
                                    style={{fontSize: "0.8rem", letterSpacing: "0.14rem"}}
                                    className="btn btn-outline-primary mt-3 w-50"
                                >
                                    用{" "}
                                    {window.web3.utils.fromWei(
                                        parseInt(this.props.ownedEverything.price._hex, 16).toString(),
                                        "Ether"
                                    )}{" "}
                                    Ξ拥有它
                                </button>
                                <p className="mt-2">当前它不出售!</p>
                            </>
                        )
                    ) : null}
                </div>
            </div>
        );
    }
}

export default NFTDetails;
