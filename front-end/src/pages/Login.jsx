import React, {Component} from "react";
import {Button, Checkbox, Form, Input, message} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {withRouter} from "react-router-dom";
import "./css/Login.css"

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

    render() {
        return (
            <>
                <Form
                    name="normal_login"
                    className="login-form"
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
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
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
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <a className="login-form-forgot" href="">
                            Forgot password
                        </a>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <a href="/register">register now!</a>
                    </Form.Item>
                </Form>
            </>
        );
    }
}

export default withRouter(Login);