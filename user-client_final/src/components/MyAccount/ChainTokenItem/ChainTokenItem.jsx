import {reqOpenOrClose} from "../../../api/API";
import {Button, Card, Col, Form, Input, message} from "antd";
import {CARD_COLS} from "../../../constants/constants";
import ColorNFTImage from "../../ColorNFTImage/ColorNFTImage";
import FileNFT from "../../FileNFT/FileNFT";
import Loading from "../../Loading/Loading";
import React, {useEffect, useState} from "react";
import FileViewer from 'react-file-viewer';

const ChainTokenItem = ({item, accountAddress, toggleForSale, changeTokenPrice, products, insideLoading}) => {
	let previewContent
	let {
		tokenName,
		price,
		tokenId
	} = item;
	price = window.web3.utils.fromWei(parseInt(price._hex, 16).toString(), "Ether")
	tokenId = parseInt(item.tokenId._hex, 16)
	const [open_status, setOpen_status] = useState('')
	const [open_status_button_style, setOpen_status_button_style] = useState('')
	
	let openStatus, current_product
	if (products) {
		current_product = products.find(inItem => {
			return (inItem.product_id === item.metaData.productId)
		})
		if (current_product) {
			// console.log(current_product)
			openStatus = current_product.open_status
		}
	}
	
	//进行上架或者下架操作
	const handleUnderOrUp = () => {
		toggleForSale(
			tokenId,
		)
	}
	
	//设置预览
	const setPreview = (item, filename, ext, filetype, src) => {
		previewContent = (
			<FileViewer
				fileType={ext}
				filePath={src}
			/>
		)
		if (/^image\/\S+$/.test(filetype)) {
			previewContent = (<img src={src} alt={filename} className='file'/>)
		} else if (/^video\/\S+$/.test(filetype)) {
			previewContent = (<video src={src} loop preload className='file'/>)
		} else if (/^audio\/\S+$/.test(filetype)) {
			previewContent = (
				<audio preload className='file'>
					<source src={src}/>
					<embed src={src}/>
				</audio>
			)
		}
		return previewContent
	}
	
	// 显示或隐藏
	const handleOpenOrClose = async (e) => {
		// console.log(item.metaData.productId)
		let action = ''
		const object = e.target
		//禁用按钮
		object.setAttribute('disabled', true)
		object.offsetParent.setAttribute('disabled', true)
		if (open_status === '公开') {
			action = 'open'
		} else if (open_status === '不公开') {
			action = 'close'
		}
		const productId = item.metaData.productId
		//请求设为公开或不公开
		const result = await reqOpenOrClose(productId, action)
		if (result.status === 0) {
			message.success('修改可见状态成功~')
			if (action === 'open') {
				setOpen_status('不公开')
				setOpen_status_button_style(true)
			} else if (action === 'close') {
				setOpen_status('公开')
				setOpen_status_button_style(false)
			}
		} else {
			message.error('修改可见状态失败!')
		}
		//取消禁用按钮
		object.removeAttribute('disabled')
		object.offsetParent.removeAttribute('disabled')
	}
	
	// 点击被隐藏的按钮,进行修改价格表单提交
	const handleChangePriceClick = (e) => {
		// console.log(tokenId)
		const submit = document.getElementById(tokenId)
		submit.click()
	}
	
	// 调用父级传入的修改价格函数
	const callChangeTokenPriceFromApp = (tokenId, newPrice) => {
		changeTokenPrice(tokenId, newPrice);
	};
	
	//处理修改价格表单提交的数据
	const handlePriceChangeSubmit = (value) => {
		const price = value.price
		// console.log(item)
		// console.log(tokenId, price)
		callChangeTokenPriceFromApp(
			tokenId,
			price
		);
	}
	
	//设置出售状态及其样式
	const sale_status = (accountAddress === item.currentOwner) ?
		(item.forSale ? ('下架') : ('上架')) : null
	const sale_status_button_style = (accountAddress === item.currentOwner) ?
		(!!item.forSale) : null
	
	
	// 设置预览组件
	const filename = item.metaData.fileUrl
	const ext = filename.substring(filename.lastIndexOf('.') + 1);
	const filetype = item.metaData.fileType
	const src = item.metaData.tokenUrl
	previewContent = setPreview(item, filename, ext, filetype, src)
	
	useEffect(() => {
		setOpen_status((accountAddress === item.currentOwner) ?
			(openStatus ? ('不公开') : ('公开')) : null)
		setOpen_status_button_style((accountAddress === item.currentOwner) ?
			(!!openStatus) : null)
	}, []);
	
	return (
		<Col span={CARD_COLS}>
			<Card
				className='inside-card'
				hoverable
				bordered
				cover={!insideLoading ? (
					(item.metaData.metaData.type === 'color') ?
						(<ColorNFTImage
							colors={
								item.metaData
									? item.metaData.metaData.colors
									: ""
							}
						/>) : (
							<FileNFT
								tokenURL={
									item.metaData
										? item.metaData.metaData.file_url.file_tokenURl
										: ""
								}
								tokenId={tokenId}
								previewContent={previewContent}
							/>
						)
				) : (
					<Loading/>
				)}
				actions={[
					<div className='action-buttons'>
						<Button type="primary" ghost
						        onClick={(e) => {
							        handleChangePriceClick(e)
						        }}
						>
							修改价格
						</Button>
						{/*是否上架或下架*/}
						<Button type='primary' danger={sale_status_button_style}
						        onClick={() => handleUnderOrUp()}
						>
							{sale_status}
						</Button>
						{/*是否公开*/}
						<Button type='primary' danger={open_status_button_style}
						        onClick={(e) => handleOpenOrClose(e)}
						>
							{open_status}
						</Button>
					</div>,
				]}
			>
				<div style={{display: 'flex', justifyContent: 'space-between'}}>
					<div>
						<div className='top-attribute'>NFT名字</div>
						<div>{tokenName}</div>
					</div>
					<div className='right-content'>
						<div className='top-attribute'>价格</div>
						{price} Ξ
					</div>
				</div>
				<Form
					key={tokenId}
					onFinish={handlePriceChangeSubmit}
				>
					<Form.Item
						name="price"
						initialValue={price || ''}
						rules={[
							{required: true, message: '价格必须输入'},
							{
								validator(rule, value, callback) {
									// console.log(value,price)
									if (value === '') {
										return Promise.reject()
									} else if (value * 1 <= 0) {
										return Promise.reject('价格必须大于0')
									} else if (value === price) {
										return Promise.reject('新价格和原始价格相同')
									} else {
										return Promise.resolve()
									}
								}
							}
						]}
					>
						<Input type="number" placeholder="请输入新的价格"/>
					</Form.Item>
					
					<Form.Item style={{height: 0, width: 0}}>
						<Button type="primary" htmlType="submit" style={{height: 0, width: 0}}
						        id={tokenId}/>
					</Form.Item>
				</Form>
			</Card>
		</Col>
	)
}

export default ChainTokenItem