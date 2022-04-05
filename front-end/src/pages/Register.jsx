import React from 'react';
import {Button, Steps, Checkbox, Form, Input, message, Select, InputNumber} from 'antd';
import HttpUtil from "../Utils/HttpUtil";
import ApiUtil from "../Utils/ApiUtil";
//引用CSS
import "./css/rsregister/font-awesome/css/font-awesome.min.css"
import "./css/rsregister/css/rstyle.css"
import "./css/rsregister/bootstrap/css/bootstrap.min.css"
import "./css/rslogin/css/lstyle.css"

const {Step} = Steps;
const {Option} = Select;

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 4,
        },
    },
};


const Register = () => {
    const [age, setAge] = React.useState('');
    const [email_end, setEmail_end] = React.useState('@qq.com');
    const [form] = Form.useForm();
    const [current, setCurrent] = React.useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };


    const selectAfter = (
        <Select defaultValue="@qq.com" className="select-after"
                onChange={(selected_value) => {
                    setEmail_end(selected_value)
                }}
        >
            <Option value="@aliyun.com">@aliyun.com</Option>
            <Option value="@163.com">@163.com</Option>
            <Option value="@126.com">@126.com</Option>
            <Option value="@139.com">@139.com</Option>
        </Select>
    );


    const checkedAccount = (data) => {
        return HttpUtil.post(ApiUtil.API_CHECK_USERNAME, data)
    }

    // 验证账号是否已经被添加过
    const checkAccount = (value) => { // 这个是rules自定义的验证方法
        return new Promise((resolve, reject) => {  // 返回一个promise
            checkedAccount({user_name: value}).then(res => { // 这个是后台接口方法
                if (res.responseCode === 200 && res.message === '用户名重复') {
                    console.log(res)
                    resolve(false)
                } else
                    resolve(true)
            }).catch(error => {
                reject(error)
            })
        })
    }

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );

    const firstOnFinish = (values) => {
        sessionStorage.setItem('first_register', JSON.stringify(values))
        next();
    }

    const secondOnFinish = (values) => {
        console.log(values)
        values['email_end']=email_end
        sessionStorage.setItem('second_register', JSON.stringify(values))
        next();
    }

    const onFinish = (values) => {
        //获得前两个表单的数据
        // console.log(typeof values)
        const first_register=JSON.parse(sessionStorage.getItem('first_register')||'{}')
        const second_register=JSON.parse(sessionStorage.getItem('second_register')||'{}')
        values=Object.assign(values,first_register,second_register)
        //清除存储的数据
        sessionStorage.removeItem('first_register');
        sessionStorage.removeItem('second_register');
        let md5 = require("./model/md5.js"); //引入md5加密模块
        values.password = md5(values.password);
        // console.log(values)
        HttpUtil.post(ApiUtil.API_REGISTER, values).then(function (response) {
            console.log(response)
            if (response.responseCode === 200 && response.message === '添加成功') {
                message.success('注册成功~');
                window.location.href = "/login";
            } else if (response.message === '用户名重复') {
                message.error('用户名已被使用,请更换~');
            } else {
                message.error('注册失败,请稍后重试~');
            }
        }).catch(function (error) {
            // console.log(error);
        });
    };

    const steps_length = 3
    const steps = [
        {
            title: '个人信息',
            content:
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={firstOnFinish}
                    initialValues={{
                        prefix: '86',
                    }}
                    scrollToFirstError
                >
                    <Form.Item
                        name="real_name"
                        label="真实姓名"
                        tooltip="请如实输入"
                        rules={[
                            {
                                required: true,
                                message: '请输入您的真实姓名!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input placeholder="真实姓名"/>
                    </Form.Item>
                    <Form.Item
                        name="id_number"
                        label="身份证号"
                        tooltip="请如实输入"
                        rules={[
                            {
                                required: true,
                                message: '请输入您的身份证号!',
                                whitespace: true,
                            },
                            // ({getFieldValue}) => ({
                            //     validator(_, value) {
                            //         if ((value.length === 15 && value.match(/^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/))
                            //             ||
                            //             (value.length === 18 && value.match(/^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/))
                            //         ) {
                            //             return Promise.resolve();
                            //         }
                            //
                            //         return Promise.reject(new Error('身份号码格式错误!'));
                            //     },
                            // }),
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="age"
                        label="年龄"
                        rules={[
                            {
                                required: true,
                                message: '请输入您的年龄!',
                            },
                        ]}
                    >
                        <InputNumber min={1} max={150} value={age} onChange={setAge}/>
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="性别"
                        rules={[
                            {
                                required: true,
                                message: '请输入您的性别!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Select placeholder="请输入您的性别">
                            <Option value="男">男</Option>
                            <Option value="女">女</Option>
                            <Option value="其他">其他</Option>
                        </Select>
                    </Form.Item>
                    <div className="steps-action ant-col-offset-8">
                        {current > 0 && (
                            <Button style={{margin: '0 8px'}} onClick={() => prev()}>
                                上一步
                            </Button>
                        )}
                        {current < steps_length - 1 && (
                            <Button type="primary" htmlType="submit">
                                下一步
                            </Button>
                        )}
                        {current === steps_length - 1 && (
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        )}
                    </div>
                </Form>
        },
        {
            title: '联系方式',
            content:
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={secondOnFinish}
                    initialValues={{
                        prefix: '86',
                    }}
                    scrollToFirstError
                >
                    <Form.Item
                        name="email"
                        label="电子邮箱"
                        rules={[
                            // {
                            //     type: 'email',
                            //     message: '这不是一个有效的电子邮箱!',
                            // },
                            {
                                required: true,
                                message: '请输入您的电子邮箱!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input addonAfter={selectAfter}/>
                    </Form.Item>

                    <Form.Item
                        name="phone_number"
                        label="手机号码"
                        rules={[
                            {
                                required: true,
                                message: '请输入您的电话号码!',
                                whitespace: true,
                            },
                            // {
                            //     pattern: "[1][34578][0-9]{9}",
                            //     message: '手机号码格式不正确!',
                            // }
                        ]}
                    >
                        <Input
                            addonBefore={prefixSelector}
                            style={{
                                width: '100%',
                            }}
                            maxlength="12"
                        />
                    </Form.Item>
                    <div className="steps-action ant-col-offset-8">
                        {current > 0 && (
                            <Button style={{margin: '0 8px'}} onClick={() => prev()}>
                                上一步
                            </Button>
                        )}
                        {current < steps_length - 1 && (
                            <Button type="primary" htmlType="submit">
                                下一步
                            </Button>
                        )}
                        {current === steps_length - 1 && (
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        )}
                    </div>
                </Form>
            ,
        },
        {
            title: '账号密码',
            content:
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    initialValues={{
                        prefix: '86',
                    }}
                    scrollToFirstError
                >
                    <Form.Item
                        name="user_name"
                        label="用户名"
                        rules={[
                            {
                                required: true,
                                message: '请输入您的用户名!',
                                whitespace: true,
                            },
                            {
                                min:2,
                                message: '用户名不能小于2位!',
                            },
                            {
                                max:12,
                                message: '用户名不能大于12位!',
                            },
                            {
                                pattern:/^[a-zA-Z0-9_]+$/,
                                message: '用户名必须是由英文、数字或下划线组成!',
                            },
                            {
                                validator: (rule, value, callback) => {
                                    checkAccount(value).then(res => {
                                        console.log(res)
                                        if (res) {
                                            message.success('该用户名可以使用',1)
                                            callback()
                                        } else {
                                            callback('该用户名已存在,请更换重试!')
                                        }
                                    })
                                },
                            },
                        ]}
                    >
                        <Input maxlength="10"/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[
                            {
                                required: true,
                                message: '请输入您的密码!',
                                whitespace: true,
                            },
                            {
                                min:6,
                                message: '密码不能小于6位!',
                            },
                            {
                                max:12,
                                message: '密码不能大于12位!',
                            },
                            {
                                pattern:/^[a-zA-Z0-9_]+$/,
                                message: '密码必须是由英文、数字或下划线组成!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="确认密码"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: '请确认您的密码!',
                                whitespace: true,
                            },
                            {
                                min:6,
                                message: '密码不能小于6位!',
                            },
                            {
                                max:12,
                                message: '密码不能大于12位!',
                            },
                            {
                                pattern:/^[a-zA-Z0-9_]+$/,
                                message: '密码必须是由英文、数字或下划线组成!',
                            },
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(new Error('您两次输入的密码不一致!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('请接受用户协议')),
                            },
                        ]}
                        {...tailFormItemLayout}
                    >
                        <Checkbox className="ant-col-offset-6">
                            我已阅读 <a href="">用户协议</a>
                        </Checkbox>
                    </Form.Item>
                    <div className="steps-action ant-col-offset-8">
                        {current > 0 && (
                            <Button style={{margin: '0 8px'}} onClick={() => prev()}>
                                上一步
                            </Button>
                        )}
                        {current < steps_length - 1 && (
                            <Button type="primary" htmlType="submit">
                                下一步
                            </Button>
                        )}
                        {current === steps_length - 1 && (
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        )}
                    </div>
                </Form>,
        },
    ];


    return (
        <body className='registerbg'>
        {/*注册表单上方的NFT介绍*/}
        <div class="top-content">
            <div class="inner-bg">
                <div class="container">
                    {/*表单样式*/}
                    <h1 className='h1style'><strong>欢迎来到NFT市场</strong></h1>
                    <div class="container">
                        <div class="workinghny-form-grid">
                            <div class="main-hotai">
                                <div class="content-wthree">
                                    <h2 style={{textAlign:'center',color:'#333','font-weight':'600','margin-bottom':'3px'}}>注册</h2>
                                    <p>加入我们吧</p>
                                    <Steps current={current}>
                                        {steps.map(item => (
                                            <Step key={item.title} title={item.title}/>
                                        ))}
                                    </Steps>
                                    <div className="steps-content">{steps[current].content}</div>
                                </div>

                                {/*放图片的区域*/}
                                <div class="w3l_formi align-self"></div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </body>
    );
};

export default Register;