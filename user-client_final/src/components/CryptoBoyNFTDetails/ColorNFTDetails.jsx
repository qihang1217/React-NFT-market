import React, {Component} from "react";

class ColorNFTDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCryptoBoyPrice: "",
        };
    }

    callChangeTokenPriceFromApp = (tokenId, newPrice) => {
        this.props.changeTokenPrice(tokenId, newPrice);
    };

    render() {
        return (
            <div key={this.props.ownedEverything.tokenId.toNumber()} className="mt-4">
                <p>
                    <span className="font-weight-bold">Token Id</span> :{" "}
                    {this.props.ownedEverything.tokenId.toNumber()}
                </p>
                <p>
                    <span className="font-weight-bold">Name</span> :{" "}
                    {this.props.ownedEverything.tokenName}
                </p>
                <p>
                    <span className="font-weight-bold">Minted By</span> :{" "}
                    {this.props.ownedEverything.mintedBy.substr(0, 5) +
                        "..." +
                        this.props.ownedEverything.mintedBy.slice(
                            this.props.ownedEverything.mintedBy.length - 5
                        )}
                </p>
                <p>
                    <span className="font-weight-bold">Owned By</span> :{" "}
                    {this.props.ownedEverything.currentOwner.substr(0, 5) +
                        "..." +
                        this.props.ownedEverything.currentOwner.slice(
                            this.props.ownedEverything.currentOwner.length - 5
                        )}
                </p>
                <p>
                    <span className="font-weight-bold">Previous Owner</span> :{" "}
                    {this.props.ownedEverything.previousOwner.substr(0, 5) +
                        "..." +
                        this.props.ownedEverything.previousOwner.slice(
                            this.props.ownedEverything.previousOwner.length - 5
                        )}
                </p>
                <p>
                    <span className="font-weight-bold">Price</span> :{" "}
                    {window.web3.utils.fromWei(
                        this.props.ownedEverything.price.toString(),
                        "Ether"
                    )}{" "}
                    Ξ
                </p>
                <p>
                    <span className="font-weight-bold">No. of Transfers</span> :{" "}
                    {this.props.ownedEverything.numberOfTransfers.toNumber()}
                </p>
                <div>
                    {this.props.accountAddress === this.props.ownedEverything.currentOwner ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                this.callChangeTokenPriceFromApp(
                                    this.props.ownedEverything.tokenId.toNumber(),
                                    this.state.newCryptoBoyPrice
                                );
                            }}
                        >
                            <div className="form-group mt-4 ">
                                <label htmlFor="newCryptoBoyPrice">
                                    <span className="font-weight-bold">Change Token Price</span> :
                                </label>{" "}
                                <input
                                    required
                                    type="number"
                                    name="newCryptoBoyPrice"
                                    id="newCryptoBoyPrice"
                                    value={this.state.newCryptoBoyPrice}
                                    className="form-control w-50"
                                    placeholder="Enter new price"
                                    onChange={(e) =>
                                        this.setState({
                                            newCryptoBoyPrice: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <button
                                type="submit"
                                style={{fontSize: "0.8rem", letterSpacing: "0.14rem"}}
                                className="btn btn-outline-info mt-0 w-50"
                            >
                                change price
                            </button>
                        </form>
                    ) : null}
                </div>
                <div>
                    {this.props.accountAddress === this.props.ownedEverything.currentOwner ? (
                        this.props.ownedEverything.forSale ? (
                            <button
                                className="btn btn-outline-danger mt-4 w-50"
                                style={{fontSize: "0.8rem", letterSpacing: "0.14rem"}}
                                onClick={() =>
                                    this.props.toggleForSale(
                                        this.props.ownedEverything.tokenId.toNumber()
                                    )
                                }
                            >
                                Remove from sale
                            </button>
                        ) : (
                            <button
                                className="btn btn-outline-success mt-4 w-50"
                                style={{fontSize: "0.8rem", letterSpacing: "0.14rem"}}
                                onClick={() =>
                                    this.props.toggleForSale(
                                        this.props.ownedEverything.tokenId.toNumber()
                                    )
                                }
                            >
                                Keep for sale
                            </button>
                        )
                    ) : null}
                </div>
                <div>
                    {this.props.accountAddress !== this.props.ownedEverything.currentOwner ? (
                        this.props.ownedEverything.forSale ? (
                            <button
                                className="btn btn-outline-primary mt-3 w-50"
                                value={this.props.ownedEverything.price}
                                style={{fontSize: "0.8rem", letterSpacing: "0.14rem"}}
                                onClick={(e) =>
                                    this.props.buyOwnedEverything(
                                        this.props.ownedEverything.tokenId.toNumber(),
                                        e.target.value
                                    )
                                }
                            >
                                Buy For{" "}
                                {window.web3.utils.fromWei(
                                    this.props.ownedEverything.price.toString(),
                                    "Ether"
                                )}{" "}
                                Ξ
                            </button>
                        ) : (
                            <>
                                <button
                                    disabled
                                    style={{fontSize: "0.8rem", letterSpacing: "0.14rem"}}
                                    className="btn btn-outline-primary mt-3 w-50"
                                >
                                    Buy For{" "}
                                    {window.web3.utils.fromWei(
                                        this.props.ownedEverything.price.toString(),
                                        "Ether"
                                    )}{" "}
                                    Ξ
                                </button>
                                <p className="mt-2">Currently not for sale!</p>
                            </>
                        )
                    ) : null}
                </div>
            </div>
        );
    }
}

export default ColorNFTDetails;
