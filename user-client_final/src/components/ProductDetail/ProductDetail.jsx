import React, {Component} from "react";
import {
	Avatar,
	Button,
	Card,
	Col,
	Collapse,
	Comment,
	Divider,
	Form,
	Input,
	message,
	Row,
	Timeline,
	Tooltip
} from "antd";
import {
	EyeOutlined,
	HeartFilled,
	HeartOutlined,
	HistoryOutlined,
	LockOutlined,
	MailOutlined,
	SmileOutlined,
} from '@ant-design/icons';
import './PorductDetail.less'
import moment from 'moment';
import storageUtils from "../../utils/storageUtils";
import loading from "../../components/Loading/Loading";
import {
	reqAddComment,
	reqCategory,
	reqComments,
	reqProduct,
	reqProductLike,
	reqProductView,
	reqUserById
} from "../../api/API";
import FileViewer from "react-file-viewer";
import EnhancedComment from "./EnhancedComment";
import {Link} from "react-router-dom";

const {Panel} = Collapse;

const {TextArea} = Input;


const Editor = ({onChange, onSubmit, submitting, value}) => (
	<>
		<Form.Item>
			<TextArea rows={4} onChange={onChange} value={value}/>
		</Form.Item>
		<Form.Item>
			<Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
				评论
			</Button>
		</Form.Item>
	</>
);


moment.defineLocale('zh-cn', {
	relativeTime: {
		future: '%s内',
		past: '%s前',
		s: '几秒',
		m: '1 分钟',
		mm: '%d 分钟',
		h: '1 小时',
		hh: '%d 小时',
		d: '1 天',
		dd: '%d 天',
		M: '1 个月',
		MM: '%d 个月',
		y: '1 年',
		yy: '%d 年'
	},
})

class ProductDetail extends Component {
	
	state = {
		comments: [],
		submitting: false,
		commentContent: '',
		categoryName: '',
		userData: '',
		productLikeAction: null,
		productLike: 0,
		productView: 0,
		productData: {},
		startTime: +new Date(),
	};
	
	handleCommentSubmit = async () => {
		if (!this.state.commentContent) {
			return;
		}
		
		this.setState({
			submitting: true,
		});
		const userData = storageUtils.getUser()
		const timestamp = +new Date()
		const userId = userData.user_id
		const userName = userData.user_name
		const productId = this.state.currentProduct.metaData.productId
		const commentContent = this.state.commentContent
		const result = await reqAddComment(timestamp, userId, userName, productId, commentContent)
		if (result.status === 0) {
			message.success('评论成功')
			this.setState({
				submitting: false,
				commentContent: '',
			})
			await this.initComments()
		}
		
	};
	
	handleCommentChange = e => {
		this.setState({
			commentContent: e.target.value,
		});
	};
	
	async initChainProduct() {
		//从路由url获取tokenId
		const id = this.props.match.params.id
		//从store中获取products
		let products = storageUtils.getProducts()
		//获取具体的product
		this.state.currentProduct = products[id - 1]
		let currentProduct = products[id - 1]
		if (currentProduct) {
			this.state.price = window.web3.utils.fromWei(
				parseInt(currentProduct.price._hex, 16).toString(),
				"Ether"
			)
			this.state.productId = currentProduct.metaData.productId
			this.state.workName = currentProduct.tokenName
			this.state.description = currentProduct.metaData.description
			this.state.categoryId = currentProduct.metaData.categoryId
			this.state.file_url = currentProduct.metaData.metaData.file_url.file_tokenURl
			this.state._traceAddresses = currentProduct._traceAddresses.split(",")
			this.state._timestamp = currentProduct._timestamp.split(",")
			this.state.forSale = currentProduct.forSale
			const filename = this.state.currentProduct.metaData.fileUrl
			const ext = filename.substring(filename.lastIndexOf('.') + 1)
			const src = this.state.file_url
			const filetype = this.state.currentProduct.metaData.fileType
			if (/^image\/\S+$/.test(filetype)) {
				this.setState({
					previewContent: <img src={src} alt={filename} className='file'/>
				})
			} else if (/^video\/\S+$/.test(filetype)) {
				this.setState({
					previewContent: <video src={src} loop preload controls className='file'/>
				})
			} else if (/^audio\/\S+$/.test(filetype)) {
				this.setState({
					previewContent:
						<audio controls preload className='file'>
							<source src={src}/>
							<embed src={src}/>
						</audio>
				})
			} else {
				this.setState({
					previewContent:
						<FileViewer
							fileType={ext}
							filePath={src}
						/>
				})
			}
			await this.getCategory(currentProduct.metaData.categoryId)
		}
	}
	
