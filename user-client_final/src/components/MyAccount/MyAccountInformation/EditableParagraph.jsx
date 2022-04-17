import React from "react";
import Paragraph from "antd/es/typography/Paragraph";
import {Card} from "antd";

const EditableParagraph = ({name, data, onEndSubmit}) => {
	let clickTriggerStr = data
	
	function setClickTriggerStr(data) {
		clickTriggerStr = data
	}
	
	return (
		<Card title={name}>
			<Paragraph
				editable={{
					tooltip: '点击修改',
					onChange: setClickTriggerStr,
					// onEnd: onEndSubmit(name, clickTriggerStr),
					triggerType: ['icon', 'text'],
					onEnd: () => {
						onEndSubmit(name, clickTriggerStr)
					}
				}}
			>
				{clickTriggerStr}
			</Paragraph>
		</Card>
	
	)
}

export default EditableParagraph

