import React, {Component} from "react";

class FileNFT extends Component {
	render() {
		console.log(this.props.tokenURL)
		return (
			<div>
				<img alt='数藏万物' src={this.props.tokenURL} style={{width: 216.8}}/>
			</div>
		)
	}
}

export default FileNFT