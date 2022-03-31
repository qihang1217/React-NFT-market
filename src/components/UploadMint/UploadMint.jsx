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
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    beforeUpload() {
        return false;
    },
};

const validateMessages = {
    required: '${label} is required!',
};

var formData = new FormData();

const normFile = (e) => {
    let size = e.file.size;
    let sizeM = size / 1024 / 1024;
    // console.log(e.file.type)
    const isSatisfy = (e.file.type.indexOf('image') === 0 || e.file.type.indexOf('video') === 0|| e.file.type.indexOf('audio') === 0);
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
    console.log(values)
    fetch(ApiUtil.API_UPLOAD, {
        //fetch请求
        method: 'POST',
        body: formData,
    }).then(function (response) {
        if (response.status === 200) {
            message.success('NTF铸造信息提交成功,正在火速为您审核中~');
        } else {
            message.error('NTF铸造信息提交失败,请重新提交~');
        }
    }).catch(function (error) {
        console.log(error);
    });
};


const UploadMint = () => {
    return (
        <div>
            <div className="card mt-1">
                <div className="card-body align-items-center d-flex justify-content-center">
                    <h5>
                        UPLOAD YOUR WORK TO MAKE YOUR WORK UNIQUE!
                    </h5>
                </div>
            </div>
            <Form {...layout} name="nest-messages" validateMessages={validateMessages} onFinish={onSubmit}>
                <Form.Item
                    name="upload-file"
                    label='文件上传'
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[
                        {
                            required: true,
                        },
                    ]}>
                    <Dragger {...props} >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading company data or
                            other
                            band files
                        </p>
                    </Dragger>
                </Form.Item>
                <Form.Item
                    name={['user', 'name']}
                    label="Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input maxlength="20" placeholder="作品名称"/>
                </Form.Item>
                <Form.Item name={['user', 'introduction']} label="Introduction">
                    <Input.TextArea maxlength="1000" placeholder="Provide a detailed description of your item."/>
                </Form.Item>
                <Form.Item wrapperCol={{...layout.wrapperCol, offset: 6}}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>

    );

}

export default UploadMint;
