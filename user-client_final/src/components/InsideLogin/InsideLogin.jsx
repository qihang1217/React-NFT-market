import React, {Component} from "react";
import {Button, Checkbox, Form, Input, message} from "antd";
import {withRouter} from "react-router-dom";

//引用CSS
import "./InsideLogin.css"
import "../.././pages/css/rslogin/css/lstyle.css"
import "../.././pages/css/rslogin/css/font-awesome.min.css"
import {reqLogin} from "../../api/API";
import {delete_padding, revive_padding} from "../../utils/ControlPadding";
import storageUtils from "../../utils/storageUtils";

class InsideLogin extends Component {
    constructor(props) {
        super(props);
        if (!!!storageUtils.getToken()) {
            message.error('未登录,请先登录~', 1);
        }
        this.state = {
            height: `${document.documentElement.clientHeight - 64}px`
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // 提交登录表单
    async handleSubmit(e) {
        let md5 = require("../../utils/md5"); //引入md5加密模块
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
            //页面跳转到原界面
            window.location.reload()
        } else if (response.status === -1 && response.message === '用户不存在') {
            message.error('账号或密码错误,请稍后重试~');
        } else if (response.status === -1 && response.message === '验证失败') {
            message.error('账号或密码错误,请稍后重试~');
        } else {
            message.error('登陆错误,请稍后重试~');
        }
    }

    handleHeight = () => {
        const screenHeight = document.documentElement.clientHeight;
        let height = `${screenHeight - 64}px`;
        this.setState({
            height: height,
        })
    }


    componentDidMount() {
        //清除外部的边界框
        delete_padding()
        //删除页脚
        this.props.delete_footer()
        //设置自适应高度
        this.handleHeight()
        window.addEventListener('resize', this.handleHeight);
    }

    componentWillUnmount() {
        revive_padding()
        this.props.revive_footer()
        window.removeEventListener('resize', this.handleHeight);
    }

    render() {
        return (
            <div className="insideLogin">
                <div className="w3l-hotair-form"
                     style={{width: "100%", height: `${this.state.height}`, display: "block"}}>
                    {/*表单开头 */}
                    <h4>欢迎来到数藏万物</h4>
                    <div className="container">
                        {/*表单样式*/}
                        <div className="workinghny-form-grid">
                            <div className="main-hotair">
                                <div className="content-wthree">
                                    <h4 style={{'textAlign': 'center'}}>登录</h4>
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
                                            <a className="login-form-forgot" href="/">
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
                                <div className="w3l_form align-self"/>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        );
    }
}

export default withRouter(InsideLogin);