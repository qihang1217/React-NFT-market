import React, {Component} from "react";
import {Button, Checkbox, Form, Input, message} from "antd";
import {withRouter} from "react-router-dom";
import {reqLogin} from "../api/API";
//引用CSS
import "./css/rslogin/css/lstyle.css"
import "./css/rslogin/css/font-awesome.min.css"
import storageUtils from "../utils/storageUtils";


class Login extends Component {
    constructor(props) {
        super(props);
        message.error('未登录,请先登录~', 1);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // 提交登录表单
    async handleSubmit(e) {
        let md5 = require("../utils/md5.js"); //引入md5加密模块
        e.password = md5(e.password);
        e['token'] = storageUtils.getToken()
        const response = await reqLogin(e)
        // console.log(response);
        if (response.status === 0 && response.message === '验证成功') {
            message.success('登陆成功~');
            if (response.token_message !== 'success') {
                // 将生成token存储到localStorage
                storageUtils.saveUser(response.data[0])
                storageUtils.saveToken(response.token)
            }
            //页面跳转
            this.props.history.push('/')
        } else if (response.status === -1 && response.message === '用户不存在') {
            message.error('账号或密码错误,请稍后重试~');
        } else if (response.status === -1 && response.message === '验证失败') {
            message.error('账号或密码错误,请稍后重试~');
        } else {
            message.error('登陆错误,请稍后重试~');
        }
    }
    
    
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalId)
    }


    render() {
        return (
            <>
                <session className="w3l-hotair-form"
                         style={{width: "100%", display: "block"}}>
                    {/*表单开头 */}
                    <h2>Welocome to NFT market</h2>
                    <div className="container">
                        {/*表单样式*/}
                        <div className="workinghny-form-grid">
                            <div className="main-hotair">
                                <div className="content-wthree">
                                    <h3 style={{'text-align': 'center'}}>登陆</h3>
                                    <p>到您的账户</p>
        
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
                                                    message: '请输入您的用户名!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="用户名"/>
                                        </Form.Item>
                                        <Form.Item
                                            name="password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请输入密码!',
                                                },
                                            ]}
                                        >
                                            {/*prefix={<LockOutlined className="site-form-item-icon"/>}*/}
                                            <Input
                                                type="password"
                                                placeholder="密码"
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                                <Checkbox>记住我</Checkbox>
                                            </Form.Item>
                                            <br/><br/>
                                            <a className="login-form-forgot" href="">
                                                忘记密码
                                            </a>
                                            或者 <a href="/register">立即注册!</a>
                                        </Form.Item>

                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className='login-form-button'>
                                                登录
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