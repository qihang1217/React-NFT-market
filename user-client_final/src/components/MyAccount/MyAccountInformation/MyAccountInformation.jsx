import React from 'react';
import storageUtils from "../../../utils/storageUtils";
import EditableParagraph from "./EditableParagraph";

const MyAccountInformation = () => {
	const user_data = storageUtils.getUser()
	let {
		user_name,
		phone_number,
		password,
		email,
		gender,
		age,
	} = user_data
	
	return (
		<>
			<EditableParagraph
				name={'用户名'}
				data={user_name}
			/>
			<EditableParagraph
				name={'电话号码'}
				data={phone_number}
			/>
			<EditableParagraph
				name={'密码'}
				data={password}
			/>
			<EditableParagraph
				name={'电子邮箱'}
				data={email}
			/>
			<EditableParagraph
				name={'性别'}
				data={gender}
			/>
			<EditableParagraph
				name={'年龄'}
				data={age}
			/>
		</>
	);
};

export default MyAccountInformation;
