import React, {Component} from "react";
import {ADDRESS_DISPLAY_LENGTH} from "../../../constants/constants";
import './NFTBrief.less'
import {Button} from "antd";

class NFTBrief extends Component {
    
    render() {
        const price = window.web3.utils.fromWei(
            parseInt(this.props.item.price._hex, 16).toString(),
            "Ether"
        )
        return (
            <div className='nft-brief'>
                <div key={parseInt(this.props.item.tokenId)} className="mt-4 info-brief">
                    <p>
                        <span className="font-weight-bold">数藏万物ID</span> :{" "}
                        {parseInt(this.props.item.tokenId._hex, 16)}
                    </p>
                    <p>
                        <span className="font-weight-bold">名字</span> :{" "}
                        {this.props.item.tokenName}
                    </p>
                    <p>
                        <span className="font-weight-bold">铸造者</span> :{" "}
                        {this.props.item.mintedBy.substr(0, ADDRESS_DISPLAY_LENGTH) +
                            "..." +
                            this.props.item.mintedBy.slice(
                                this.props.item.mintedBy.length - ADDRESS_DISPLAY_LENGTH
                            )}
                    </p>
                    <p>
                        <span className="font-weight-bold">拥有者</span> :{" "}
                        {this.props.item.currentOwner.substr(0, ADDRESS_DISPLAY_LENGTH) +
                            "..." +
                            this.props.item.currentOwner.slice(
                                this.props.item.currentOwner.length - ADDRESS_DISPLAY_LENGTH
                            )}
                    </p>
                    <p>
                        <span className="font-weight-bold">上一个拥有者</span> :{" "}
                        {this.props.item.previousOwner.substr(0, ADDRESS_DISPLAY_LENGTH) +
                            "..." +
                            this.props.item.previousOwner.slice(
                                this.props.item.previousOwner.length - ADDRESS_DISPLAY_LENGTH
                            )}
                    </p>
                    <p>
                        <span className="font-weight-bold">价格</span> :{" "}{price}{" "}Ξ
                    </p>
                    <p>
                        <span className="font-weight-bold">累计交易次数</span> :{" "}
                        {parseInt(this.props.item.numberOfTransfers._hex, 16)}
                    </p>
                    <div className='trade-button'>
                        {this.props.accountAddress !== this.props.item.currentOwner ? (
                            this.props.item.forSale ? (
                                <Button
                                    type='primary'
                                    block
                                    value={parseInt(this.props.item.price._hex, 16).toString()}
                                    onClick={(e) => {
                                        // console.log(e.target.value)
                                        this.props.buyOwnedEverything(
                                            parseInt(this.props.item.tokenId._hex, 16),
                                            price
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
