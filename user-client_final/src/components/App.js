import React, {Component} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Layout, message} from 'antd';
import Web3 from "web3";

import "./App.css";
import CryptoBoys from "../abis/CryptoBoys.json";
import "antd/dist/antd.css";

import loadable from "../utils/Loadable";

const ColorMint = loadable(() => import('./ColorMint/ColorMint'));
const MarketPlace = loadable(() => import('./MarketPlace/MarketPlace'));
const Home = loadable(() => import('./Home/Home'));
const Navbar = loadable(() => import('./Navbar/Navbar'));
const MyTokens = loadable(() => import('./MyTokens/MyTokens'));
const Queries = loadable(() => import('./Queries/Queries'));
const UploadMint = loadable(() => import('./UploadMint/UploadMint'));
const MyAccount = loadable(() => import('./MyAccount/MyAccount'));
const Mint = loadable(() => import('./Mint/Mint'));
const Museum = loadable(() => import('./Museum/Museum'));
const InsideLogin = loadable(() => import('./InsideLogin/InsideLogin'));


const {Footer} = Layout;
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: "http",
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountAddress: "",
            accountBalance: "",
            cryptoBoysContract: null,
            cryptoBoysCount: 0,
            cryptoBoys: [],
            loading: true,
            metamaskConnected: false,
            contractDetected: false,
            totalTokensMinted: 0,
            totalTokensOwnedByAccount: 0,
            nameIsUsed: false,
            colorIsUsed: false,
            colorsUsed: [],
            lastMintTime: null,
            footerVisible: '',
            isAuthenticated: false,
        };
    }


    //检测与连接web3浏览器用户
    loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            message.error(
                "检测到非以太坊浏览器。你应该考虑使用MetaMask!"
            );
        }
    };

    //加载区块链上的数据
    loadBlockchainData = async () => {
        if (window.web3) {
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts();
            //检测以太坊钱包账户
            if (accounts.length === 0) {
                this.setState({metamaskConnected: false});
            } else {
                this.setState({metamaskConnected: true});
                this.setState({loading: true});
                this.setState({accountAddress: accounts[0]});
                let accountBalance = await web3.eth.getBalance(accounts[0]);
                accountBalance = web3.utils.fromWei(accountBalance, "Ether");
                this.setState({accountBalance});
                this.setState({loading: false});
                const networkId = await web3.eth.net.getId();
                const networkData = CryptoBoys.networks[networkId];
                if (networkData) {
                    this.setState({loading: true});
                    const cryptoBoysContract = web3.eth.Contract(
                        CryptoBoys.abi,
                        networkData.address
                    );
                    this.setState({cryptoBoysContract});
                    this.setState({contractDetected: true});
                    //调用cryptoBoyCounter合约cryptoBoyCounter方法,获取已提交的cryptoBoys总数
                    const cryptoBoysCount = await cryptoBoysContract.methods
                        .cryptoBoyCounter()
                        .call();
                    this.setState({cryptoBoysCount});
                    //获取所有cryptoBoys
                    for (var i = 1; i <= cryptoBoysCount; i++) {
                        const cryptoBoy = await cryptoBoysContract.methods
                            .allCryptoBoys(i)
                            .call();
                        this.setState({
                            cryptoBoys: [...this.state.cryptoBoys, cryptoBoy],
                        });
                    }
                    //获取已经铸造的cryptoBoys总数
                    let totalTokensMinted = await cryptoBoysContract.methods
                        .getNumberOfTokensMinted()
                        .call();
                    // fixme:可能存在bug,totalTokensMinted值错误
                    totalTokensMinted = totalTokensMinted.toNumber();
                    this.setState({totalTokensMinted});
                    //获取所拥有的cryptoBoys总数
                    let totalTokensOwnedByAccount = await cryptoBoysContract.methods
                        .getTotalNumberOfTokensOwnedByAnAddress(this.state.accountAddress)
                        .call();
                    totalTokensOwnedByAccount = totalTokensOwnedByAccount.toNumber();
                    this.setState({totalTokensOwnedByAccount});
                    this.setState({loading: false});
                } else {
                    this.setState({contractDetected: false});
                }
            }
        }
    };

    //获取在ifps上存放的源数据,并且添加到state中
    setMetaData = async () => {
        if (this.state.cryptoBoys.length !== 0) {
            this.state.cryptoBoys.map(async (cryptoboy) => {
                const result = await fetch(cryptoboy.tokenURI);
                const metaData = await result.json();
                this.setState({
                    cryptoBoys: this.state.cryptoBoys.map((cryptoboy) =>
                        cryptoboy.tokenId.toNumber() === Number(metaData.tokenId)
                            ? {
                                ...cryptoboy,
                                metaData,
                            }
                            : cryptoboy
                    ),
                });
            });
        }

    };

    //设置是否显示Mint My Crypto Boy(可以铸造)
    setMintBtnTimer = () => {
        const mintBtn = document.getElementById("mintBtn");
        if (mintBtn !== undefined && mintBtn !== null) {
            this.setState({
                lastMintTime: localStorage.getItem(this.state.accountAddress),
            });
            this.state.lastMintTime === undefined || this.state.lastMintTime === null
                ? (mintBtn.innerHTML = "Mint My Crypto Boy")
                : this.checkIfCanMint(parseInt(this.state.lastMintTime));
        }
    };

    //检查是否可以进行铸造和倒计时显示
    checkIfCanMint = (lastMintTime) => {
        const mintBtn = document.getElementById("mintBtn");
        const timeGap = 300000; //5min in milliseconds
        const countDownTime = lastMintTime + timeGap;//倒计时结束时间
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = countDownTime - now;
            if (diff < 0) {
                mintBtn.removeAttribute("disabled");
                mintBtn.innerHTML = "Mint My Crypto Boy";
                localStorage.removeItem(this.state.accountAddress);
                clearInterval(interval);
            } else {
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                mintBtn.setAttribute("disabled", true);
                mintBtn.innerHTML = `Next mint in ${minutes}m ${seconds}s`;
            }
        }, 1000);
    };

    //连接到Matemask
    connectToMetamask = async () => {
        //请求用户授权应用访问MetaMask中的用户账号信息
        await window.ethereum.enable();
        this.setState({metamaskConnected: true});
        window.location.reload();
    };

    //进行铸造
    mintMyNFT = async (colors, name, tokenPrice) => {
        this.setState({loading: true});
        const colorsArray = Object.values(colors);
        let colorsUsed = [];
        //检查颜色是否被使用过
        for (let i = 0; i < colorsArray.length; i++) {
            if (colorsArray[i] !== "") {
                let colorIsUsed = await this.state.cryptoBoysContract.methods
                    .colorExists(colorsArray[i])
                    .call();
                if (colorIsUsed) {
                    colorsUsed = [...colorsUsed, colorsArray[i]];
                } else {

                }
            }
        }
        //检查所铸造的作品名称是否重复
        const nameIsUsed = await this.state.cryptoBoysContract.methods
            .tokenNameExists(name)
            .call();
        //检验合格之后进行铸造
        if (colorsUsed.length === 0 && !nameIsUsed) {
            const {
                cardBorderColor,
                cardBackgroundColor,
                headBorderColor,
                headBackgroundColor,
                leftEyeBorderColor,
                rightEyeBorderColor,
                leftEyeBackgroundColor,
                rightEyeBackgroundColor,
                leftPupilBackgroundColor,
                rightPupilBackgroundColor,
                mouthColor,
                neckBackgroundColor,
                neckBorderColor,
                bodyBackgroundColor,
                bodyBorderColor,
            } = colors;

            //在原有的tokenid上加一
            let previousTokenId;
            previousTokenId = await this.state.cryptoBoysContract.methods
                .cryptoBoyCounter()
                .call();
            previousTokenId = previousTokenId.toNumber();
            const tokenId = previousTokenId + 1;

            const tokenObject = {
                tokenName: "Crypto Boy",
                tokenSymbol: "CB",
                tokenId: `${tokenId}`,
                name: name,
                metaData: {
                    type: "color",
                    colors: {
                        cardBorderColor,
                        cardBackgroundColor,
                        headBorderColor,
                        headBackgroundColor,
                        leftEyeBorderColor,
                        rightEyeBorderColor,
                        leftEyeBackgroundColor,
                        rightEyeBackgroundColor,
                        leftPupilBackgroundColor,
                        rightPupilBackgroundColor,
                        mouthColor,
                        neckBackgroundColor,
                        neckBorderColor,
                        bodyBackgroundColor,
                        bodyBorderColor,
                    },
                },
            };
            const cid = await ipfs.add(JSON.stringify(tokenObject));
            let tokenURI = `http://127.0.0.1:8080/ipfs/${cid.path}`;
            const price = window.web3.utils.toWei(tokenPrice.toString(), "Ether");
            this.state.cryptoBoysContract.methods
                .mintCryptoBoy(name, tokenURI, price, colorsArray)
                .send({from: this.state.accountAddress})
                .on("confirmation", () => {
                    localStorage.setItem(this.state.accountAddress, new Date().getTime());
                    this.setState({loading: false});
                    window.location.reload();
                });
        } else {
            if (nameIsUsed) {
                this.setState({nameIsUsed: true});
                this.setState({loading: false});
            } else if (colorsUsed.length !== 0) {
                this.setState({colorIsUsed: true});
                this.setState({colorsUsed});
                this.setState({loading: false});
            }
        }
    };

    //
    toggleForSale = (tokenId) => {
        this.setState({loading: true});
        this.state.cryptoBoysContract.methods
            .toggleForSale(tokenId)
            .send({from: this.state.accountAddress})
            .on("confirmation", () => {
                this.setState({loading: false});
                window.location.reload();
            });
    };

    //修改价格
    changeTokenPrice = (tokenId, newPrice) => {
        this.setState({loading: true});
        const newTokenPrice = window.web3.utils.toWei(newPrice, "Ether");
        this.state.cryptoBoysContract.methods
            .changeTokenPrice(tokenId, newTokenPrice)
            .send({from: this.state.accountAddress})
            .on("confirmation", () => {
                this.setState({loading: false});
                window.location.reload();
            });
    };

    //购买
    buyCryptoBoy = (tokenId, price) => {
        this.setState({loading: true});
        this.state.cryptoBoysContract.methods
            .buyToken(tokenId)
            .send({from: this.state.accountAddress, value: price})
            .on("confirmation", () => {
                this.setState({loading: false});
                window.location.reload();
            });
    };

    delete_footer = () => {
        // console.log('delete',this.state.footerVisible)
        this.setState({
            footerVisible: 'none',
        })
    }

    revive_footer = () => {
        // console.log('revive',this.state.footerVisible)
        this.setState({
            footerVisible: '',
        })
    }

    componentWillMount = async () => {
        await this.loadWeb3();
        await this.loadBlockchainData();
        await this.setMetaData();
        await this.setMintBtnTimer();
        // 启动循环定时器,每隔一秒检查登陆状态
        this.intervalLoginId = setInterval(() => {
            this.setState({
                isAuthenticated: localStorage.getItem("token") ? true : false
            })
        }, 1000);
    };

    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalLoginId)
    }


    //渲染网页
    render() {
        return (
            <div>
                <>
                    <Router basename="/">
                        {/*导航菜单*/}
                        <Navbar/>
                        {/*路由配置*/}
                        <Switch>
                            <Route
                                exact path="/"
                                render={() => (
                                    <Home/>
                                )}
                            />
                            <Route
                                path="/mint"
                                render={() => (
                                    this.state.isAuthenticated ? (
                                        <Mint
                                            connectToMetamask={this.connectToMetamask}
                                            metamaskConnected={this.state.metamaskConnected}
                                            contractDetected={this.state.contractDetected}
                                            loading={this.state.loading}
                                        />
                                    ) : <InsideLogin
                                        delete_footer={this.delete_footer}
                                        revive_footer={this.revive_footer}
                                    />
                                )}
                            />
                            <Route
                                path="/color_mint"
                                render={() => (
                                    this.state.isAuthenticated ? (
                                        <ColorMint
                                            mintMyNFT={this.mintMyNFT}
                                            nameIsUsed={this.state.nameIsUsed}
                                            colorIsUsed={this.state.colorIsUsed}
                                            colorsUsed={this.state.colorsUsed}
                                            setMintBtnTimer={this.setMintBtnTimer}
                                        />
                                    ) : <InsideLogin
                                        delete_footer={this.delete_footer}
                                        revive_footer={this.revive_footer}
                                    />
                                )}
                            />
                            <Route
                                path="/upload_mint"
                                render={() => (
                                    this.state.isAuthenticated ? (
                                        <UploadMint
                                        />
                                    ) : <InsideLogin
                                        delete_footer={this.delete_footer}
                                        revive_footer={this.revive_footer}
                                    />
                                )}
                            />
                            <Route
                                path="/marketplace"
                                render={() => (
                                    <MarketPlace
                                        accountAddress={this.state.accountAddress}
                                        cryptoBoys={this.state.cryptoBoys}
                                        totalTokensMinted={this.state.totalTokensMinted}
                                        changeTokenPrice={this.changeTokenPrice}
                                        toggleForSale={this.toggleForSale}
                                        buyCryptoBoy={this.buyCryptoBoy}
                                    />
                                )}
                            />
                            <Route
                                path="/my-tokens"
                                render={() => (
                                    this.state.isAuthenticated ? (
                                        <MyTokens
                                            accountAddress={this.state.accountAddress}
                                            cryptoBoys={this.state.cryptoBoys}
                                            totalTokensOwnedByAccount={
                                                this.state.totalTokensOwnedByAccount
                                            }
                                        />
                                    ) : <InsideLogin
                                        delete_footer={this.delete_footer}
                                        revive_footer={this.revive_footer}
                                    />
                                )}
                            />
                            <Route
                                path="/queries"
                                render={() => (
                                    <Queries cryptoBoysContract={this.state.cryptoBoysContract}/>
                                )}
                            />
                            <Route
                                path="/museum"
                                render={() => (
                                    <Museum
                                        delete_footer={this.delete_footer}
                                        revive_footer={this.revive_footer}
                                    />
                                )}
                            />
                            <Route
                                path="/my"
                                render={() => (
                                    this.state.isAuthenticated ? (
                                        <MyAccount
                                            connectToMetamask={this.connectToMetamask}
                                            metamaskConnected={this.state.metamaskConnected}
                                            contractDetected={this.state.contractDetected}
                                            loading={this.state.loading}
                                            accountAddress={this.state.accountAddress}
                                            accountBalance={this.state.accountBalance}
                                        />
                                    ) : <InsideLogin
                                        delete_footer={this.delete_footer}
                                        revive_footer={this.revive_footer}
                                    />
                                )}
                            />
                        </Switch>
                        <Footer style={{textAlign: 'center', display: this.state.footerVisible}}>
                            NFT marketplace ©2021
                        </Footer>
                    </Router>
                </>
            </div>
        );
    }
}

export default App;
