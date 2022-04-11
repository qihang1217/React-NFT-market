import React from "react";
import {InboxOutlined} from '@ant-design/icons';
import {Button, Form, Input, InputNumber, message, Modal, Upload} from 'antd';
import ApiUtil from "../../utils/ApiUtil";

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
    accept: "image/*,video/*,audio/*",
    maxCount: 1,
    listType:'picture',
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


class UploadMint extends React.Component{
    state = {
        previewVisible: false,
        previewTitle: '',
        previewContent: null,
        data: null,
    }

    handleOk = () => this.setState({ previewVisible: false });

    handleCancel = () => {
        this.setState({ previewVisible: false })
        //点击外部删除按钮,删除提交的文件
        let delete_button = document.getElementsByClassName("ant-btn ant-btn-text ant-btn-sm ant-btn-icon-only ant-upload-list-item-card-actions-btn")[0];
        delete_button.click();
    }

    //提交整个表单,此时才上传文件
    onSubmit = (values) => {
        console.log(values)
        let token = localStorage.getItem('token')||''
        let user_data=localStorage.getItem('user_data') || {}
        // console.log(user_data)
        formData.append('token', token)
        formData.append('user_data',user_data)
        formData.append('work_name', values.work_name)
        formData.append('price', values.price)
        formData.append('introduction', values.introduction)
        fetch(ApiUtil.API_UPLOAD, {
            //fetch请求
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(result => {
                console.log(result)
                if (result.status === 0 && result.message === '上传成功') {
                    message.success('NTF铸造信息提交成功,正在火速为您审核中~');
                } else if (result.status === -1 && result.token_message === '未登录') {
                    message.error('登陆状态无效或未登录,请重新登陆~');
                    //清除存储的无效登陆信息
                    localStorage.removeItem('token')
                    localStorage.removeItem('user_name')
                    window.location.href = '/login'
                } else if (result.status === -1 && result.detail_message === '文件类型不合格') {
                    message.error('作品格式不符合要求,请重新上传作品~');
                } else {
                    message.error('NTF铸造信息提交失败,请重新提交~');
                }
            })
            .catch(function (error) {
                // console.log(error);
            });
    };


    validatePrice=(rule,value)=>{
        if(value===''){
            return Promise.reject()
        }else if(value*1<=0){
            return Promise.reject('价格必须大于0')
        }else{
            return Promise.resolve()
        }
    }


    normFile = (e) => {
        // console.log(e)
        let file=e.file
        if(file.originFileObj){
            //删除文件时
            file=file.originFileObj
        }
        else {
            //添加文件时

            //校验文件类型
            let src,previewContent,type=file.type;
            const isSatisfy = /^image\/\S+$/.test(type) || /^video\/\S+$/.test(type) || /^audio\/\S+$/.test(type)||/^text\/\S+$/.test(type);
            if (!isSatisfy) {
                message.error(`${file.name} 需为图片、视频、音频或文本`);
                return [];
            }

            //校验文件大小
            let size = file.size;
            let sizeM = size / 1024 / 1024;
            // console.log(sizeM)
            const image_limit = 10;
            const audio_limit = 10;
            const video_limit = 100;
            const text_limit = 10;
            if (/^image\/\S+$/.test(type)) {
                const isLt = sizeM <= image_limit;
                if (!isLt) {
                    message.error(`${file.name} 图片文件大小不能超过${image_limit}M`);
                    return [];
                }else{
                    // 获取当前文件的一个内存URL
                    src = URL.createObjectURL(file)
                    //根据文件类型个性生成预览组件
                    previewContent = <img src={src} alt='上传的图片' />
                }
            }else if (/^video\/\S+$/.test(type)) {
                const isLt = sizeM <= video_limit;
                if (!isLt) {
                    message.error(`${file.name} 视频文件大小不能超过${audio_limit}M`);
                    return [];
                }else{
                    src = URL.createObjectURL(file)
                    previewContent = <video src={src} autoPlay loop controls />
                }
            }else if (/^audio\/\S+$/.test(type)) {
                const isLt = sizeM <= audio_limit;
                if (!isLt) {
                    message.error(`${file.name} 音频文件大小不能超过${video_limit}M`);
                    return [];
                }else{
                    src = URL.createObjectURL(file)
                    previewContent = (
                        <audio controls autoPlay>
                            <source src={src}/>
                            <embed src={src}/>
                        </audio>
                    )
                }
            }else if (/^text\/\S+$/.test(type)) {
                const isLt = sizeM <= text_limit;
                if (!isLt) {
                    message.error(`${file.name} 文本文件大小不能超过${video_limit}M`);
                    return [];
                }else{
                    const self = this;
                    const reader = new FileReader();
                    reader.readAsText(file);
                    //注：onload是异步函数，此处需独立处理
                    reader.onload = function (e) {
                        previewContent = <textarea value={this.result} readOnly/>
                        self.setState({ previewVisible:true,previewTitle: file.name, data: file, previewContent: previewContent })
                    }
                    return;
                }

            }
            this.setState({ previewVisible:true,previewTitle: file.name, data: file, previewContent: previewContent })
            //确保传输的文件只有一个
            formData=new FormData()
            formData.append('file', file)
            // console.log(formData)
            // console.log('UploadMint event:', e);
            return e && e.fileList;
        }

    };


    render() {
        const {previewContent ,previewVisible,previewTitle} = this.state;
        return (
            <div>
                <div className="card mt-1">
                    <div className="card-body align-items-center d-flex justify-content-center">
                        <h5>
                            上传你的作品，让你的作品独一无二！
                        </h5>
                    </div>
                </div>
                <Form {...layout} name="nest-messages" onFinish={this.onSubmit}>
                    <Form.Item
                        name="upload-file"
                        label='文件上传'
                        valuePropName="fileList"
                        getValueFromEvent={this.normFile}
                        rules={[
                            {
                                required: true,
                                message: '请上传您的作品!'
                            },
                        ]}>
                        <Dragger
                            {...props}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">单击或拖动文件到此区域以上传</p>
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
                                message: '请输入您的作品名称!'
                            },
                        ]}
                    >
                        <Input maxlength="20" placeholder="作品名称"/>
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="价格"
                        initialValue=''
                        rules={[
                            {
                                required: true,
                                message: '请输入价格!',
                            },
                            {
                                validator:this.validatePrice
                            },
                        ]}
                    >
                        <InputNumber/>
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
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    okText='确定使用'
                    cancelText='换一个'
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                >
                    {previewContent}
                </Modal>

            </div>

        );
    }

}

export default UploadMint;
