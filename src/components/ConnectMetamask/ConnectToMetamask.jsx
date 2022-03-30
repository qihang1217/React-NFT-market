import React from "react";
import metamaskIcon from "./metamask.svg";
import "./ConnectToMetamask.css"
import {Button} from "antd";

const ConnectToMetamask = ({connectToMetamask}) => {
    return (
        <div className="connect">
            <h1 className="top_title">
                You need an Ethereum wallet to use OpenSea.
            </h1>
            <div>
                <p className="top_subtitle">
                    Connect with one of our available wallet providers or create a new one.{" "}
                    <i style={{"color": "#2081E2"}}>Crypto Boy NFTs</i> and manage them.
                </p>
            </div>
            <div className="select_list">
                <Button type="primary"  onClick={connectToMetamask} className="connect_button"
                        style={{fontSize: "1.2rem", letterSpacing: "0.1rem", fontweight:"600",height:"40px"}}
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
