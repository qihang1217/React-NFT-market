import React, {Component} from "react";
import icon from "./favicon-32x32.png";
import {Link} from "react-router-dom";
import {Layout, Menu} from 'antd';
import "./Navbar.css"


const {Header} = Layout;
//菜单项数据
const tabItems = [
    {
        toPath: '/',
        title: 'Home',
    },
    {
        toPath: '/mint',
        title: 'Mint NFT',
    },
    {
        toPath: '/color_mint',
        title: 'Mint Color NFT',
    },
    {
        toPath: '/upload_mint',
        title: 'Upload File To NFT',
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
    {
        toPath: '/my',
        title: '我的',
    }
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
                <Header>
                    <div className="logo">
                        <img src={icon} alt="logo"/>
                        <Link to="/" className="brand">
                            NFT's
                        </Link>
                    </div>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        {/*代码重构封装*/}
                        {this.renderTabBarItems()}
                    </Menu>
                </Header>
            </Layout>
        );
    }
};

export default Navbar;