	async initProduct() {
		const productId = this.state.currentProduct.metaData.productId
		const result = await reqProduct(productId)
		// console.log(result)
		if (result.status === 0) {
			this.setState({
				productData: result.data,
				productView: result.data.view_count,
				productLike: result.data.like_count,
			})
		}
	}
	
	async initComments() {
		const productId = this.state.currentProduct.metaData.productId
		const result = await reqComments(productId)
		// console.log(result)
		if (result.status === 0) {
			this.setState({
				comments: result.data,
			})
		}
	}
	
	getCategory = async (categoryId) => {
		const result = await reqCategory(categoryId)
		if (result.status === 0) {
			const categoryName = result.data.category_name
			this.setState({categoryName})
		}
	}
	
	/** * 格式化时间为：yyyy-MM-dd HH:mm:ss * @param date * @returns {string} */
	jsDateFormatter = (timestamp) => {
		const inputTime = parseInt(timestamp) * 1000
		const time = new Date(inputTime);
		const year = time.getFullYear();
		const month = time.getMonth() + 1;
		const day = time.getDate();
		const hour = time.getHours();
		const minute = time.getMinutes();
		const second = time.getSeconds();
		return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + ' ' + (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
	}
	
	// 渲染交易溯源过程
	renderTraceItems(timeItems, addressItems) {
		//将时间戳和地址数组进行组装,形成对象数组
		const dataList = [];
		for (let i = 0; i < timeItems.length; i++) {
			let tempObject = {time: timeItems[i], address: addressItems[i]}
			dataList.push(tempObject)
		}
		//批量渲染
		return dataList.map((item, index) => {
			if (index !== 0) {
				return (
					<Timeline.Item>
						<p>{this.jsDateFormatter(item.time)}{"时"}</p>
						<p>{"所属权转移至"}{item.address}</p>
					</Timeline.Item>
				)
			} else {
				return null
			}
		})
	}
	
	// 获取目标id的用户数据
	reqUserData = async (targetUserId) => {
		const result = await reqUserById(targetUserId)
		if (result.status === 0) {
			this.setState({userData: result.data})
		}
	}
	
	
	likesProduct = async () => {
		let result;
		console.log(this.state.productId)
		if (this.state.productLikeAction === null) {
			this.setState({productLike: this.state.productLike + 1, productLikeAction: 'liked'})
			result = await reqProductLike(this.state.productId, 'add')
		} else {
			this.setState({productLike: this.state.productLike - 1, productLikeAction: null})
			result = await reqProductLike(this.state.productId, 'reduce')
		}
		console.log(result)
	}
	
	increaseView = async () => {
		const result = await reqProductView(this.state.productId)
		console.log(result)
	}
	
	componentDidMount() {
		this.initChainProduct()
		this.initProduct()
		this.initComments()
		//获取当前拥有者的信息
		this.reqUserData(parseInt(this.state.currentProduct.currentOwnerId._hex, 16))
	}
	
	componentWillUnmount() {
		const endTime = +new Date()
		// 大概停留时间大于10秒,则浏览量+1
		if ((endTime - this.state.startTime) / 1000 >= 10) {
			this.increaseView()
		}
	}
	
	//todo:添加内部购买,自己的则为上下架
	render() {
		const {comments, submitting, commentContent, currentProduct} = this.state;
		return (
			currentProduct ?
				(<div className='product-detail'>
					<Row gutter={24}>
						<Col md={12}>
							<div className='product-content'>
								<div className='file-content'>
									{this.state.previewContent}
								</div>
								<div className='name-content'>
									<p className='name-title'>{this.state.workName}</p>
									<span className='category-name'>{this.state.categoryName}</span>
								</div>
								<Divider/>
								<div className='user-content'>
									<Link to={{
										pathname: `/space/${parseInt(currentProduct.currentOwnerId._hex, 16)}/allTokens`,
										state: {tabKey: 'allTokens'}
									}}>
										<Avatar size={64}
										        src={<img src="https://joeschmoe.io/api/v1/random" alt={'头像'}/>}/>
									</Link>
									<div className='user-des'>
										<Link to={{
											pathname: `/space/${parseInt(currentProduct.currentOwnerId._hex, 16)}/allTokens`,
											state: {tabKey: 'allTokens'}
										}}>
											<p style={{color: '#000'}}>{this.state.userData.user_name}</p>
										</Link>
										<Button type='primary'>关注</Button>
									</div>
									<div className='view-like'>
										<div className='right-content'>
											<div className='view'>
												<Tooltip title={`${this.state.productData.view_count}次查看`}>
													<span><EyeOutlined/> {this.state.productData.view_count}</span>
												</Tooltip>
											</div>
											<div className='like'>
												<Button onClick={() => this.likesProduct()}>
													<span>{this.state.productLikeAction === 'liked' ? <HeartFilled/> :
														<HeartOutlined/>} {this.state.productLike}</span>
												</Button>
											</div>
										</div>
									</div>
								</div>
								<div className='product-des'>
									<p>{this.state.description}</p>
								</div>
							</div>
						</Col>
						<Col md={12}>
							<Card>
								<div className='buy-container'>
									<h1 className='price-title'>{this.state.price} Ξ</h1>
									<div className='price-features'>
										<p>
											<LockOutlined/><span className='price-feature'>安全支付</span>
										</p>
										<p>
											<MailOutlined/><span className='price-feature'>卖家的支持</span>
										</p>
										<p>
											<HistoryOutlined/><span className='price-feature'>支持未来版本</span>
										</p>
									</div>
								</div>
							</Card>
							<div className='product-details'>
								<Collapse
									defaultActiveKey={['1']}
									expandIconPosition='right'
								>
									<Panel header="作品信息" key="1">
										<div className='product-container'>
											<p>
												<span className="font-weight-bold">数藏万物ID</span> :{" "}
												{parseInt(this.state.currentProduct.tokenId._hex, 16)}
											</p>
											<p>
												<span className="font-weight-bold">名字</span> :{" "}
												{this.state.currentProduct.tokenName}
											</p>
											<p>
												<span className="font-weight-bold">铸造者</span> :{" "}
												{this.state.currentProduct.mintedBy}
											</p>
											<p>
												<span className="font-weight-bold">拥有者</span> :{" "}
												{this.state.currentProduct.currentOwner}
											</p>
											<p>
												<span className="font-weight-bold">上一个拥有者</span> :{" "}
												{this.state.currentProduct.previousOwner}
											</p>
											<p>
												<span className="font-weight-bold">累计交易次数</span> :{" "}
												{parseInt(this.state.currentProduct.numberOfTransfers._hex, 16)}
											</p>
											<div className='data-href-list'>
												<a href={this.state.currentProduct.tokenURI} target="_blank"
												   rel="noopener noreferrer">
													<Button className='data-href-btn'>
														原始数据
													</Button>
												</a>
												&nbsp;&nbsp;
												<a href={this.state.file_url} target="_blank"
												   rel="noopener noreferrer">
													<Button className='data-href-btn'>
														原始文件
													</Button>
												</a>
											</div>
										</div>
									</Panel>
									<Panel header="作品描述" key="2">
										<p>{this.state.description ? this.state.description : '暂无作品描述'}</p>
									</Panel>
									<Panel header="交易历史" key="3">
										<div className='trace-container'>
											<Timeline>
												<Timeline.Item
													color="green">上链于{this.jsDateFormatter(this.state._timestamp[0])}</Timeline.Item>
												<Timeline.Item
													color="green">初始所属于{this.state._traceAddresses[0]}</Timeline.Item>
												{this.renderTraceItems(this.state._timestamp, this.state._traceAddresses)}
												{
													this.state.forSale ?
														(
															<Timeline.Item color="#00CCFF" dot={<SmileOutlined/>}>
																<p>当前处于上架状态</p>
															</Timeline.Item>
														) :
														(
															<Timeline.Item color="gray">
																<p>当前处于下架状态</p>
															</Timeline.Item>
														)
												}
											</Timeline>
										</div>
									</Panel>
								</Collapse>
							</div>
						</Col>
					</Row>
					{/*评论区分割线*/}
					<Divider/>
					
					<div className='comment-container'>
						<div className='comment-header'>
							<span className='comment-header-title'>
								<span className='comment-number'>{comments.length}</span>
								评论
							</span>
						</div>
						{comments.length > 0 && comments.map(item => {
							return (<EnhancedComment comment={item}/>)
						})
						}
						<Comment
							avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="头像"/>}
							content={
								<Editor
									onChange={this.handleCommentChange}
									onSubmit={this.handleCommentSubmit}
									submitting={submitting}
									value={commentContent}
								/>
							}
						/>
					</div>
				</div>) : (<loading/>)
		)
	}
}

export default ProductDetail;