import React, {Component} from "react";
import {Col, Row,Collapse} from "antd";

const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

class ProductDetail extends Component {
	render() {
		return (
			<Row>
				<Col md={8}>
					<Collapse accordion>
						<Panel header="作品信息" key="1">
							<p>{text}</p>
						</Panel>
						<Panel header="This is panel header 2" key="2">
							<p>{text}</p>
						</Panel>
						<Panel header="This is panel header 3" key="3">
							<p>{text}</p>
						</Panel>
					</Collapse>
				</Col>
				<Col md={12}>
				
				</Col>
			</Row>
		)
	}
}

export default ProductDetail;