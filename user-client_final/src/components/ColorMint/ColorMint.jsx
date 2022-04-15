import React, {Component} from "react";
import ColorNFTImage from "../ColorNFTImage/ColorNFTImage";
import {Button, Form, Input, message, Select} from "antd";
import {Option} from "antd/es/mentions";
import {reqCategories} from "../../api/API";

// source: https://stackoverflow.com/questions/1484506/random-color-generator
//随机设定颜色
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

const layout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 16,
	},
};

class ColorMint extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userSelectedColors: [
				{
					cardBorderColor: getRandomColor(),
					cardBackgroundColor: getRandomColor(),
					headBorderColor: getRandomColor(),
					headBackgroundColor: getRandomColor(),
					leftEyeBorderColor: getRandomColor(),
					rightEyeBorderColor: getRandomColor(),
					leftEyeBackgroundColor: getRandomColor(),
					rightEyeBackgroundColor: getRandomColor(),
					leftPupilBackgroundColor: getRandomColor(),
					rightPupilBackgroundColor: getRandomColor(),
					mouthColor: getRandomColor(),
					neckBackgroundColor: getRandomColor(),
					neckBorderColor: getRandomColor(),
					bodyBackgroundColor: getRandomColor(),
					bodyBorderColor: getRandomColor(),
				},
			],
			cryptoBoyName: "",
			cryptoBoyPrice: "",
		};
	}
	
	componentDidMount = async () => {
		//获取分类选择列表数据
		this.getCategorys()
	};
	

	callMintMyNFTFromApp =async (values) => {
		console.log(values)
		//todo:颜色上传的审核
		
		// this.props.mintMyColorNFT(
		// 	this.state.userSelectedColors[0],
		// 	values.work_name,
		// 	values.category_id,
		// 	values.price,
		// 	values.introduction,
		// );
	};
	
	
	getCategorys = async () => {
		const result = await reqCategories()
		if (result.status === 0) {
			// 成功
			// 取出分类列表
			const categorys = result.data
			// 更新状态categorys数据
			this.setState({
				categorys
			})
		} else {
			message.error('获取分类列表失败')
		}
	}
	
	//渲染选择组件
	renderCategoryOption() {
		const categorys = this.state.categorys || [{}]
		return categorys.map(item =>
			<Option value={item.category_id}>{item.category_name}</Option>
		)
	}
	
	//自定义校验价格
	validatePrice=(rule,value)=>{
		if(value===''){
			return Promise.reject()
		}else if(value*1<=0){
			return Promise.reject('价格必须大于0')
		}else{
			return Promise.resolve()
		}
	}
	
	render() {
		return (
			<div>
				<div className="card mt-1">
					<div className="card-body align-items-center d-flex justify-content-center">
						<h5>Color Your Crypto Boy As You Want It To be!</h5>
					</div>
				</div>
				<Form {...layout} onFinish={this.callMintMyNFTFromApp} className="pt-4 mt-1">
					<div className="row">
						<div className="col-md-3">
							<div className="form-group">
								<label htmlFor="cardBorderColor">Card Border Color</label>
								<input
									required
									type="color"
									name="cardBorderColor"
									id="cardBorderColor"
									value={this.state.userSelectedColors[0].cardBorderColor}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													cardBorderColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="cardBackgroundColor">
									Card Background Color
								</label>
								<input
									required
									type="color"
									name="cardBackgroundColor"
									id="cardBackgroundColor"
									value={this.state.userSelectedColors[0].cardBackgroundColor}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													cardBackgroundColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="headBorderColor">Head Border Color</label>
								<input
									required
									type="color"
									name="headBorderColor"
									id="headBorderColor"
									value={this.state.userSelectedColors[0].headBorderColor}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													headBorderColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="headBackgroundColor">
									Head Background Color
								</label>
								<input
									required
									type="color"
									name="headBackgroundColor"
									id="headBackgroundColor"
									value={this.state.userSelectedColors[0].headBackgroundColor}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													headBackgroundColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
						</div>
						<div className="col-md-3">
							<div className="form-group">
								<label htmlFor="leftEyeBorderColor">
									Left Eye Border Color
								</label>
								<input
									required
									type="color"
									name="leftEyeBorderColor"
									id="leftEyeBorderColor"
									value={this.state.userSelectedColors[0].leftEyeBorderColor}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													leftEyeBorderColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="rightEyeBorderColor">
									Right Eye Border Color
								</label>
								<input
									required
									type="color"
									name="rightEyeBorderColor"
									id="rightEyeBorderColor"
									value={this.state.userSelectedColors[0].rightEyeBorderColor}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													rightEyeBorderColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="leftEyeBackgroundColor">
									Left Eye Background Color
								</label>
								<input
									required
									type="color"
									name="leftEyeBackgroundColor"
									id="leftEyeBackgroundColor"
									value={
										this.state.userSelectedColors[0].leftEyeBackgroundColor
									}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													leftEyeBackgroundColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="rightEyeBackgroundColor">
									Right Eye Background Color
								</label>
								<input
									required
									type="color"
									name="rightEyeBackgroundColor"
									id="rightEyeBackgroundColor"
									value={
										this.state.userSelectedColors[0].rightEyeBackgroundColor
									}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													rightEyeBackgroundColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
						</div>
						<div className="col-md-6 d-flex justify-content-center align-items-center">
							<ColorNFTImage colors={this.state.userSelectedColors[0]}/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-3">
							<div className="form-group">
								<label htmlFor="leftPupilBackgroundColor">
									Left Pupil Background Color
								</label>
								<input
									required
									type="color"
									name="leftPupilBackgroundColor"
									id="leftPupilBackgroundColor"
									value={
										this.state.userSelectedColors[0].leftPupilBackgroundColor
									}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													leftPupilBackgroundColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="rightPupilBackgroundColor">
									Right Pupil Background Color
								</label>
								<input
									required
									type="color"
									name="rightPupilBackgroundColor"
									id="rightPupilBackgroundColor"
									value={
										this.state.userSelectedColors[0].rightPupilBackgroundColor
									}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													rightPupilBackgroundColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="mouthColor">Mouth Color</label>
								<input
									required
									type="color"
									name="mouthColor"
									id="mouthColor"
									value={this.state.userSelectedColors[0].mouthColor}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													mouthColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="neckBackgroundColor">
									Neck Background Color
								</label>
								<input
									required
									type="color"
									name="neckBackgroundColor"
									id="neckBackgroundColor"
									value={this.state.userSelectedColors[0].neckBackgroundColor}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													neckBackgroundColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
						</div>
						<div className="col-md-3">
							<div className="form-group">
								<label htmlFor="neckBorderColor">Neck Border Color</label>
								<input
									required
									type="color"
									name="neckBorderColor"
									id="neckBorderColor"
									value={this.state.userSelectedColors[0].neckBorderColor}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													neckBorderColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="bodyBackgroundColor">
									Body Background Color
								</label>
								<input
									required
									type="color"
									name="bodyBackgroundColor"
									id="bodyBackgroundColor"
									value={this.state.userSelectedColors[0].bodyBackgroundColor}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													bodyBackgroundColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="bodyBorderColor">Body Border Color</label>
								<input
									required
									type="color"
									name="bodyBorderColor"
									id="bodyBorderColor"
									value={this.state.userSelectedColors[0].bodyBorderColor}
									className="form-control"
									onChange={(e) =>
										this.setState({
											userSelectedColors: [
												{
													...this.state.userSelectedColors[0],
													bodyBorderColor: e.target.value,
												},
											],
										})
									}
								/>
							</div>
						</div>
						<div className="col-md-6">
							<Form.Item
								name="work_name"
								label="作品名称"
								rules={[
									{
										required: true,
										message: '请输入您的作品名称!'
									},
								]}
							>
								<Input
									required
									type="text"
									value={this.state.cryptoBoyName}
									placeholder="数藏万物名称"
									onChange={(e) =>
										this.setState({cryptoBoyName: e.target.value})
									}
								/>
							</Form.Item>
							<Form.Item
								name="category_id"
								label="作品分类"
								rules={[
									{
										required: true,
										message: '请选择您的作品分类!'
									},
								]}
							>
								<Select
									showSearch
									placeholder="请选择您的作品分类"
									optionFilterProp="children"
									filterOption={(input, option) =>
										option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									}
								>
									{this.renderCategoryOption()}
								</Select>
							</Form.Item>
							<Form.Item
								name="price"
								label="价格"
								initialValue=''
								rules={[
									{
										required: true,
										message: '请输入价格!',
									},
									{
										validator:this.validatePrice
									},
								]}
							>
								<Input
									required
									type="number"
									name="price"
									placeholder="请输入价格"
								/>
							</Form.Item>
							<Form.Item name='introduction' label="作品介绍">
								<Input.TextArea maxlength="100" placeholder="请输入您的作品描述"/>
							</Form.Item>
							<Form.Item wrapperCol={{...layout.wrapperCol, offset: 6}}>
								<Button type="primary" htmlType="submit">
									提交审核
								</Button>
							</Form.Item>
							<div className="mt-4">
								{this.props.colorIsUsed ? (
									<>
										<div className="alert alert-danger alert-dissmissible">
											<button
												type="button"
												className="close"
												data-dismiss="alert"
											>
												<span>&times;</span>
											</button>
											{this.props.colorsUsed.length > 1 ? (
												<strong>These colors are taken!</strong>
											) : (
												<strong>This color is taken!</strong>
											)}
										</div>
										<div
											style={{
												display: "flex",
												flexWrap: "wrap",
												marginTop: "1rem",
												marginBottom: "3rem",
											}}
										>
											{this.props.colorsUsed.map((color, index) => (
												<div
													key={index}
													style={{
														background: `${color}`,
														width: "50%",
														height: "50px",
													}}
												/>
											))}
										</div>
									</>
								) : null}
							</div>
						</div>
					</div>
				</Form>
			</div>
		);
	}
}

export default ColorMint;
