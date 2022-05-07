import React from "react";
import {InboxOutlined} from '@ant-design/icons';
import {Button, Form, Input, message, Modal, Select, Upload} from 'antd';
import {reqCategories, uploadMint} from "../../api/API";
import FileViewer from "react-file-viewer";
import {ALLOWED_EXTENSIONS} from "../../constants/constants";
import "./UploadMint.less"
import storageUtils from "../../utils/storageUtils";
import ModelViewer from "../ModelViewer/ModelViewer";

const {Option} = Select;
const {Dragger} = Upload;

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
    // accept: "image/*,video/*,audio/*",
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


class UploadMint extends React.Component {
    constructor(props) {
        super(props);
        this.file_type = ''
        this.state = {
            previewVisible: false,
            previewTitle: '',
            previewContent: null,
            data: null,
        }
    }
    
    //处理确认,使用预览框的文件
    handleOk = () => {
        this.setState({previewVisible: false});
        //暂停播放
        const player = document.getElementById('previewId')
        if (player) {
            player.pause()
        }
    }
    
    //处理取消,不使用使用预览框的文件
    handleCancel = () => {
        this.setState({previewVisible: false})
        //点击外部删除按钮,删除提交的文件
        let delete_button = document.getElementsByClassName("ant-btn ant-btn-text ant-btn-sm ant-btn-icon-only ant-upload-list-item-card-actions-btn")[0];
        if (delete_button) {
            delete_button.click();
        }
        //暂停播放
        const player = document.getElementById('previewId')
        if (player) {
            player.pause()
        }
    }

