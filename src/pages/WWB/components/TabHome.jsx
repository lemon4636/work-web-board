/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import {
  //
  Card,
  Modal,
  Spin,
  Table,
  Select,
  message,
  Form,
  Input,
  Switch,
  Button,
  Badge,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import request from '@/api/APS';
import { APR, LoadingProvider } from './TabComp';
import DomainMgr from '../../DomainMgr';

export default function TabHome(props) {
  const { onTabAdd } = props;
  const [apsNodeInfo, setApsNodeInfo] = useState({});
  const [apsNodeList, setApsNodeList] = useState([]);
  const [apsBookmarkGroupTags, setApsBookmarkGroupTags] = useState([]);
  const [apsBookmarkList, setApsBookmarkList] = useState([]);
  const [apsBookmarkListAll, setApsBookmarkListAll] = useState([]);
  const [msgBoxList, setMsgBoxList] = useState([]);
  const [apsBookmarkListLoading, setApsBookmarkListLoading] = useState(false);
  const [apsResLoading, setApsResLoading] = useState(false);
  const [apsLoginLoading, setApsLoginLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const addBookmarkFormRef = useRef(null);
  const addMsgBoxFormRef = useRef(null);
  const currentShowUser = userInfo.empId || '0000148379';

  const BookItem = itemProps => {
    const { item: ele = {} } = itemProps;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '105px',
          padding: '10px',
          textAlign: 'center',
          cursor: 'pointer',
        }}
        onClick={() =>
          onTabAdd &&
          onTabAdd({
            ...ele,
            label: ele.bookmarkName,
            children: (
              <React.Fragment>
                {!ele.readOnly && (
                  <p>
                    {ele.bookmarkName}
                    <Popconfirm
                      //
                      title='确认刪除？'
                      onConfirm={() => deleteBookmark(ele)}
                    >
                      <Button danger type='link'>
                        刪除
                      </Button>
                    </Popconfirm>
                    <Button
                      type='link'
                      onClick={() =>
                        onBookmarkAddModal({
                          ...ele,
                        })
                      }
                    >
                      編輯
                    </Button>
                  </p>
                )}
                <Input.TextArea
                  readOnly
                  autoSize
                  style={{
                    background: 'none',
                  }}
                  value={ele.desc}
                />
                <p>
                  <a target='_blank' href={ele.bookmarkAddr}>
                    {ele.bookmarkAddr}
                  </a>
                </p>
                {!!ele.isLocalApp && (
                  <iframe
                    style={{
                      width: '100%',
                      height: '80vh',
                    }}
                    src={ele.bookmarkAddr}
                  />
                )}
              </React.Fragment>
            ),
            ...(ele.children && { children: ele.children }),
            ...(ele.render && { render: ele.render }),
          })
        }
        tabIndex='0'
        role='button'
      >
        <Badge count={ele.bookmarkGroup && ele.bookmarkGroup[0]} overflowCount={990000}>
          <img
            src={
              ele.icon ||
              (ele.isLocalApp
                ? 'data:image/png;base64,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'
                : 'data:image/png;base64,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')
            }
            style={{
              display: 'inline-block',
              width: '46px',
              height: '46px',
            }}
          />
        </Badge>
        <div
          style={{
            wordBreak: 'break-all',
          }}
        >
          {ele.bookmarkName && ele.bookmarkName.substr(0, 11)}
          {ele.bookmarkName && ele.bookmarkName.substr(11, 12) && '...'}
        </div>
      </div>
    );
  };

  useEffect(() => {
    // getApsNodeInfo();
    // getUserInfo();
    // getApsNodeList();
    getBookmarkList();
    getMsgBoxList();
  }, []);

  // const getCrmService = async () => {
  //   const res = await request(`/gw/crm_c/getUserInfoBySccService.json`, {});
  //   console.log('paramMaintenanceService', res);
  // };
  const getApsNodeInfo = async () => {
    setApsResLoading(true);
    const res = await request(`/crm-app/getApsBoardRes`, {});
    setApsNodeInfo({
      ...res,
    });
    setApsResLoading(false);
  };
  const getLogin = async userCode => {
    setApsLoginLoading(true);
    const res =
      (await request(`/crm-app/base/login.json`, {
        invoke: 'setCookies',
        pds: '21218cca77804d2ba1922c33e0151105',
        uz: userCode || currentShowUser,
      })) || {};
    const { returnCode } = res.reply || {};
    const { type } = returnCode || {};
    if (type !== 'S') {
      message.error('APS登录失敗！');
      setApsLoginLoading(false);
      return null;
    }
    message.success('APS登录成功！');
    const info = (await getUserInfo()) || {};
    setApsLoginLoading(false);
    alert(`APS登录成功：${info.empId}${info.userName}`);
  };
  const getUserInfo = async () => {
    const userInfoRes = (await request(`/crm-app/base/getHomePageUserInfo`, {})) || {};
    const { data: info } = userInfoRes.reply || {};
    setUserInfo(info || {});
    return info || {};
  };
  const getApsNodeList = async () => {
    // setApsResLoading(true);
    const res2 = await request(`/crm-app/getApsNodeList`, {});
    // setApsResLoading(false);
    setApsNodeList(res2);
  };
  // const getUserName = async () => {
  //   const cookie = document.cookie;
  //   const [userCode] = cookie.match(/(?<=username=)\d+/) || [];
  //   setCookieUsername(userCode);
  // };
  const getBookmarkList = async () => {
    setApsBookmarkListLoading(true);
    const res = (await request(`/crm-app/getBookmarkList`, {})) || [];
    const groupTagsAllArr =
      res && res.length ? res.reduce((acc, cur) => [...acc, ...(cur.bookmarkGroup || [])], []) : [];
    setApsBookmarkGroupTags(Array.from(new Set(groupTagsAllArr)));
    setApsBookmarkListLoading(false);
    setApsBookmarkList(res);
    setApsBookmarkListAll(res);
  };
  const updateApsNode = async node => {
    const { name, target } = node || {};
    setApsResLoading(true);
    try {
      const res = await request(
        `/crm-app/updateApsNode?name=${name}&target=${encodeURIComponent(
          target,
        )}&secret=yZ2bCOokMi6zvJWhfIh4M69jnwGK0HvOKifze0jOcrJORP5ELJkO3GBWp7oQCcuh4wnLo17DisSn8`,
        node,
      );
      if (res.ok) {
        message.success('節點切換成功');
        getApsNodeInfo();
        await getLogin();
      } else {
        message.error('節點切換失敗');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setApsResLoading(false);
    }
  };
  const addBookmark = async bookmark => {
    const { id } = bookmark || {};
    const idNew = `${new Date().getTime()}`;
    const res = await request('/crm-app/addBookmark', {
      ...bookmark,
      id: id || idNew,
      // bookmarkAddr: encodeURIComponent(bookmarkAddr),
      // desc: encodeURIComponent(desc),
    });
    if (res.ok) {
      message.success('新增成功');
    } else {
      message.error('新增失败');
    }
  };
  const deleteBookmark = async bookmark => {
    const { id = '' } = bookmark || {};
    const res = await request(`/crm-app/deleteBookmark?id=${id}`, bookmark);
    console.log('res', res);
    if (res.ok) {
      message.success('刪除成功');
    } else {
      message.error('刪除失敗');
    }
  };
  const getMsgBoxList = async () => {
    const { ok, msg, data } = (await request(`/crm-app/getMsgBoxList`)) || {};
    setMsgBoxList(data || []);
    !ok && message[ok ? 'success' : 'error'](msg);
  };
  const addMsgBox = async vals => {
    const { content } = vals || {};
    const contentNew = encodeURIComponent(content || '');
    const { ok, msg } = (await request(`/crm-app/addMsgBox?content=${contentNew}`, {})) || {};
    message[ok ? 'success' : 'error'](msg);
  };
  const deleteMsgBox = async index => {
    const { ok, msg } = (await request(`/crm-app/deleteMsgBox`, { index })) || {};
    message[ok ? 'success' : 'error'](msg);
    ok && (await getMsgBoxList());
  };

  const onApsNodeModal = () => {
    let apsNodeSelected2 = null;
    Modal.confirm({
      title: '選擇APS結點',
      width: 500,
      icon: '',
      maskClosable: true,
      //   okButtonProps: { disabled: !apsNodeSelected },
      content: (
        <Table
          dataSource={apsNodeList}
          rowKey={row => row.target}
          rowSelection={{
            // columnWidth: '60px',
            type: 'radio',
            // getCheckboxProps: row => {
            //   return { row };
            // },
            // selectedRowKeys,
            onChange: (key, row) => {
              // setApsNodeSelected(row[0]);
              apsNodeSelected2 = row[0];
            },
          }}
          columns={[
            {
              title: '序号',
              dataIndex: 'IDX',
              render: (val, row, index) => index + 1,
            },
            {
              title: '結點名稱',
              dataIndex: 'name',
            },
            {
              title: '結點地址',
              dataIndex: 'target',
            },
          ]}
        />
      ),
      onOk() {
        if (apsNodeSelected2) {
          console.log('OK', apsNodeSelected2);
          updateApsNode(apsNodeSelected2);
        }
      },
      onCancel() {
        console.log('Cancel');
        // setApsNodeSelected(null);
        apsNodeSelected2 = null;
      },
    });
  };
  const onBookmarkAddModal = modalProps => {
    const { id, bookmarkName } = modalProps || {};
    Modal.confirm({
      title: id ? '編輯：' + bookmarkName : '添加書簽',
      width: 800,
      icon: '',
      maskClosable: true,
      //   okButtonProps: { disabled: !apsNodeSelected2 },
      ...modalProps,
      content: (
        <Form ref={addBookmarkFormRef} initialValues={modalProps}>
          <Form.Item name='bookmarkName' label='书签名称' rules={[{ required: true }]}>
            <Input placeholder='请输入' />
          </Form.Item>
          <Form.Item name='bookmarkAddr' label='书签地址' rules={[{ required: true }]}>
            <Input placeholder='请输入' />
          </Form.Item>
          <Form.Item name='bookmarkGroup' label='书签标签'>
            <Select
              mode='tags'
              placeholder='请选择'
              options={apsBookmarkGroupTags.map(ele => ({ label: ele, value: ele }))}
            />
          </Form.Item>
          <Form.Item name='isLocalApp' label='是否本地打开' valuePropName='checked'>
            <Switch />
          </Form.Item>
          <Form.Item name='isSystemApp' label='是否加入应用列表' valuePropName='checked'>
            <Switch />
          </Form.Item>
          <Form.Item name='desc' label='描述'>
            <Input.TextArea placeholder='请输入描述' rows={5} />
          </Form.Item>
        </Form>
      ),
      async onOk() {
        if (addBookmarkFormRef.current) {
          const vals = await addBookmarkFormRef.current.validateFields();
          console.log('OK');
          console.log(vals);
          await addBookmark({
            id,
            ...vals,
          });
          await getBookmarkList();
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const onMsgBoxAddModal = modalProps => {
    const { id, content, contentReadOnly } = modalProps || {};
    Modal.confirm({
      title: id ? '編輯：' + content : '添加留言',
      width: 800,
      icon: '',
      maskClosable: true,
      ...modalProps,
      content: (
        <Form ref={addMsgBoxFormRef} initialValues={modalProps}>
          <Form.Item name='content' label='留言内容'>
            <Input.TextArea placeholder='请输入留言内容' rows={15} readOnly={contentReadOnly} />
          </Form.Item>
        </Form>
      ),
      async onOk() {
        if (addMsgBoxFormRef.current) {
          const vals = await addMsgBoxFormRef.current.validateFields();
          console.log('OK', vals);
          await addMsgBox({
            ...vals,
          });
          await getMsgBoxList();
        }
      },
    });
  };
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <div
        style={{
          //
          flex: 2,
          marginRight: '15px',
        }}
      >
        {/* <Card
          title={
            <p
              style={{
                flexShrink: '0',
                margin: '0 16px 0 0',
                fontSize: '18px',
                color: '#262626',
                fontWeight: '700',
              }}
            >
              APS仪表盘
            </p>
          }
          extra={
            <LoadingProvider>
              <Button
                type='link'
                onClick={() => Promise.all([getApsNodeInfo(), getUserInfo(), getApsNodeList()])}
              >
                刷新
              </Button>
            </LoadingProvider>
          }
          style={{
            borderRadius: '10px',
            flex: 1,
            height: 'fit-content',
            marginBottom: '15px',
            // width: 300,
          }}
        >
          <Spin spinning={apsResLoading}>
            <div
              style={
                {
                  // display: 'flex',
                }
              }
            >
              <div
                style={{
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    fontSize: '15px',
                    letterSpacing: '.47px',
                  }}
                >
                  当前用户：
                  <Select
                    allowClear
                    value={currentShowUser}
                    style={{
                      width: '300px',
                    }}
                    onChange={val => getLogin(val)}
                    options={(apsNodeInfo.apsUserList || []).map(ele => ({
                      ...ele,
                      label: `${ele.userId}--${ele.userName}--${ele.orgName}`,
                      value: ele.userId,
                    }))}
                  />
                  <Button
                    type='link'
                    loading={apsLoginLoading}
                    onClick={() => getLogin()}
                    style={{
                      marginLeft: '20px',
                    }}
                  >
                    登录
                  </Button>
                  <span
                    style={{
                      marginLeft: '20px',
                    }}
                  >
                    {userInfo.userName
                      ? `${userInfo.userName} ${userInfo.orgName} ${userInfo.orgId}`
                      : '未登录'}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                }}
              >
                <p
                  style={{
                    fontSize: '15px',
                    letterSpacing: '.47px',
                    marginRight: '10%',
                  }}
                >
                  結點名稱：{apsNodeInfo.name}
                  <Button
                    type='link'
                    onClick={onApsNodeModal}
                    style={{
                      margin: '0 20px',
                    }}
                  >
                    切換結點
                  </Button>
                </p>
                <p
                  style={{
                    fontSize: '15px',
                    letterSpacing: '.47px',
                  }}
                >
                  結點地址：{apsNodeInfo.target}
                </p>
              </div>
            </div>
          </Spin>
        </Card> */}
        <Card
          title={
            <p
              style={{
                flexShrink: '0',
                margin: '0 16px 0 0',
                fontSize: '18px',
                color: '#262626',
                fontWeight: '700',
              }}
            >
              应用列表
            </p>
          }
          // extra={<a href='#'>More</a>}
          style={{
            borderRadius: '10px',
            marginBottom: '15px',
            height: 'fit-content',
            // width: 300,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}
          >
            {[
              {
                bookmarkAddr: 'http://localhost:8000/#/login',
                bookmarkName: '本地8000登錄',
                desc: '固定书签',
                isLocalApp: true,
                readOnly: true,
                icon:
                  'data:image/png;base64,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',
              },
              {
                bookmarkName: 'APR配置',
                render: APR,
                icon:
                  'data:image/png;base64,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',
              },
              {
                bookmarkName: '服务器节点',
                render: DomainMgr,
                icon:
                  'data:image/png;base64,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',
              },
              ...(Array.isArray(apsBookmarkListAll) ? apsBookmarkListAll : []).filter(e => e.isSystemApp),
            ].map((ele, index) => (
              <BookItem key={index} item={ele} />
            ))}
          </div>
        </Card>
        <Card
          title={
            <p
              style={{
                flexShrink: '0',
                margin: '0 16px 0 0',
                fontSize: '18px',
                color: '#262626',
                fontWeight: '700',
              }}
            >
              快捷书签
            </p>
          }
          extra={
            <div style={{ display: 'flex' }}>
              <Form layout='inline'>
                <Form.Item label='任务标签'>
                  <Select
                    // value={apsBookmarkGroupSelect}
                    placeholder='请选择'
                    // mode='multiple'
                    allowClear
                    style={{
                      width: '100px',
                    }}
                    onChange={val => {
                      // setApsBookmarkGroupSelect(val);
                      setApsBookmarkList(
                        apsBookmarkListAll.filter(ele =>
                          val ? ele.bookmarkGroup && ele.bookmarkGroup.includes(val) : true,
                        ),
                      );
                    }}
                    options={apsBookmarkGroupTags.map(ele => ({ label: ele, value: ele }))}
                  />
                </Form.Item>
              </Form>
              <Button type='link' onClick={getBookmarkList} loading={apsBookmarkListLoading}>
                刷新
              </Button>
              <Button type='link' onClick={onBookmarkAddModal}>
                添加
              </Button>
            </div>
          }
          style={{
            borderRadius: '10px',
            height: 'fit-content',
            // width: 300,
          }}
        >
          <Spin spinning={apsBookmarkListLoading}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
              }}
            >
              {[...(Array.isArray(apsBookmarkList) ? apsBookmarkList : []).filter(e => !e.isSystemApp)].map((ele, index) => (
                <BookItem key={index} item={ele} />
              ))}
            </div>
          </Spin>
        </Card>
      </div>
      <Card
        title={
          <p
            style={{
              flexShrink: '0',
              margin: '0 16px 0 0',
              fontSize: '18px',
              color: '#262626',
              fontWeight: '700',
            }}
          >
            留言板
          </p>
        }
        extra={
          <div>
            <LoadingProvider>
              <Button type='link' onClick={() => getMsgBoxList()}>
                刷新
              </Button>
            </LoadingProvider>
            <Button type='link' onClick={() => onMsgBoxAddModal()}>
              添加
            </Button>
          </div>
        }
        style={{
          borderRadius: '10px',
          flex: 1,
          //   height: 'fit-content',
          // width: 300,
        }}
      >
        <div
          style={{
            // display: 'flex',
            overflowWrap: 'anywhere',
            height: '1000px',
            overflowY: 'scroll',
          }}
        >
          {msgBoxList.map((ele, index) => (
            <div
              key={index}
              style={{
                border: '2px gainsboro solid',
                borderRadius: '5px',
                backgroundColor: 'lightgray',
                marginTop: '5px',
              }}
            >
              <div>
                {ele.time}
                <LoadingProvider
                  triggerName='onConfirm'
                  triggerWrapper={
                    <Popconfirm title='确认操作？' onConfirm={() => deleteMsgBox(index)} />
                  }
                >
                  <Button type='link' danger>
                    删除
                  </Button>
                </LoadingProvider>
                {`${ele.content || ''}`.substring(300, 301) && (
                  <Button
                    type='link'
                    onClick={() =>
                      onMsgBoxAddModal({
                        title: '查看留言',
                        contentReadOnly: true,
                        content: ele.content,
                        okButtonProps: { disabled: true },
                      })
                    }
                  >
                    详情
                  </Button>
                )}
              </div>
              <div
                style={{
                  border: '2px gainsboro solid',
                  borderRadius: '5px',
                  backgroundColor: 'ghostwhite',
                  padding: '5px',
                }}
              >
                <Input.TextArea
                  readOnly
                  autoSize
                  bordered={false}
                  style={{ width: '100%', padding: 0 }}
                  value={`${ele.content || ''}`.substring(0, 300)}
                />
                {`${ele.content || ''}`.substring(300, 301) && (
                  <span
                    style={{
                      color: '#1890ff',
                      fontWeight: 'bold',
                      letterSpacing: '1px',
                    }}
                  >
                    ...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
