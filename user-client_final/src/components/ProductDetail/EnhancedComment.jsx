import {Avatar, Comment, Tooltip} from "antd";
import moment from "moment";
import React, {createElement, useState} from "react";
import {LikeFilled, LikeOutlined} from "@ant-design/icons";
import {reqCommentLike} from "../../api/API";

const EnhancedComment = ({comment}) => {
	const [likes, setLikes] = useState(comment.like_count);
	const [action, setAction] = useState(null);
	
	const like = async () => {
		let result
		if (action === null) {
			setLikes(likes + 1);
			setAction('liked');
			result = await reqCommentLike(comment.comment_id, 'add')
		} else {
			setLikes(likes - 1);
			setAction(null);
			result = await reqCommentLike(comment.comment_id, 'reduce')
		}
		// console.log(result)
	};
	
	const actions = [
		<span onClick={like}>
	        {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
			<span className="comment-action">{likes}</span>
	      </span>,
		// <span key="comment-basic-reply-to">Reply to</span>,
	];
	
	
	return (
		<Comment
			actions={actions}
			author={<a>{comment.user_name}</a>}
			avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo"/>}
			content={comment.comment_content}
			datetime={
				<Tooltip title={moment(parseInt(comment.create_time)).format('YYYY-MM-DD HH:mm:ss')}>
					<span>{moment(parseInt(comment.create_time)).fromNow()}</span>
				</Tooltip>
			}
		/>
	)
};

export default EnhancedComment;