import React from 'react';
import {Button, Steps, Checkbox, Form, Input, message, Select, InputNumber, Space} from 'antd';
import HttpUtil from "../Utils/HttpUtil";
import ApiUtil from "../Utils/ApiUtil";

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
            offset: 8,
        },
    },
};

const Register = () => {
    const [value, setValue] = React.useState('');
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
        sessionStorage.setItem('real_name',values.real_name)
        sessionStorage.setItem('id_number',values.id_number)
        sessionStorage.setItem('age',values.age)
        sessionStorage.setItem('gender',values.gender)
        next();
    }

    const secondOnFinish = (values) => {
        console.log(values)
        sessionStorage.setItem('email',values.email)
        sessionStorage.setItem('email_end',values.email_end)
        sessionStorage.setItem('prefix',values.prefix)
        sessionStorage.setItem('phone_number',values.phone_number)
        next();
    }

    const onFinish = (values) => {
        //获得前两个表单的数据
        values['real_name'] = sessionStorage.getItem('real_name');
        values['id_number'] = sessionStorage.getItem('id_number');
        values['age'] = sessionStorage.getItem('age');
        values['gender'] = sessionStorage.getItem('gender');
        values['email'] = sessionStorage.getItem('email');
        values['email_end'] = sessionStorage.getItem('email_end');
        values['prefix'] = sessionStorage.getItem('prefix');
        values['phone_number'] = sessionStorage.getItem('phone_number');
        //清除存储的数据
        sessionStorage.removeItem('real_name');
        sessionStorage.removeItem('id_number');
        sessionStorage.removeItem('age');
        sessionStorage.removeItem('gender');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('email_end');
        sessionStorage.removeItem('prefix');
        sessionStorage.removeItem('phone_number');
        let md5 = require("./model/md5.js"); //引入md5加密模块
        values.password = md5(values.password);
        console.log(values)
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

    const steps_length=3
    const steps = [
        {
            title: 'First',
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
                        <Space>
                            <InputNumber min={1} max={99} value={value} onChange={setValue}/>
                        </Space>
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[
                            {
                                required: true,
                                message: 'Please select gender!',
                            },
                        ]}
                    >
                        <Select placeholder="请输入您的性别">
                            <Option value="男">男</Option>
                            <Option value="女">女</Option>
                            <Option value="其他">其他</Option>
                        </Select>
                    </Form.Item>
                    <div className="steps-action">
                        {current < steps_length - 1 && (
                            <Button type="primary" htmlType="submit" >
                                Next
                            </Button>
                        )}
                        {current === steps_length - 1 && (
                            <Button type="primary" htmlType="submit" onClick={() => message.success('Processing complete!')}>
                                Done
                            </Button>
                        )}
                        {current > 0 && (
                            <Button style={{margin: '0 8px'}} onClick={() => prev()}>
                                Previous
                            </Button>
                        )}
                    </div>
                </Form>
        },
        {
            title: 'Second',
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
                        label="E-mail"
                        rules={[
                            // {
                            //     type: 'email',
                            //     message: 'The input is not valid E-mail!',
                            // },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
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
                                message: 'Please input your phone number!',
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
                    <div className="steps-action">
                        {current < steps_length - 1 && (
                            <Button type="primary" htmlType="submit" >
                                Next
                            </Button>
                        )}
                        {current === steps_length - 1 && (
                            <Button type="primary" htmlType="submit" onClick={() => message.success('Processing complete!')}>
                                Done
                            </Button>
                        )}
                        {current > 0 && (
                            <Button style={{margin: '0 8px'}} onClick={() => prev()}>
                                Previous
                            </Button>
                        )}
                    </div>
                </Form>
            ,
        },
        {
            title: 'Last',
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
                                validator: (rule, value, callback) => {
                                    checkAccount(value).then(res => {
                                        console.log(res)
                                        if (res) {
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
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
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
                                    value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                            },
                        ]}
                        {...tailFormItemLayout}
                    >
                        <Checkbox>
                            I have read the <a href="">agreement</a>
                        </Checkbox>
                    </Form.Item>
                    <div className="steps-action">
                        {current < steps_length - 1 && (
                            <Button type="primary" htmlType="submit" >
                                Next
                            </Button>
                        )}
                        {current === steps_length - 1 && (
                            <Button type="primary" htmlType="submit" onClick={() => message.success('Processing complete!')}>
                                Done
                            </Button>
                        )}
                        {current > 0 && (
                            <Button style={{margin: '0 8px'}} onClick={() => prev()}>
                                Previous
                            </Button>
                        )}
                    </div>
                </Form>,
        },
    ];


    return (
        <>
            <Steps current={current}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title}/>
                ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>

        </>
    );
};

export default Register;