import React from 'react';
import {Button, Checkbox, Form, Input, Select,} from 'antd';
import HttpUtil from "../Utils/HttpUtil";

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

const selectAfter = (
    <Select defaultValue="@qq.com" className="select-after">
        <Option value="@aliyun.com">@aliyun.com</Option>
        <Option value="@163.com">@163.com</Option>
        <Option value="@126.com">@126.com</Option>
        <Option value="@139.com">@139.com</Option>
    </Select>
);

const handleClick = (e) => {
    console.log(e)
    let md5 = require("./model/md5.js"); //引入md5加密模块
    let md5Password = md5(e.password);
    HttpUtil.post()
}

const Register = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

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

    return (
        <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
                residence: ['zhejiang', 'hangzhou', 'xihu'],
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
                    }, ({getFieldValue}) => ({
                        validator(_, value) {
                            if ((value.length === 15 && value.match(/^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/))
                                ||
                                (value.length === 18 && value.match(/^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/))
                            ) {
                                return Promise.resolve();
                            }

                            return Promise.reject(new Error('身份号码格式错误!'));
                        },
                    }),
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name="email"
                label="E-mail"
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
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
                    {
                        pattern: "[1][34578][0-9]{9}",
                        message: '手机号码格式不正确!',
                    }
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
                <Select placeholder="select your gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="User_name"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: '请输入您的用户名!',
                        whitespace: true,
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
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" onClick={handleClick}>
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Register;