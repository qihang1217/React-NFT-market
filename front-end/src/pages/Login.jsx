import React, {Component} from "react";
import {Button, Checkbox, Form, Input, message} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {withRouter} from "react-router-dom";
import "./css/Login.css"
import md5 from "./model/md5";
import HttpUtil from "../Utils/HttpUtil";
import ApiUtil from "../Utils/ApiUtil";
//引用CSS
import "./css/rslogin/css/lstyle.css"
import "./css/rslogin/css/font-awesome.min.css"

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false, // 是否重定向之前的界面
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // 提交登录表单
    async handleSubmit(e) {
        let md5 = require("./model/md5.js"); //引入md5加密模块
        e.password = md5(e.password);
        HttpUtil.post(ApiUtil.API_REGISTER, e).then(function (response) {
            console.log(response)
            if (response.status === 200 && response.message === '添加成功') {
                message.success('注册成功~');
                window.location.href = "/login";
            } else {
                message.error('注册失败,请稍后重试~');
            }
        }).catch(function (error) {
            // console.log(error);
        });
        const username = e.username;
        const password = e.password;
        // 保存信息到sessionStorage
        sessionStorage.setItem("userName", username);
        // 登录成功后，设置redirectToReferrer为true;
        this.setState({
            redirectToReferrer: true,
        });
        let RedirectUrl = this.props.location.pathname
            ? this.props.location.pathname
            : "/";
        // 登陆成功之后的跳转
        window.location.href = RedirectUrl
    }

    componentWillMount() {
        message.error('未登录,请先登录~', 1);
    }

    componentDidMount() {
        const screenHeight = document.documentElement.clientHeight;
        let height = `${screenHeight}px`;
        this.setState({
            height,
        })
        window.addEventListener('resize', this.handleHeight);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleHeight);
    }

    handleHeight = () => {
        const screenHeight = document.documentElement.clientHeight;
        let height = `${screenHeight}px`;
        this.setState({
            height,
        })
    }

    render() {
        return (
            <>
                <session className="w3l-hotair-form" style={{width: "100%", height: `${this.state.height}`, display: "block"}}>
                    {/*表单开头 */}
                    <h2>Welocome to NFT market</h2>
                    <div className="container">
                        {/*表单样式*/}
                        <div className="workinghny-form-grid">
                            <div className="main-hotair">
                                <div className="content-wthree">
                                    <h3 style={{'text-align': 'center'}}>Log In</h3>
                                    <p>To Your Account</p>

                                    <Form
                                        name="normal_login" className="login-form"
                                        initialValues={{
                                            remember: true,
                                        }}
                                        onFinish={this.handleSubmit}
                                    >
                                        <Form.Item
                                            name="username"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your Username!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Username"/>
                                        </Form.Item>
                                        <Form.Item
                                            name="password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your Password!',
                                                },
                                            ]}
                                        >
                                            {/*prefix={<LockOutlined className="site-form-item-icon"/>}*/}
                                            <Input

                                                type="password"
                                                placeholder="Password"
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                                <Checkbox>Remember me</Checkbox>
                                            </Form.Item>
                                            <br/><br/>
                                            <a className="login-form-forgot" href="">
                                                Forgot password
                                            </a>
                                            Or <a href="/register">register now!</a>
                                        </Form.Item>

                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className='login-form-button'>
                                                Log in
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                                {/*放图片的区域*/}
                                <div className="w3l_form align-self"></div>
                            </div>
                        </div>

                    </div>

                </session>
            </>
        );
    }
}

export default withRouter(Login);