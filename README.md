#  React-NFT-market

<i>NFT marketplace DApp,利用ERC721实现NFT铸造</i>
###特点
- Mint自定义ERC721实现了NFT
- 在市场上出售NFT
- 设置所需的令牌价格
- 在保留代币待售和不出售之间切换
- 跟踪所有的代币拥有的账户创建和购买NFT
- 查询令牌所有者和令牌元数据的区块链
- 用户只能每5分钟造币一次
###技术栈
- [Solidity](https://docs.solidylang.org/) 面向对象、高级语言，用于实现智能合同。
- [Bootstrap 4](https://getbootstrap.com/) CSS框架，可更快、更轻松地进行web开发
- [React.js](https://reactjs.org/) 用于构建用户界面的JavaScript库
- [Ant Design](https://ant.design/index-cn) 基于 Ant Design 设计体系的 React UI 组件库,主要用于研发企业级中后台产品
- [web3.js](https://web3js.readthedocs.io/) 允许用户使用HTTP、IPC或WebSocket与本地或远程以太坊节点交互
- [Truffle](https://www.truflesuite.com/trufflee) 使用以太坊虚拟机（EVM）为区块链开发环境、测试框架和资产管道
- [Ganache](https://www.truflesuite.com/ganache) 用于Ethereum开发的个人区块链，用于部署合同、开发DAPP和运行测试
- [Flask](https://palletsprojects.com/p/flask/) 一个微型的 Python 开发的 Web 框架，基于Werkzeug WSGI工具箱和Jinja2 模板引擎
###与部署的DApp交互
####NFT市场DApp需要 [Metamask](https://metamask.io/) 要与之交互的浏览器钱包扩展。
####将metamask浏览器钱包连接到Kovan测试网络。
####从 [Kovan水龙头](https://gitter.im/kovan-testnet/faucet) 请求并获取metamask帐户的测试以太  做交易。
####NFT市场智能合约部署到 [Kovan TestNet](https://kovan.etherscan.io/address/)
####访问 [NFT市场](https://github.com/qihang1217/React-NFT-market.git) 的NFT市场DApp开始铸造你的NFT
###本地运行DApp
####安装truffle
```
npm i -g truffle
```
##推荐使用 [ganache GUI版](https://trufflesuite.com/ganache/) (可视化,但会慢些)
####安装ganache-cli
```
npm i ganache-cli
```
####运行ganache-cli
```
ganache-cli --port 7545 --quiet
```
####打开新的终端窗口并克隆此存储库
```
git clone https://github.com/qihang1217/React-NFT-market.git
```
####安装依赖项
```
cd nft-marketplace
npm install
```
####编写智能合同
```
truffle compile
```
####将智能合同部署到ganache
```
truffle migrate
```
####测试智能合同
```
truffle test
```
####启动DApp
```
npm start
```
####打开metamask浏览器钱包，然后将网络连接到本地主机7545
####将帐户从ganache cli导入metamask浏览器钱包，以便在DApp上进行交易