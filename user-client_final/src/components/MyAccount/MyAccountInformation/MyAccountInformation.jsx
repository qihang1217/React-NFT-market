import React from 'react';
import storageUtils from "../../../utils/storageUtils";
import EditableParagraph from "./EditableParagraph";
import {reqUpdateUserInfo} from "../../../api/API";
import {message} from "antd"

const MyAccountInformation = () => {
	const user_data = storageUtils.getUser()
	let {
		user_name,
		phone_number,
		email,
		gender,
		age,
	} = user_data
	
	//todo:添加修改密码功能
	const onEndSubmit = async (name, value) => {
		let key = ''
		if (name === '用户名') {
			//todo:添加响应的校验
			key = 'user_name'
		} else if (name === '电话号码') {
			key = 'phone_number'
		} else if (name === '电子邮箱') {
			key = 'email'
		} else if (name === '性别') {
			key = 'gender'
		} else if (name === '年龄') {
			key = 'age'
		}
		const res = await reqUpdateUserInfo(user_data.user_id, key, value)
		if (res.status === 0) {
			//也同步更新store里的数据,保证本地存储数据的正确性
			user_data[key] = value
			// console.log(user_data)
			storageUtils.saveUser(user_data)
			message.success('更新账号信息成功')
		}
	}
	
	return (
		<>
			<div className='content-mainTitle'>
				<span>您在<span id='nft_name' style={{fontSize: 32}}>数藏万物</span>的账号信息</span>
			</div>
			<EditableParagraph
				name={'用户名'}
				data={user_name}
				onEndSubmit={onEndSubmit}
			/>
			<EditableParagraph
				name={'电话号码'}
				data={phone_number}
				onEndSubmit={onEndSubmit}
			/>
			<EditableParagraph
				name={'电子邮箱'}
				data={email}
				onEndSubmit={onEndSubmit}
			/>
			<EditableParagraph
				name={'性别'}
				data={gender}
				onEndSubmit={onEndSubmit}
			/>
			<EditableParagraph
				name={'年龄'}
				data={age}
				onEndSubmit={onEndSubmit}
			/>
		</>
	);
};

export default MyAccountInformation;
