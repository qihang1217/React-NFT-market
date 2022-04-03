import React, {Component} from "react";
import {Button, Checkbox, Form, Input, message} from "antd";
import {withRouter} from "react-router-dom";
import HttpUtil from "../.././Utils/HttpUtil";
import ApiUtil from "../.././Utils/ApiUtil";
//引用CSS
import "./InsideLogin.css"
import "../.././pages/css/rslogin/css/lstyle.css"
import "../.././pages/css/rslogin/css/font-awesome.min.css"
import insideLogin from "./InsideLogin";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // 提交登录表单
    async handleSubmit(e) {
        let md5 = require("../.././pages/model/md5.js"); //引入md5加密模块
        e.password = md5(e.password);
        e['token']=localStorage.getItem("token")
        HttpUtil.post(ApiUtil.API_LOGIN, e).then(function (response) {
            // console.log(response);
            if (response.responseCode === 200 && response.message === '验证成功') {
                message.success('登陆成功~');
                if(response.token_message!=='success')
                    // 生成token到localStorage
                    localStorage.setItem("token", response.token);
                //页面跳转
                let ref = '';
                if (document.referrer.length > 0) {
                    ref = document.referrer;
                }
                try {
                    if (ref.length == 0 &&  window.opener.location.href.length > 0) {
                        ref = window.opener.location.href;
                    }
                } catch (e) {
                    console.log(e)
                }
                if (ref === '/login' || ref === '/register')
                    window.location.href = '/'
                window.location.href = ref
            } else if (response.responseCode === 200 && response.message === '用户不存在') {
                message.error('账号或密码错误,请稍后重试~');
            } else if (response.responseCode === 200 && response.message === '验证失败') {
                message.error('账号或密码错误,请稍后重试~');
            } else {
                message.error('登陆错误,请稍后重试~');
            }
        }).catch(function (error) {
            // console.log(error);
        });
    }

    componentWillMount() {
        this.props.revive_footer()
        message.error('未登录,请先登录~', 1);
    }

    componentDidMount() {
        this.props.delete_footer()
        const screenHeight = document.documentElement.clientHeight;
        let height = `${screenHeight-64}px`;
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
        let height = `${screenHeight-64}px`;
        this.setState({
            height,
        })
    }

    render() {
        return (
            <div className="insideLogin">
                <div className="w3l-hotair-form"
                         style={{width: "100%", height: `${this.state.height}`, display: "block"}}>
                    {/*表单开头 */}
                    <h4>Welocome to NFT market</h4>
                    <div className="container">
                        {/*表单样式*/}
                        <div className="workinghny-form-grid">
                            <div className="main-hotair">
                                <div className="content-wthree">
                                    <h4 style={{'text-align': 'center'}}>Log In</h4>
                                    <p>To Your Account</p>

                                    <Form
                                        name="normal_login" className="login-form"
                                        initialValues={{
                                            remember: true,
                                        }}
                                        onFinish={this.handleSubmit}
                                    >
                                        <Form.Item
                                            name="user_name"
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

                </div>
            </div>
        );
    }
}

export default withRouter(Login);