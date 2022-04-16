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
            <div key={parseInt(this.props.ownedEverything.tokenId)} className="mt-4">
                <p>
                    <span className="font-weight-bold">Token Id</span> :{" "}
                    {parseInt(this.props.ownedEverything.tokenId._hex, 16)}
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
                    {
                        window.web3.utils.fromWei(
                            parseInt(this.props.ownedEverything.price._hex, 16).toString(),
                            "Ether"
                        )}{" "}
                    Ξ
                </p>
                <p>
                    <span className="font-weight-bold">No. of Transfers</span> :{" "}
                    {parseInt(this.props.ownedEverything.numberOfTransfers._hex, 16)}
                </p>
                <div>
                    {this.props.accountAddress === this.props.ownedEverything.currentOwner ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                this.callChangeTokenPriceFromApp(
                                    parseInt(this.props.ownedEverything.tokenId._hex, 16),
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
                                        parseInt(this.props.ownedEverything.tokenId._hex, 16)
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
                                        parseInt(this.props.ownedEverything.tokenId._hex, 16)
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
                                Buy For{" "}
                                {window.web3.utils.fromWei(
                                    parseInt(this.props.ownedEverything.price._hex, 16).toString(),
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
                                        parseInt(this.props.ownedEverything.price._hex, 16).toString(),
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
