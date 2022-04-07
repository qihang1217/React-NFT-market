import React from "react";
import {InboxOutlined} from '@ant-design/icons';
import {Button, Form, Input, message, Upload} from 'antd';
import ApiUtil from "../../Utils/ApiUtil";

const {Dragger} = Upload;
// const client = ipfsClient('https://ipfs.infura.io:5001/api/v0')

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

const props = {
    name: 'file',
    multiple: false,
    action: 'http://127.0.0.1:5001/api/upload',
    accept: "image/*,video/*,audio/*",
    maxCount: 1,
    onChange(info) {
        const {status} = info.file;
        if (status !== 'uploading') {
            // console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name}文件上传成功!`);
        } else if (status === 'error') {
            message.error(`${info.file.name}文件上传失败!`);
        }
    },
    beforeUpload() {
        return false;
    },
};

var formData = new FormData();

const normFile = (e) => {
    let size = e.file.size;
    let sizeM = size / 1024 / 1024;
    // console.log(e.file.type)
    const isSatisfy = (e.file.type.indexOf('image') === 0 || e.file.type.indexOf('video') === 0 || e.file.type.indexOf('audio') === 0);
    if (!isSatisfy) {
        message.error(`${e.file.name} 需为图片、视频或音频`);
        return [];
    }
    // console.log(sizeM)
    const image_limit = 10;
    if (e.file.type.indexOf('image') === 0) {
        const isLt = sizeM <= image_limit;
        if (!isLt) {
            // setFileLists([]);
            message.error(`${e.file.name} 图片文件大小不能超过${image_limit}M`);
            return [];
        }
    }
    const audio_limit = 10;
    if (e.file.type.indexOf('audio') === 0) {
        const isLt = sizeM <= audio_limit;
        if (!isLt) {
            // setFileLists([]);
            message.error(`${e.file.name} 音频文件大小不能超过${audio_limit}M`);
            return [];
        }
    }
    const video_limit = 100;
    if (e.file.type.indexOf('video') === 0) {
        const isLt = sizeM <= video_limit;
        if (!isLt) {
            // setFileLists([]);
            message.error(`${e.file.name} 视频文件大小不能超过${video_limit}M`);
            return [];
        }
    }
    formData.append('file', e.file)
    // console.log('UploadMint event:', e);
    return e && e.fileList;
};

const onSubmit = (values) => {
    // console.log(values)
    let token=localStorage.getItem('token')
    formData.append('token', token)
    formData.append('work_name', values.work_name)
    formData.append('introduction', values.introduction)
    fetch(ApiUtil.API_UPLOAD, {
        //fetch请求
        method: 'POST',
        body: formData
    }).then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.responseCode === 200&&result.message==='上传成功') {
                message.success('NTF铸造信息提交成功,正在火速为您审核中~');
            }
            else if(result.responseCode === -1&&result.token_message==='未登录'){
                message.error('登陆状态无效或未登录,请重新登陆~');
                //清除存储的无效登陆信息
                localStorage.removeItem('token')
                localStorage.removeItem('user_name')
                window.location.href='/login'
            }
            else if(result.responseCode === -1&&result.detail_message==='文件类型不合格'){
                message.error('作品格式不符合要求,请重新上传作品~');
            }
            else {
                message.error('NTF铸造信息提交失败,请重新提交~');
            }
        })
    .catch(function (error) {
        // console.log(error);
    });
};


const UploadMint = () => {
    return (
        <div>
            <div className="card mt-1">
                <div className="card-body align-items-center d-flex justify-content-center">
                    <h5>
                        上传你的作品，让你的作品独一无二！
                    </h5>
                </div>
            </div>
            <Form {...layout} name="nest-messages" onFinish={onSubmit}>
                <Form.Item
                    name="upload-file"
                    label='文件上传'
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[
                        {
                            required: true,
                            message:'请上传您的作品!'
                        },
                    ]}>
                    <Dragger {...props} >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">单击或拖动文件到此区域以上载</p>
                        <p className="ant-upload-hint">
                            支持单次或批量上传,仅支持图片、音频或视频
                        </p>
                    </Dragger>
                </Form.Item>
                <Form.Item
                    name="work_name"
                    label="作品名称"
                    rules={[
                        {
                            required: true,
                            message:'请输入您的作品名称!'
                        },
                    ]}
                >
                    <Input maxlength="20" placeholder="作品名称"/>
                </Form.Item>
                <Form.Item name='introduction' label="作品介绍">
                    <Input.TextArea maxlength="1000" placeholder="请输入您的作品描述"/>
                </Form.Item>
                <Form.Item wrapperCol={{...layout.wrapperCol, offset: 6}}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </div>

    );

}

export default UploadMint;
