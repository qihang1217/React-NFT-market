import React, {Component} from "react";
import {Avatar, Button, Card, Col, Collapse, Comment, Form, Input, List, Row, Timeline, Tooltip} from "antd";
import {EyeOutlined, HistoryOutlined, LockOutlined, MailOutlined, SmileOutlined, StarOutlined} from '@ant-design/icons';
import './PorductDetail.less'
import moment from 'moment';

const data = [
	{
		actions: [<span key="comment-list-reply-to-0">回复</span>],
		author: 'test1',
		avatar: 'https://joeschmoe.io/api/v1/random',
		content: (
			<p>
				这只加密猫好酷啊！
			</p>
		),
		datetime: (
			<Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
				<span>{moment().subtract(1, 'days').fromNow()}</span>
			</Tooltip>
		),
	},
	{
		actions: [<span key="comment-list-reply-to-0">回复</span>],
		author: 'test2',
		avatar: 'https://joeschmoe.io/api/v1/random',
		content: (
			<p>
				我也觉得我也觉得
			</p>
		),
		datetime: (
			<Tooltip title={moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}>
				<span>{moment().subtract(2, 'days').fromNow()}</span>
			</Tooltip>
		),
	},
];
const {Panel} = Collapse;


const {TextArea} = Input;

const CommentList = ({comments}) => (
	<List
		dataSource={comments}
		header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
		itemLayout="horizontal"
		renderItem={props => <Comment {...props} />}
	/>
);

const Editor = ({onChange, onSubmit, submitting, value}) => (
	<>
		<Form.Item>
			<TextArea rows={4} onChange={onChange} value={value}/>
		</Form.Item>
		<Form.Item>
			<Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
				Add Comment
			</Button>
		</Form.Item>
	</>
);

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const img = require('./1.png')

class ProductDetail extends Component {
	
	state = {
		comments: [],
		submitting: false,
		value: '',
	};
	
	handleSubmit = () => {
		if (!this.state.value) {
			return;
		}
		
		this.setState({
			submitting: true,
		});
		
		setTimeout(() => {
			this.setState({
				submitting: false,
				value: '',
				comments: [
					...this.state.comments,
					{
						author: 'Han Solo',
						avatar: 'https://joeschmoe.io/api/v1/random',
						content: <p>{this.state.value}</p>,
						datetime: moment().fromNow(),
					},
				],
			});
		}, 1000);
	};
	
	handleChange = e => {
		this.setState({
			value: e.target.value,
		});
	};
	
	render() {
		
		const {comments, submitting, value} = this.state;
		
		return (
			<div className='product-detail'>
				<Row>
					<Col md={13}>
						<div className='product-content'>
							<img src={img} className='content-container'/>
							<div className='name-content'>
								<p className='name-title'>加密猫</p>
								<span>绘画</span>
							</div>
							<div className='user-content'>
								<Avatar size={64} src={<img src="https://joeschmoe.io/api/v1/random"/>}/>
								<div className='user-des'>
									<p>admin1</p>
									<Button type='primary'>关注</Button>
								</div>
								<div className='view-like'>
									<div className='right-content'>
										<div className='view'>
											<EyeOutlined/> 1
										</div>
										<div className='like'>
											<StarOutlined/> 0
										</div>
									</div>
								</div>
							</div>
							<div className='product-des'>
								<p>我是一只加密猫</p>
							</div>
						</div>
					
					</Col>
					<Col md={11}>
						<Card>
							<div className='buy-container'>
								<h1 className='price-title'>14 Ξ</h1>
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
						</Card>
						<Collapse accordion>
							<Panel header="作品信息" key="1">
								<p>{text}</p>
							</Panel>
							<Panel header="作品描述" key="3">
								<p>{text}</p>
							</Panel>
							<Panel header="拥有者信息" key="2">
								<p>{text}</p>
							</Panel>
						</Collapse>
						<div className='trace-container'>
							<Timeline>
								<Timeline.Item color="green">创建于上链于2022-4-18</Timeline.Item>
								<Timeline.Item color="#00CCFF" dot={<SmileOutlined/>}>
									<p>处于上架状态</p>
								</Timeline.Item>
							</Timeline>
						</div>
					</Col>
				</Row>
				<div className='comment-container'>
					<List
						className="comment-list"
						header={`${data.length} 评论`}
						itemLayout="horizontal"
						dataSource={data}
						renderItem={item => (
							<li>
								<Comment
									actions={item.actions}
									author={item.author}
									avatar={item.avatar}
									content={item.content}
									datetime={item.datetime}
								/>
							</li>
						)}
					/>
					{comments.length > 0 && <CommentList comments={comments}/>}
					<Comment
						avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo"/>}
						content={
							<Editor
								onChange={this.handleChange}
								onSubmit={this.handleSubmit}
								submitting={submitting}
								value={value}
							/>
						}
					/>
				</div>
			</div>
		)
	}
}

export default ProductDetail;