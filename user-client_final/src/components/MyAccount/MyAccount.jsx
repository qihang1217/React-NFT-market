import React, { Component } from "react";
import AccountDetails from "../AccountDetails/AccountDetails";
import ConnectToMetamask from "../ConnectMetamask/ConnectToMetamask";
import ContractNotDeployed from "../ContractNotDeployed/ContractNotDeployed";
import Loading from "../Loading/Loading";
import { delete_padding, revive_padding } from "../../utils/ControlPadding";
import head from "./image/head.png"
import "./MyAccount.css";
import { Upload, message, Menu, Tabs, Table, Tag, Space, Form, Input, InputNumber, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, } from 'antd';
import { LoadingOutlined, PlusOutlined, AppstoreOutlined, HeartOutlined, PayCircleOutlined, FormatPainterOutlined, MenuOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;
// const data = [
//     {
//         key: '1',
//         name: '名字1',
//         tags: ['视频'],
//         time: '2022/4/14',
//         price: 32.00,
//         state: 'New York No. 1 Lake Park',
//     },
//     {
//         key: '2',
//         name: '名字2',
//         tags: ['图像'],
//         time: '2022/4/14',
//         price: 12.99,
//         state: 'New York No. 1 Lake Park',
//     },
//     {
//         key: '3',
//         name: 'John',
//         tags: ['模型'],
//         time: 'Brown',
//         price: 32,
//         state: 'New York No. 1 Lake Park',
//     },
// ];
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('只能上传JPG/PNG文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('照片必须小于2MB!');
    }
    return isJpgOrPng && isLt2M;
}


class MyAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingVisible: 'flex',
            iframeVisible: 'none',
            input_value: '余启航',
        }
    }


    handleHeight = () => {
        const screenHeight = document.documentElement.clientHeight;
        let height = `${screenHeight - 64}px`;
        this.setState({
            height,
        })
    }


    componentDidMount() {
        //清除外部的边界框
        delete_padding()
        this.props.delete_footer()
        const screenHeight = document.documentElement.clientHeight;
        let height = `${screenHeight - 64}px`;
        this.setState({
            height,
        })
        window.addEventListener('resize', this.handleHeight);
    }

    componentWillUnmount() {
        //恢复外部的边界框
        revive_padding()
        this.props.revive_footer()
        window.removeEventListener('resize', this.handleHeight);
    }

    onCopy = () => {
        const spanText = document.getElementById('code').innerText;
        const oInput = document.createElement('input');
        oInput.value = spanText;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand('Copy'); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        document.body.removeChild(oInput);
        message.success('复制成功!');
    }

    onSave = () => {
        message.success('保存成功!');
    }

    input_change(e) {
        this.setState({
            input_value: e.target.value
        })
    }
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };



    render() {
        const { current } = this.state;
        const { loading, imageUrl } = this.state;
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>上传</div>
            </div>
        );
        return (
            <>
                <div>
                    {
                        !this.props.metamaskConnected ? (
                            <ConnectToMetamask connectToMetamask={this.props.connectToMetamask} />
                        ) :
                            // !this.props.contractDetected ? (
                            //     <ContractNotDeployed/>
                            // ) : 
                            this.props.loading ? (
                                <Loading />
                            ) : (
                                // <AccountDetails
                                //     accountAddress={this.props.accountAddress}
                                //     accountBalance={this.props.accountBalance}
                                // />
                                <div className="my">
                                    <div className="art-container">
                                        <div className="ant-spin-nested-loading">
                                            <div className="ant-spin-container">
                                                <div className="top-bg">
                                                    <img className="avatar" src={head} alt="头像" />
                                                </div>
                                                <div className="middle-info">
                                                    <div className="title">
                                                    </div>
                                                    <div className="username">
                                                        <div className="info-area-auth">
                                                            <span className="my-name">余启航</span>
                                                            <span className="address-info">账户地址:
                                                                <span className="address-code" id='code'>0xb710bdddd47fa4e031496e0fa9ea8cffb064203e</span>
                                                                <span style={{ color: 'rgba(0,145,255,0.85)', cursor: 'pointer', marginLeft: '10px' }}>
                                                                    <i className="anticon anticon-copy" aria-label="图标：copy" onClick={() => this.onCopy()}>
                                                                        <svg viewBox="64 64 896 896" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
                                                                            <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z">
                                                                            </path>
                                                                        </svg>
                                                                    </i>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="num-info">
                                                        <div className="item">
                                                            <span className="number">32</span>
                                                            <span className="type">关注</span>
                                                        </div>
                                                        <div className="item">
                                                            <span className="number">47</span>
                                                            <span className="type">粉丝</span>
                                                        </div>
                                                        <div className="item">
                                                            <span className="number">13</span>
                                                            <span className="type">藏品</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Tabs defaultActiveKey="1" className="tabs" centered size="large" tabBarGutter="90px">
                                        <TabPane
                                            tab={
                                                <span>
                                                    <FormatPainterOutlined />
                                                    我的铸造
                                                </span>
                                            }
                                            key="1"
                                        >
                                            <div className="tab1">

                                            </div>
                                        </TabPane>
                                        <TabPane
                                            tab={
                                                <span>
                                                    <HeartOutlined />
                                                    我的藏品
                                                </span>
                                            }
                                            key="2"
                                        >
                                            <div className="tab2">
                                            </div>
                                        </TabPane>
                                        <TabPane
                                            tab={
                                                <span>
                                                    <AppstoreOutlined />
                                                    我的账号
                                                </span>
                                            }
                                            key="3"
                                        >
                                            <div className="tab3">
                                                <form className="ant-form ant-form-horizontal" style={{ justifyContent: 'center', marginLeft: '500px', marginTop: '50px' }}>
                                                    <div className="ant-row ant-form-item">
                                                        <div className="ant-col ant-col-4 ant-form-item-label">
                                                            <label title="名称：" className="ant-form-item-required">用户名：</label>
                                                        </div>
                                                        <div className="ant-col ant-col-8 ant-form-item-control-wrapper">
                                                            <div className="ant-form-item-control">
                                                                <span className="ant-form-item-children">
                                                                    <input placeholder="请输入用户名" type="text" maxlength="21" className="ant-input" value={this.state.input_value} onChange={this.input_change.bind(this)} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ant-row ant-form-item">
                                                        <div className="ant-col ant-col-4 ant-form-item-label">
                                                            <label title="年龄：" className="ant-form-item-required">年龄：</label>
                                                        </div>
                                                        <div className="ant-col ant-col-8 ant-form-item-control-wrapper">
                                                                <span className="ant-form-item-children">
                                                                    <input placeholder="请输入年龄" type="text" maxlength="21" className="ant-input" value={"12"} onChange={this.input_change.bind(this)} />
                                                                </span>
                                                        </div>
                                                    </div>
                                                    <div className="ant-row ant-form-item">
                                                        <div className="ant-col ant-col-4 ant-form-item-label">
                                                            <label title="性别：" className="ant-form-item-required">性别：</label>
                                                        </div>
                                                        <div className="ant-col ant-col-8 ant-form-item-control-wrapper">
                                                            <div className="ant-form-item-control">
                                                                <span className="ant-form-item-children">
                                                                    <input placeholder="请输入性别" type="text" maxlength="21" className="ant-input" value={"女"} onChange={this.input_change.bind(this)} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ant-row ant-form-item">
                                                        <div className="ant-col ant-col-4 ant-form-item-label">
                                                            <label title="用户头像：" className="">用户头像：</label>
                                                        </div><div className="ant-col ant-col-8 ant-form-item-control-wrapper">
                                                            <div className="ant-form-item-control">
                                                                <span className="ant-form-item-children">
                                                                    <span className="upload-list-inline">
                                                                        <div className="ant-upload ant-upload-select ant-upload-select-text">
                                                                            <Upload
                                                                                name="avatar"
                                                                                listType="picture-card"
                                                                                className="avatar-uploader"
                                                                                showUploadList={false}
                                                                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                                                beforeUpload={beforeUpload}
                                                                                onChange={this.handleChange}
                                                                            >
                                                                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                                                            </Upload>
                                                                        </div>
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ant-row ant-form-item">
                                                        <div className="ant-col ant-col-4 ant-form-item-label">
                                                            <label title="描述：" className="">
                                                                个人简介：
                                                            </label>
                                                        </div>
                                                        <div className="ant-col ant-col-8 ant-form-item-control-wrapper">
                                                            <div className="ant-form-item-control">
                                                                <span className="ant-form-item-children">
                                                                    <textarea placeholder="请输入个人简介" maxlength="300" className="ant-input" style={{ height: '73px', minHeight: '73px', maxHeight: '199px', overflowY: 'hidden' }}>
                                                                    </textarea>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ant-row ant-form-item">
                                                        <div className="ant-col ant-col-14 ant-col-offset-4 ant-form-item-control-wrapper">
                                                            <div className="ant-form-item-control">
                                                                <span className="ant-form-item-children">
                                                                    <button type="button" className="confirm ant-btn" onClick={this.onSave}>
                                                                        <span>保存</span>
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>

                                            </div>
                                        </TabPane>
                                        <TabPane
                                            tab={
                                                <span>
                                                    <PayCircleOutlined />
                                                    我的资产
                                                </span>
                                            }
                                            key="4"
                                        >
                                            <div className="tab4">
                                            </div>
                                        </TabPane>
                                        {/* <TabPane
                                            tab={
                                                <span>
                                                    <PayCircleOutlined />
                                                    交易订单
                                                </span>
                                            }
                                            key="5"
                                        >
                                            <div className="tab5">
                                            </div>
                                        </TabPane> */}
                                    </Tabs>,
                                </div>
                            )
                    }
                </div>
                <iframe
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    scrolling="auto"
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0"
                    onLoad={() => {
                        this.setState({
                            loadingVisible: 'none',
                            iframeVisible: 'block'
                        })
                    }}
                    style={{ width: "100%", height: this.state.height, display: this.state.iframeVisible }}
                />
            </>
        )
    }
}

export default MyAccount;
