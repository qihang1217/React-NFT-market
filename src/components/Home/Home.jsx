import React from "react";
import {Avatar, Button, Card} from "antd";
import "./Home.css"

const {Meta} = Card;

class Home extends React.Component {
    render() {
        return (
            <div>
                <div className="background"
                     style={{'backgroundImage': 'url(http://127.0.0.1:5001/image/background.jpg)'}}>
                </div>
                <div className="top">
                    <div className="left_title">
                        <h1 className="top_title">
                            发现、收集和出售非凡的 NFT
                        </h1>
                        <span className="top_subtitle">
                        OpenSea 是世界上第一个也是最大的 NFT 市场
                    </span>
                        <div className="jump_select">
                            <div className="explore">
                                <Button type="link" href="./marketplace" id="explore_button">探索</Button>
                            </div>
                            <Button type="link" href="./mint" id="mint_button">创建</Button>
                        </div>
                    </div>
                    <div className="right_image">
                        <a href="./my">
                            <Card
                                style={{"border-radius": "10px"}}
                                cover={
                                    <img style={{"border-radius": "10px"}}
                                         alt="example"
                                         src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                    />
                                }
                            >
                                <Meta
                                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random"/>}
                                    title="Card title"
                                    description="This is the description"
                                />
                            </Card>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home

