import React, {useState} from "react";
import Paragraph from "antd/es/typography/Paragraph";
import {Card} from "antd";

const EditableParagraph = ({name, data}) => {
	const [clickTriggerStr, setClickTriggerStr] = useState(data)
	return (
		<Card title={name}>
			<Paragraph
				editable={{
					tooltip: '点击修改',
					onChange: setClickTriggerStr,
					triggerType: ['icon', 'text'],
				}}
			>
				{clickTriggerStr}
			</Paragraph>
		</Card>
	
	)
}

export default EditableParagraph

