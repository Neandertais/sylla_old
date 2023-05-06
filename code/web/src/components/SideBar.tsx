import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{minHeight:'100vh'}}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleSidebar}
        theme="light"
        style={{
          background: '#fff',
          position: 'absolute',
          marginTop: '0.5px', 
          left: 0,
          height: '100vh',
        }}
      
    >
      <div className="logo" />
      <Menu theme="light" mode="inline" className='mt-8'>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          Profile
        </Menu.Item>
        <Menu.Item key="3" icon={<SettingOutlined />}>
          Settings
        </Menu.Item>
      </Menu>
    </Sider>
    </Layout>
    
  );
};

export default Sidebar;
