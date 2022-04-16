import React from "react";
import metamaskIcon from "./metamask.svg";
import "./ConnectToMetamask.css"
import {Button} from "antd";

const ConnectToMetamask = ({connectToMetamask}) => {
    return (
        <div className="connect">
            <h1 className="top_title">
                您需要一个以太坊钱包才能访问数藏万物
            </h1>
            <div>
	            <p className="top_subtitle">
		            连接现有的钱包或创建一个新的{" "}
		            <i style={{"color": "#2081E2"}}>MetaMask</i>并且连接到它
	            </p>
            </div>
            <div className="select_list">
                <Button type="primary" onClick={connectToMetamask} className="connect_button"
                        style={{fontSize: "1.2rem", letterSpacing: "0.1rem", fontweight: "600", height: "40px"}}
                >
                    连接Metamask{" "}
                    <img
                        src={metamaskIcon}
                        alt="metamask-icon"
                        style={{width: "2rem", marginLeft: "0.5rem"}}
                    />
                </Button>
            </div>

        </div>
    );
};

export default ConnectToMetamask;
