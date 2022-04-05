import React, {Component} from "react";
import icon from "./favicon-32x32.png";
import {Link, withRouter} from "react-router-dom";
import {Avatar, Badge, Icon, Layout, Menu} from 'antd';
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
        key: '/mint',
        title: 'Mint NFT',
    },
    {
        key: '/upload_mint',
        title: 'upload_mint',
    },
    {
        key: '/color_mint',
        title: 'color_mint',
    },
    {
        key: '/marketplace',
        title: 'Marketplace',
    },
    {
        key: '/my-tokens',
        title: 'My Tokens',
    },
    {
        key: '/queries',
        title: 'Queries',
    },
    {
        key: '/museum',
        title: 'NTF博物馆',
    },
]


class Navbar extends Component {
    constructor(props) {
        super(props);
    }

    renderTabBarItems(tabItems) {
        return tabItems.map(item =>
            <Menu.Item key={item.key}>
                <Link to={item.key}>
                    {item.title}
                </Link>
            </Menu.Item>)
    }

    render() {
        const selectKey = this.props.location.pathname
        return (
            <Layout className="layout">
                <Header theme="light">
                    <div className="logo">
                        <img src={icon} alt="logo" className="logoImage"/>
                        <Link to="/" className="brand">
                            NFT's
                        </Link>
                    </div>
                    <Menu theme="light" mode="horizontal" defaultSelectedKeys={[selectKey]}>
                        {/*代码重构封装*/}
                        {this.renderTabBarItems(tabItems)}
                        <SubMenu key="SubMenu" style={{"align-items": "center"}}
                                 title={
                                        <Avatar shape="square" icon={<UserOutlined/>}/>
                                 }
                        >
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

export default withRouter(Navbar);