    //提交整个表单,此时才上传文件
    onSubmit = async (values) => {
        // console.log(values)
        let token = storageUtils.getToken()
        let user_data = storageUtils.getUser()
        // console.log(user_data)
        formData.append('token', token)
        formData.append('user_data', JSON.stringify(user_data))
        formData.append('work_name', values.work_name)
        formData.append('price', values.price)
        formData.append('introduction', values.introduction)
        formData.append('category_id', values.category_id)
    
        // this.file_type
        const result = await uploadMint(formData)
        // console.log(result)
        if (result.status === 0 && result.message === '上传成功') {
            message.success('NTF铸造信息提交成功,正在火速为您审核中~');
        } else if (result.status === -1 && result.token_message === '未登录') {
            message.error('登陆状态无效或未登录,请重新登陆~');
            //清除存储的无效登陆信息
            storageUtils.removeToken()
            storageUtils.removeUser()
            window.location.href = '/login'
        } else if (result.status === -1 && result.detail_message === '文件类型不合格') {
            message.error('作品格式不符合要求,请重新上传作品~');
        } else {
            message.error('NTF铸造信息提交失败,请重新提交~');
        }
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
            let src, previewContent, type = file.type;
            //文件扩展名
            const ext = file.name.substring(file.name.lastIndexOf('.') + 1);
            let isValid = false
            let item
            for (item in ALLOWED_EXTENSIONS) {
                if (ALLOWED_EXTENSIONS[item] === ext) {
                    isValid = true
                }
            }
            if (!isValid) {
                message.error(`${file.name} 需为指定格式的图片、视频、音频或文本`);
                return [];
            }
    
            //校验文件大小
            let size = file.size;
            let sizeM = size / 1024 / 1024;
            // console.log(sizeM)
            const image_limit = 10;
            const audio_limit = 50;
            const video_limit = 80;
            const text_limit = 50;
            // 获取当前文件的一个内存URL
            src = URL.createObjectURL(file)
            if (/^image\/\S+$/.test(type)) {
                const isLt = sizeM <= image_limit;
                if (!isLt) {
                    message.error(`${file.name} 图片文件大小不能超过${image_limit}M`);
                    return [];
                } else {
                    //根据文件类型个性生成预览组件
                    previewContent = <img src={src} alt='上传的图片'/>
                    this.file_type = 'image'
                }
            }else if (/^video\/\S+$/.test(type)) {
                const isLt = sizeM <= video_limit;
                if (!isLt) {
                    message.error(`${file.name} 视频文件大小不能超过${audio_limit}M`);
                    return [];
                }else {
                    previewContent = <video src={src} id="previewId" loop controls preload/>
                    this.file_type = 'video'
                }
            }else if (/^audio\/\S+$/.test(type)) {
                const isLt = sizeM <= audio_limit;
                if (!isLt) {
                    message.error(`${file.name} 音频文件大小不能超过${video_limit}M`);
                    return [];
                } else {
                    previewContent = (
                        <audio id="previewId" controls preload>
                            <source src={src}/>
                            <embed src={src}/>
                        </audio>
                    )
                    this.file_type = 'audio'
                }
            } else if (ext === 'docx' || ext === 'pdf') {
                const isLt = sizeM <= text_limit;
                if (!isLt) {
                    message.error(`${file.name} 文本文件大小不能超过${video_limit}M`);
                    return [];
                } else {
                    previewContent = (
                        <FileViewer
                            fileType={ext}
                            filePath={src}
                        />
                    )
                    this.file_type = 'text'
                }
            } else if (ext === 'glb') {
                previewContent = (
                    <ModelViewer
                        src={src}
                    />
                )
                this.file_type = 'model'
            } else {
                previewContent = (
                    <FileViewer
                        fileType={ext}
                        filePath={src}
                    />
                )
                this.file_type = 'else'
            }
            this.setState({ previewVisible:true,previewTitle: file.name, data: file, previewContent: previewContent })
            //确保传输的文件只有一个
            formData = new FormData()
            formData.append('file', file)
            // console.log(formData)
            // console.log('UploadMint event:', e);
            return e && e.fileList;
        }

    };


    getCategorys = async () => {
        const result = await reqCategories()
        if (result.status === 0) {
            // 成功
            // 取出分类列表
            const categorys = result.data
            // 更新状态categorys数据
            this.setState({
                categorys
            })
        } else {
            message.error('获取分类列表失败')
        }
    }

    //渲染选择组件
    renderCategoryOption() {
        const categorys = this.state.categorys || [{}]
        return categorys.map(item =>
            <Option value={item.category_id}>{item.category_name}</Option>
        )
    }

    componentDidMount() {
        //获取分类选择列表数据
        this.getCategorys()
    }

    render() {
        const {previewContent, previewVisible, previewTitle} = this.state;
        return (
            <div className='upload-mint'>
                <div>
                    <div className='content-mainTitle'>
                        <span>上传你的作品，让你的<span id='nft_name' style={{fontSize: 32}}>作品</span>独一无二！</span>
                    </div>
                </div>
                {/*<ModelViewer*/}
                {/*    src={'http://localhost:5000/upload_folder/1.glb'}*/}
                {/*/>*/}
                <Form {...layout} onFinish={this.onSubmit}>
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
                                支持单次或批量上传,仅支持图片、音频、视频或文本
                            </p>
                            <p className="ant-upload-hint">
                                (具体为bmp,png,gif,jpg,jpeg,mp4,mp3,docx,pdf,glb格式)
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
                        <Input maxlength="20" placeholder="数藏万物名称"/>
                    </Form.Item>
                    <Form.Item
                        name="category_id"
                        label="作品分类"
                        rules={[
                            {
                                required: true,
                                message: '请选择您的作品分类!'
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="请选择您的作品分类"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {this.renderCategoryOption()}
                        </Select>
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
                        <Input type="number" placeholder="请输入价格"/>
                    </Form.Item>
                    <Form.Item name='introduction' label="作品介绍">
                        <Input.TextArea maxlength="100" placeholder="请输入您的作品描述"/>
                    </Form.Item>
                    <Form.Item wrapperCol={{...layout.wrapperCol, offset: 6}}>
                        <Button type="primary" htmlType="submit">
                            提交审核
                        </Button>
                    </Form.Item>
                </Form>
                <Modal
                    className='preview-modal'
                    width='600px'
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
