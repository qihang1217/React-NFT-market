import React, {Component} from "react";
import {withRouter} from "react-router-dom";

class FileNFT extends Component {
	render() {
		return (
			<div onClick={()=>{
				this.props.history.push('/ownedEverything/detail/' + this.props.tokenId)
			}}>
				<img alt='数藏万物' src={this.props.tokenURL} style={{width: 216.8}}/>
			</div>
		)
	}
}

export default withRouter(FileNFT)