import { useState } from 'react';
import { Tabs } from 'antd';
import TabHome from './components/TabHome.jsx';
import {
  //
  APR,
  // AccountBook,
} from './components/TabComp.jsx';
import './index.css';

export default function App() {
  // console.log('APSPage props===', props);

  const [tabKey, setTabKey] = useState('0');
  // const [username, setUsername] = useState('--');

  const renderTabs = (tabs, tabProps) =>
    tabs.map(tab => {
      const {
        key,
        label,
        children,
        render: Render,
        // renderWrapper: RenderWrapper = ({ children }) => (
        //   <div
        //     style={{
        //       padding: '0 15px',
        //       height: 'calc(100vh - 189px)',
        //       overflowY: 'scroll',
        //     }}
        //   >
        //     {children}
        //   </div>
        // ),
        ...reset
      } = tab;
      return (
        <Tabs.TabPane key={key} tab={label} closable={tabs.length !== 1} {...reset}>
          <div
            style={{
              padding: '0 15px',
              // height: 'calc(100vh - 189px)',
              height: 'calc(100vh - 109px)',
              overflowY: 'scroll',
            }}
          >
            {Render ? <Render {...tabProps} /> : children}
          </div>
        </Tabs.TabPane>
      );
    });

  const [items, setItems] = useState([
    {
      label: 'APS首頁',
      render: TabHome,
      key: '0',
    },
    // {
    //   label: 'APR配置',
    //   render: APR,
    //   key: '1',
    // },
    // {
    //   label: '账本--测试',
    //   render: AccountBook,
    //   key: '3',
    // },
  ]);
  const add = item => {
    const newKey = `${new Date().getTime()}`;
    const newPanes = [...items];
    newPanes.push(
      item
        ? {
          ...item,
          key: newKey,
        }
        : {
          label: 'APS首頁',
          render: TabHome,
          key: newKey,
        },
    );
    setItems(newPanes);
    setTabKey(newKey);
  };
  const remove = targetKey => {
    const newPanes = items.filter(item => `${item.key}` !== `${targetKey}`);
    const targetTabIndex = items.findIndex(item => `${item.key}` === `${targetKey}`);
    const nextTabKey =
      items.length === targetTabIndex + 1
        ? items[targetTabIndex - 1].key
        : items[targetTabIndex + 1].key;
    setItems(newPanes);
    targetKey === tabKey && setTabKey(nextTabKey);
  };
  const onEdit = (targetKey, action) => {
    console.log('onedit', action, targetKey);
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };
  const onChange = tabK => {
    setTabKey(tabK);
  };

  // useEffect(() => {
  //   const cookie = document.cookie;
  //   const [userCode] = cookie.match(/(?<=username=)\d+/) || [];
  //   setUsername(userCode);
  // }, []);
  return (
    <Tabs
      //
      type='editable-card'
      activeKey={tabKey}
      onChange={onChange}
      onEdit={onEdit}
    >
      {renderTabs(items, { onTabAdd: add })}
    </Tabs>
  );
}
