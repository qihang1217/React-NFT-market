import {reqConfirmMinted, reqDelete, reqProductMint, reqResubmit} from "../../../api/API";
import {Button, Card, Col, message} from "antd";
import ApiUtil from "../../../utils/ApiUtil";
import {CARD_COLS} from "../../../constants/constants";
import React, {useEffect, useState} from "react";
import FileViewer from 'react-file-viewer';

const UnderChainTokenItem = ({item, mintMyFileNFT, reqProductData}) => {
	const [examine_status_name, setExamine_status_name] = useState('')
	const [examine_status_action, setExamine_status_action] = useState('')
	const [examine_disabled_status, setExamine_disabled_status] = useState(false)
	const [delete_disabled_status, setDelete_disabled_status] = useState(false)
	const [examine_status_color, setExamine_status_color] = useState('#000')
	
	let previewContent
	
	const setControlsPreview = (item, filename, ext, filetype, src) => {
		let previewContent = (
			<FileViewer
				fileType={ext}
				filePath={src}
			/>
		)
		if (/^image\/\S+$/.test(filetype)) {
			previewContent = (<img src={src} alt={filename} className='file'/>)
		} else if (/^video\/\S+$/.test(filetype)) {
			previewContent = (<video src={src} loop preload controls className='file'/>)
		} else if (/^audio\/\S+$/.test(filetype)) {
			previewContent = (
				<audio controls preload className='file'>
					<source src={src}/>
					<embed src={src}/>
				</audio>
			)
		}
		return previewContent
	}
	
	const filename = item.file_url
	const ext = filename.substring(filename.lastIndexOf('.') + 1);
	const filetype = item.file_type
	const src = ApiUtil.API_FILE_URL + filename
	previewContent = setControlsPreview(item, filename, ext, filetype, src)
	
	//处理铸造或者重新提交
	const handleCastOrRetry = async (e) => {
		const object = e.target
		// const product=item
		if (examine_status_action === '开始铸造') {
			const productId = item.product_id;
			object.setAttribute('disabled', true)
			object.offsetParent.setAttribute('disabled', true)
			setExamine_status_action('铸造中')
			//向服务器申请铸造(请求将文件上传到ipfs)
			const result = await reqProductMint(productId)
			if (result.status === 0) {
				//上传成功
				const tokenURI = result.tokenURI
				//铸造nft
				const {status, tokenId} = await mintMyFileNFT(item, tokenURI);
				console.log(tokenId)
				if (status === 0) {
					//	表示铸造成功
					
					//告知服务器铸造成功
					const status = await reqConfirmMinted(productId, tokenId, tokenURI)
					if (status.status === 0) {
						message.success('铸造成功且更新铸造状态成功~')
						reqProductData()
						// console.log('铸造成功且更新铸造状态成功')
					} else {
						// console.log('铸造成功但更新铸造状态失败')
						message.error('铸造成功但更新铸造状态失败~')
					}
				} else {
					//铸造失败
					message.error('铸造失败,请稍后重试~')
					//解除禁用
					object.removeAttribute('disabled')
					object.offsetParent.removeAttribute('disabled')
					setExamine_status_action('重新铸造')
				}
			} else {
				//上传失败
				message.error('铸造失败,请稍后重试~')
				//解除禁用
				object.removeAttribute('disabled')
				object.offsetParent.removeAttribute('disabled')
				setExamine_status_action('重新铸造')
			}
		} else if (examine_status_action === '重新提交') {
			//申请重新提交
			const result = await reqResubmit(item.product_id)
			//禁用按钮,防止再次请求
			object.setAttribute('disabled', true)
			object.offsetParent.setAttribute('disabled', true)
			if (result.status === 0) {
				//重新提交成功后,重新获取最新数据
				message.success('重新提交审核成功~')
				reqProductData()
			} else {
				message.error('重新提交审核失败,请稍后重试~')
				//重新提交失败后,解除提交按钮并修改其中内容为重新提交
				object.removeAttribute('disabled')
				object.offsetParent.removeAttribute('disabled')
				setExamine_status_action('重新提交')
			}
		}
	}
	
	//处理删除
	const handleDelete = async (e) => {
		const object = e.target
		// console.log(e.target)
		object.setAttribute('disabled', true)
		object.offsetParent.setAttribute('disabled', true)
		//请求删除
		const result = await reqDelete(item.product_id)
		if (result.status === 0) {
			//提交成功后,禁用提交按钮
			message.success('删除成功~')
			reqProductData()
		}
	}
	
	
	useEffect(() => {
		if (item.pass_status === true) {
			//审核通过
			if (item.examine_status === true) {
				//审核了并且通过审核
				setExamine_status_name('审核通过')
				setExamine_status_action('开始铸造')
				setExamine_status_color('#4bbf73')
			}
		} else if (item.pass_status === false) {
			//不通过
			if (item.examine_status === true) {
				//已经审核且未通过
				setExamine_status_name('审核未通过')
				setExamine_disabled_status(false)
				setExamine_status_action('重新提交')
				setExamine_status_color('#F63638FF')
				if (item.usable_chances === 0) {
					//可用的尝试机会为0
					setExamine_status_name('无剩余审核机会')
					//禁用重新提交
					setExamine_disabled_status(true)
					setExamine_status_color('#F63638FF')
				}
			} else if (item.examine_status === false) {
				//不通过但未审核
				//审核中状态
				setExamine_status_name('审核中')
				//禁用重新提交
				setExamine_disabled_status(true)
				setExamine_status_action('重新提交')
				setExamine_status_color('#50ace7')
			}
			
		}
		
		if (item.delete_status) {
			//	如果已经删除
			//禁用删除
			setDelete_disabled_status(true)
			setExamine_disabled_status(true)
			setExamine_status_name('已删除')
			setExamine_status_color('#F63638FF')
		}
		
		if (item.mint_status) {
			//如果已经铸造
			//禁用删除
			setDelete_disabled_status(true)
			setExamine_disabled_status(true)
			setExamine_status_name('已铸造')
			setExamine_status_action('已铸造')
			setExamine_status_color('#4bbf73')
		}
	}, [item])
	
	return (
		<Col span={CARD_COLS} key={item.product_id}>
			<Card
				key={item.product_id}
				className='inside-card'
				hoverable
				bordered
				//封面
				cover={
					previewContent
				}
				//下方操作
				actions={[
					<Button
						type='primary'
						id={item.product_id}
						disabled={examine_disabled_status}
						onClick={(e) => {
							handleCastOrRetry(e)
						}}
					>
						{examine_status_action}
					</Button>,
					<Button
						danger
						type="primary"
						disabled={delete_disabled_status}
						onClick={(e) => {
							handleDelete(e)
						}}
					>
						删除
					</Button>,
				]}
			>
				<div style={{display: 'flex', justifyContent: 'space-between'}}>
					<div>
						<div className='top-attribute'>NFT名字</div>
						<div>{item.product_name}</div>
					</div>
					<div className='right-content'>
						<div className='top-attribute'>状态</div>
						<span style={{color: examine_status_color}}>{examine_status_name}</span>
					</div>
				</div>
			</Card>
		</Col>
	)
}

export default UnderChainTokenItem
