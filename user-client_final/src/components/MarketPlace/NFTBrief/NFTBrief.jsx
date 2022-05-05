import React, {Component} from "react";
import {ADDRESS_DISPLAY_LENGTH} from "../../../constants/constants";
import './NFTBrief.less'
import {Button} from "antd";

class NFTBrief extends Component {
    
    render() {
        const price = window.web3.utils.fromWei(
            parseInt(this.props.ownedEverything.price._hex, 16).toString(),
            "Ether"
        )
        return (
            <div className='nft-brief'>
                <div key={parseInt(this.props.ownedEverything.tokenId)} className="mt-4 info-brief">
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
                        {this.props.ownedEverything.mintedBy.substr(0, ADDRESS_DISPLAY_LENGTH) +
                            "..." +
                            this.props.ownedEverything.mintedBy.slice(
                                this.props.ownedEverything.mintedBy.length - ADDRESS_DISPLAY_LENGTH
                            )}
                    </p>
                    <p>
                        <span className="font-weight-bold">拥有者</span> :{" "}
                        {this.props.ownedEverything.currentOwner.substr(0, ADDRESS_DISPLAY_LENGTH) +
                            "..." +
                            this.props.ownedEverything.currentOwner.slice(
                                this.props.ownedEverything.currentOwner.length - ADDRESS_DISPLAY_LENGTH
                            )}
                    </p>
                    <p>
                        <span className="font-weight-bold">上一个拥有者</span> :{" "}
                        {this.props.ownedEverything.previousOwner.substr(0, ADDRESS_DISPLAY_LENGTH) +
                            "..." +
                            this.props.ownedEverything.previousOwner.slice(
                                this.props.ownedEverything.previousOwner.length - ADDRESS_DISPLAY_LENGTH
                            )}
                    </p>
                    <p>
                        <span className="font-weight-bold">价格</span> :{" "}{price}{" "}Ξ
                    </p>
                    <p>
                        <span className="font-weight-bold">累计交易次数</span> :{" "}
                        {parseInt(this.props.ownedEverything.numberOfTransfers._hex, 16)}
                    </p>
                    <div className='trade-button'>
                        {this.props.accountAddress !== this.props.ownedEverything.currentOwner ? (
                            this.props.ownedEverything.forSale ? (
                                <Button
                                    type='primary'
                                    block
                                    value={parseInt(this.props.ownedEverything.price._hex, 16).toString()}
                                    onClick={(e) => {
                                        // console.log(e.target.value)
                                        this.props.buyOwnedEverything(
                                            parseInt(this.props.ownedEverything.tokenId._hex, 16),
                                            e.target.value
                                        )
                                    }
                                    }
                                >
                                    用{" "}{price}{" "}Ξ拥有它
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        disabled
                                        dangerous
                                        block
                                    >
                                        当前它不出售!
                                    </Button>
                                </>
                            )
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default NFTBrief;
