import React, {Component} from "react";
import icon from "./favicon-32x32.png";
import {Link} from "react-router-dom";
import {Avatar, Badge, Layout, Menu} from 'antd';
import "./Navbar.css"
import {
    BankTwoTone,
    CloseSquareTwoTone,
    HeartTwoTone,
    IdcardTwoTone,
    SettingTwoTone,
    UserOutlined
} from '@ant-design/icons';

const {Header} = Layout;
const {SubMenu} = Menu;
//菜单项数据
const tabItems = [
    {
        toPath: '/mint',
        title: 'Mint NFT',
    },
    {
        toPath: '/upload_mint',
        title: 'upload_mint',
    },
    {
        toPath: '/color_mint',
        title: 'color_mint',
    },
    {
        toPath: '/marketplace',
        title: 'Marketplace',
    },
    {
        toPath: '/my-tokens',
        title: 'My Tokens',
    },
    {
        toPath: '/queries',
        title: 'Queries',
    },
    {
        toPath: '/museum',
        title: 'NTF博物馆',
    },
]


class Navbar extends Component {
    constructor(props) {
        super(props);
    }

    //渲染菜单栏数据方法
    renderTabBarItems() {
        return tabItems.map(item =>
            <Menu.Item key={item.toPath}>
                <Link to={item.toPath}>
                    {item.title}
                </Link>
            </Menu.Item>)
    }

    render() {
        return (
            <Layout className="layout">
                <Header theme="light">
                    <div className="logo">
                        <img src={icon} alt="logo" className="logoImage"/>
                        <Link to="/" className="brand">
                            NFT's
                        </Link>
                    </div>
                    <Menu theme="light" mode="horizontal" defaultSelectedKeys={['2']}>
                        {/*代码重构封装*/}
                        {this.renderTabBarItems()}
                        <SubMenu key="SubMenu" style={{"align-items": "center"}}
                                 title={
                                     <>
                                         <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                             <Badge count={1}>
                                                 <Avatar shape="square" icon={<UserOutlined/>}/>
                                             </Badge>
                                         </a>
                                     </>
                                 }>
                            <Menu.Item key="1" icon={<IdcardTwoTone/>}>
                                <Link to='/my'>
                                    主页
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2" icon={<HeartTwoTone/>}>
                                <Link to='/my'>
                                    喜欢
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="3" icon={<BankTwoTone/>}>
                                <Link to='/my'>
                                    我的NFT
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="4" icon={<SettingTwoTone/>}>
                                <Link to='/'>
                                    设置
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="5" icon={<CloseSquareTwoTone/>}>
                                <Link to='/'>
                                    退出登陆
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Header>
            </Layout>
        );
    }
};

export default Navbar;
