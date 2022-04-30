import {Form, Input} from "antd";
import React from "react";
//todo:参考ColorNFTDetails.jsx进行修改并替代其
class MyTokenDetail extends React.Component {
	//价格自定义校验
	validatePrice = (rule, value) => {
		if (value === '') {
			return Promise.reject()
		} else if (value * 1 <= 0) {
			return Promise.reject('价格必须大于0')
		} else {
			return Promise.resolve()
		}
	}
	
	render() {
		return (
			<Form>
				<Form.Item
					name="price"
					// initialValue={window.web3.utils.fromWei(tokenItem.price.toString(), "Ether") || ''}
					rules={[
						{required: true, message: '价格必须输入'},
						{validate: this.validatePrice}
					]}
				>
					<Input type="number" placeholder="请输入新的价格"/>
				</Form.Item>
			</Form>
		)
	}
	
}

export default MyTokenDetail;