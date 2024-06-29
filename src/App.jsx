import { Link, Outlet } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './App.css';

const {
  //
  Header,
  Content,
  // Footer,
} = Layout;

function App() {
  
  return (
    <Layout className='layout'>
      <Header
        theme='light'
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          height: '46px',
          width: '100%',
          display: 'flex',
          background: '#fff',
          padding: '0 20px',
        }}
      >
        <div
          className='logo'
          style={{
            marginRight: '25px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              margin: 0,
              color: '#006fb8',
              fontWeight: 'bold',
              fontSize: '20px',
              lineHeight: '100%',
            }}
          >
            WorkWebBoard平台
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Menu
            theme='light'
            mode='horizontal'
            defaultSelectedKeys={window.location.hash.replace('#/', '')}
          // onClick={({ item, key, keyPath, domEvent }) => {
          //   console.log('dddddddd', item, key, keyPath, domEvent);
          // }}
          >
            <Menu.Item key='WWB'>
              <Link to='WWB'>首页</Link>
            </Menu.Item>
            <Menu.Item key='FileUpload'>
              <Link to='FileUpload'>FileUpload系统</Link>
            </Menu.Item>
            <Menu.Item key='PocketBook'>
              <Link to='PocketBook'>PocketBook记账本</Link>
            </Menu.Item>
          </Menu>
        </div>
      </Header>
      <Content>
        <Outlet />
      </Content>
      {/* <Footer
        style={{
          textAlign: 'center',
        }}
      >
        WorkWebBoard ©2024 Created by SonderDu
      </Footer> */}
    </Layout>
  );
}

export default App;
