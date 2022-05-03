import React, {Component} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Layout, message} from 'antd';
import Web3 from "web3";

import "./App.css";
import OwnedEverythings from "../abis/OwnedEverythings.json";
import "antd/dist/antd.css";

import loadable from "../utils/Loadable";
import storageUtils from "../utils/storageUtils";

const ColorMint = loadable(() => import('./ColorMint/ColorMint'));
const MarketPlace = loadable(() => import('./MarketPlace/MarketPlace'));
const Home = loadable(() => import('./Home/Home'));
const Navbar = loadable(() => import('./Navbar/Navbar'));
const Queries = loadable(() => import('./Queries/Queries'));
const UploadMint = loadable(() => import('./UploadMint/UploadMint'));
const MyAccount = loadable(() => import('./MyAccount/MyAccount'));
const Mint = loadable(() => import('./Mint/Mint'));
const Museum = loadable(() => import('./Museum/Museum'));
const InsideLogin = loadable(() => import('./InsideLogin/InsideLogin'));
const ProductDetail = loadable(() => import('./ProductDetail/ProductDetail'));


const {Footer, Content} = Layout;
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
			OwnedEverythingsContract: null,
			OwnedEverythingsCount: 0,
			OwnedEverythings: [],
			loading: true,
			metamaskConnected: false,
			contractDetected: false,
			totalTokensMinted: 0,
			totalTokensOwnedByAccount: 0,
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
				const networkData = OwnedEverythings.networks[networkId];
				if (networkData) {
					// console.log(networkData)
					this.setState({loading: true});
					const OwnedEverythingsContract = web3.eth.Contract(
						OwnedEverythings.abi,
						networkData.address
					);
					this.setState({OwnedEverythingsContract});
					this.setState({contractDetected: true});
					//调用ownedeverythingCounter合约ownedeverythingCounter方法,获取已提交的OwnedEverythings总数
					const OwnedEverythingsCount = await OwnedEverythingsContract.methods
					.ownedeverythingCounter()
					.call();
					this.setState({OwnedEverythingsCount});
					//获取所有OwnedEverythings
					for (var i = 1; i <= OwnedEverythingsCount; i++) {
						const ownedEverything = await OwnedEverythingsContract.methods
						.allOwnedEverythings(i)
						.call();
						// console.log(ownedEverything)
						this.setState({
							OwnedEverythings: [...this.state.OwnedEverythings, ownedEverything],
						});
					}
					//获取已经铸造的OwnedEverythings总数
					let totalTokensMinted = await OwnedEverythingsContract.methods
					.getNumberOfTokensMinted()
					.call();
					if (totalTokensMinted !== null) {
						totalTokensMinted = totalTokensMinted.toNumber();
					} else {
						totalTokensMinted = 0
					}
					this.setState({totalTokensMinted});
					//获取所拥有的OwnedEverythings总数
					let totalTokensOwnedByAccount = await OwnedEverythingsContract.methods
					.getTotalNumberOfTokensOwnedByAnAddress(this.state.accountAddress)
					.call();
					if (totalTokensOwnedByAccount !== null) {
						totalTokensOwnedByAccount = totalTokensOwnedByAccount.toNumber();
					} else {
						totalTokensOwnedByAccount = 0
					}
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
		const data = this.state.OwnedEverythings
		if (data.length !== 0) {
			let res = await Promise.all(data.map(async (ownedEverything) => {
				const result = await fetch(ownedEverything.tokenURI);
				const metaData = await result.json();
				if (ownedEverything.tokenId.toNumber() === Number(metaData.tokenId)) {
					ownedEverything = {
						...ownedEverything,
						metaData,
					}
				}
				return ownedEverything
			}));
			storageUtils.saveProducts(res)
			storageUtils.saveFinish(true)
		}
	}
	
	
	//连接到Matemask
	connectToMetamask = async () => {
		//请求用户授权应用访问MetaMask中的用户账号信息
		await window.ethereum.enable();
		this.setState({metamaskConnected: true});
		window.location.reload();
	};
	
	//进行铸造
	mintMyColorNFT = async (colors, workName, categoryId, tokenPrice, introduction) => {
		this.setState({loading: true});
		const colorsArray = Object.values(colors);
		let colorsUsed = [];
		//检查颜色是否被使用过
		for (let i = 0; i < colorsArray.length; i++) {
			if (colorsArray[i] !== "") {
				let colorIsUsed = await this.state.OwnedEverythingsContract.methods
				.colorExists(colorsArray[i])
				.call();
				if (colorIsUsed) {
					colorsUsed = [...colorsUsed, colorsArray[i]];
				} else {
				
				}
			}
		}
		//检验合格之后进行铸造
		if (colorsUsed.length === 0) {
			
			//在原有的tokenid上加一
			let previousTokenId;
			previousTokenId = await this.state.OwnedEverythingsContract.methods
			.ownedeverythingCounter()
			.call();
			previousTokenId = previousTokenId.toNumber();
			const tokenId = previousTokenId + 1;
			
			const tokenObject = {
				tokenName: "数藏万物",
				tokenSymbol: "OW_EThing",
				tokenId: `${tokenId}`,
				workName: workName,
				categoryId: categoryId,
				introduction: introduction,
				metaData: {
					type: "color_file",
				},
			};
			try {
				const cid = await ipfs.add(JSON.stringify(tokenObject));
				let tokenURI = `http://127.0.0.1:8080/ipfs/${cid.path}`;
				const price = window.web3.utils.toWei(tokenPrice.toString(), "Ether");
				// console.log(workName, tokenURI, price, colorsArray)
				
				if (this.state.accountAddress) {
					this.state.OwnedEverythingsContract.methods
					.mintownedeverything(workName, tokenURI, price, colorsArray, 'color')
					.send({from: this.state.accountAddress})
					.on("confirmation", () => {
						localStorage.setItem(this.state.accountAddress, new Date().getTime());
						this.setState({loading: false});
						window.location.reload();
					});
				}
				
			} catch (e) {
				console.error(e);
				message.error("铸造失败,请稍后重试")
			}
		} else {
			if (colorsUsed.length !== 0) {
				this.setState({colorIsUsed: true});
				this.setState({colorsUsed});
				this.setState({loading: false});
			}
		}
	};
	
	
	//文件铸造
	mintMyFileNFT = async (item, file_tokenURl) => {
		const {
			category_id,
			delete_status,
			description,
			examine_status,
			file_type,
			file_url,
			owner_id,
			pass_status,
			price,
			product_id,
			product_name,
			usable_chances
		} = item
		this.setState({loading: true});
		//检验合格之后进行铸造
		if (file_tokenURl) {
			//在原有的tokenid上加一
			let previousTokenId;
			previousTokenId = await this.state.OwnedEverythingsContract.methods
			.ownedeverythingCounter()
			.call();
			previousTokenId = previousTokenId.toNumber();
			const tokenId = previousTokenId + 1;
			const tokenObject = {
				tokenName: "数藏万物",
				tokenSymbol: "OW_EThing",
				tokenId: `${tokenId}`,
				workName: product_name,
				productId: product_id,
				categoryId: category_id,
				ownerId: owner_id,
				price,
				description,
				fileType: file_type,
				fileUrl: file_url,
				deleteStatus: delete_status,
				examineStatus: examine_status,
				passStatus: pass_status,
				usableChances: usable_chances,
				introduction: item.introduction,
				metaData: {
					type: "upload_file",
					file_url: {
						file_tokenURl,
					},
				},
			};
			try {
				const cid = await ipfs.add(JSON.stringify(tokenObject));
				let tokenURI = `http://127.0.0.1:8080/ipfs/${cid.path}`;
				const stand_price = window.web3.utils.toWei(price.toString(), "Ether");
				
				if (this.state.accountAddress) {
					await new Promise((resolve, reject) => {
						this.state.OwnedEverythingsContract.methods
						.mintownedeverything(product_name, tokenURI, stand_price, [], '',owner_id)
						.send({from: this.state.accountAddress})
						.on("confirmation", () => {
							localStorage.setItem(this.state.accountAddress, new Date().getTime());
							this.setState({loading: false});
							resolve(0)
						})
					})
					return 0
				}
			} catch (e) {
				console.error(e);
				message.error("铸造失败,请稍后重试")
				this.setState({loading: false});
				return -1
			}
		}
		return -1
	}
	
	
	//上架和下架
	toggleForSale = (tokenId) => {
		this.setState({loading: true});
		this.state.OwnedEverythingsContract.methods
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
		this.state.OwnedEverythingsContract.methods
		.changeTokenPrice(tokenId, newTokenPrice)
		.send({from: this.state.accountAddress})
		.on("confirmation", () => {
			this.setState({loading: false});
			window.location.reload();
		});
	};
	
	//购买
	buyOwnedEverything = (tokenId, price) => {
		const user_data=storageUtils.getUser()
		this.setState({loading: true});
		this.state.OwnedEverythingsContract.methods
		.buyToken(tokenId,user_data.user_id)
		.send({from: this.state.accountAddress, value: price})
		.on("confirmation", () => {
			this.setState({loading: false});
			window.location.reload();
		});
	};
	
	//删除底部
	delete_footer = () => {
		// console.log('delete',this.state.footerVisible)
		this.setState({
			footerVisible: 'none',
		})
	}
	
	//恢复底部
	revive_footer = () => {
		// console.log('revive',this.state.footerVisible)
		this.setState({
			footerVisible: '',
		})
	}
	
	componentWillMount = async () => {
		storageUtils.removeFinish()
		await this.loadWeb3();
		await this.loadBlockchainData();
		await this.setMetaData();
		// 启动循环定时器,每隔一秒检查登陆状态
		this.intervalLoginId = setInterval(() => {
			this.setState({
				isAuthenticated: !!storageUtils.getToken()
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
			<>
				<Router basename="/">
					{/*导航菜单*/}
					<Navbar/>
					<Content style={{padding: '0 50px'}}>
						<div className="site-layout-content">
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
											/>) : (<InsideLogin
											delete_footer={this.delete_footer}
											revive_footer={this.revive_footer}
										/>)
									)}
								/>
								<Route
									path="/color_mint"
									render={() => (
										this.state.isAuthenticated ? (
											<ColorMint
												mintMyColorNFT={this.mintMyColorNFT}
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
											totalTokensMinted={this.state.totalTokensMinted}
											changeTokenPrice={this.changeTokenPrice}
											toggleForSale={this.toggleForSale}
											buyOwnedEverything={this.buyOwnedEverything}
										/>
									)}
								/>
								<Route
									path="/queries"
									render={() => (
										<Queries OwnedEverythingsContract={this.state.OwnedEverythingsContract}/>
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
									path="/space/:id"
									render={() => (
										this.state.isAuthenticated ? (
											<MyAccount
												toggleForSale={this.toggleForSale}
												changeTokenPrice={this.changeTokenPrice}
												mintMyFileNFT={this.mintMyFileNFT}
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
								<Route path="/ownedEverything/detail/:id" component={ProductDetail}/>
							</Switch>
						</div>
					</Content>
					<Footer style={{textAlign: 'center', display: this.state.footerVisible}}>
						数藏万物 ©2022
					</Footer>
				</Router>
			</>
		);
	}
}

export default App;
