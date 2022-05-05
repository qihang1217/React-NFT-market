import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import './FileNFT.less'

class FileNFT extends Component {
	render() {
		// console.log(this.props.previewContent)
		return (
			<div className='file-nft'>
				<a
					className='thumbnail-container'
					href={'/ownedEverything/detail/' + this.props.tokenId}
				>
					{this.props.previewContent}
				</a>
			</div>
		)
	}
}

export default withRouter(FileNFT)