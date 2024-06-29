import React, { useEffect, useRef, useState } from "react";
import {
  //
  Input,
  Select,
  message,
  Button,
  Card,
  Table,
  Modal,
  Form,
  Popconfirm,
} from "antd";
import request from "@/api/APS";
import LoadingProvider from "@/components/LoadingProvider";

export default function PocketBook() {
  // console.log('APR props===', props);
  const [currentEnv, set_currentEnv] = useState("ocrm");
  const [currentBranch, set_currentBranch] = useState("--");
  const [localBranchList, set_localBranchList] = useState([]);
  const [localBranchListSelect, set_localBranchListSelect] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableList, setTableList] = useState([]);
  const backupEditFormRef = useRef();
  const [target_branch, set_target_branch] = useState("");

  // 配置操作执行
  const onAprAction = async (action) => {
    const res = await request(
      `/crm-app/updateAprConfig?action=${action}&env=${currentEnv}`,
      {
        filesList: selectedRows,
      }
    );
    const { ok, msg } = res || {};
    message[ok ? "success" : "error"](msg);
    if (ok) {
      getModifiedFiles();
    }
  };

  // 獲取當前分支
  const getCurrentBranch = async () => {
    const { data } =
      (await request(`/crm-app/getCurrentBranch`, { env: currentEnv })) || {};
    data && set_currentBranch(`${data}`);
  };

  // 切换當前分支
  const updateCurrentBranch = async (branchName) => {
    const { ok, msg } =
      (await request(`/crm-app/updateCurrentBranch`, {
        env: currentEnv,
        branchName,
      })) || {};
    message[ok ? "success" : "error"](msg);
    if (ok) {
      await getCurrentBranch();
      await onAprAction("resume");
    }
  };

  // 獲取本地分支列表
  const getLocalBranchList = async () => {
    const { data } =
      (await request(`/crm-app/getLocalBranchList`, { env: currentEnv })) || {};
    const {
      //
      list,
    } = data || {};
    list && set_localBranchList(list);
  };

  // 删除本地分支列表
  const deleteLocalBranch = async () => {
    const { ok, msg } =
      (await request(`/crm-app/deleteLocalBranch`, {
        env: currentEnv,
        branchList: localBranchListSelect,
      })) || {};
    message[ok ? "success" : "error"](msg);
  };

  // 獲取文件列表
  const getModifiedFiles = async () => {
    setTableLoading(true);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    const { data, ok } =
      (await request(`/crm-app/getModifiedFiles`, { env: currentEnv })) || {};
    const {
      //
      list,
    } = data || {};
    setTableLoading(false);
    if (ok) {
      setTableList(list);
    }
  };

  // 更新文件備份配置
  const updateBackupTodo = async (param) => {
    setTableLoading(true);
    const { ok, msg } =
      (await request(`/crm-app/updateBackupTodo?env=${currentEnv}`, param)) ||
      {};
    setTableLoading(false);
    message[ok ? "success" : "error"](msg);
  };

  // 表格选择变化回调
  const selectOnChange = (...args) => {
    const [keys, rows] = args;
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
    // onChange && onChange(...args);
  };

  // 备份配置弹窗
  const onBackupEditModal = (modalProps) => {
    const { backupTodoId, fileName } = modalProps || {};
    Modal.confirm({
      title:
        (backupTodoId ? "編輯No.backupTodoId_" + backupTodoId : "新增") +
        "：" +
        fileName,
      width: 800,
      icon: "",
      maskClosable: true,
      //   okButtonProps: { disabled: !apsNodeSelected2 },
      ...modalProps,
      content: (
        <Form ref={backupEditFormRef} initialValues={modalProps}>
          <Form.Item
            name="backupFileName"
            label="備份文件名稱"
            rules={[{ required: true }]}
          >
            <Input disabled={backupTodoId} placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="backupFileRepo"
            label="備份文件倉庫"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="请选择"
              options={[
                {
                  label: "全局",
                  value: "全局",
                },
                {
                  label: "当前分支",
                  value: "当前分支",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            //
            name="filePath"
            label="源文件路徑"
            // valuePropName='children'
          >
            <Input.TextArea readOnly rows={5} />
            {/* <span /> */}
          </Form.Item>
        </Form>
      ),
      async onOk() {
        if (backupEditFormRef.current) {
          const vals = await backupEditFormRef.current.validateFields();
          console.log("OK");
          console.log(vals);
          const param = {
            ...modalProps,
            ...vals,
          };
          await updateBackupTodo(param);
          await getModifiedFiles();
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  useEffect(() => {
    getCurrentBranch();
    getLocalBranchList();
    getModifiedFiles();
  }, [currentEnv]);

  return (
    <div>
      <Card
        title={
          <p
            style={{
              flexShrink: "0",
              margin: "0 16px 0 0",
              fontSize: "18px",
              color: "#262626",
              fontWeight: "700",
            }}
          >
            APR配置设置
          </p>
        }
      >
        <Form.Item
          label="当前环境"
          style={{
            marginBottom: "10px",
          }}
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
        >
          <Select
            style={{
              width: "200px",
            }}
            value={currentEnv}
            onChange={(val) => {
              set_currentEnv(val);
            }}
            options={[
              {
                label: "PC（OCRM）",
                value: "ocrm",
              },
              {
                label: "APP新（MMA）",
                value: "mma",
              },
              {
                label: "APP老（MMA）",
                value: "mma_old",
              },
              {
                label: "伴我行4.0（CRM）",
                value: "crm",
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="当前分支"
          style={{
            marginBottom: "10px",
          }}
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
        >
          <Select
            style={{
              width: "236px",
            }}
            value={currentBranch}
            onChange={(val) => set_currentBranch(val)}
            options={localBranchList.map((e) => ({ label: e, value: e }))}
          />
          <LoadingProvider
            triggerName="onConfirm"
            triggerWrapper={
              <Popconfirm
                title="确认操作？"
                onConfirm={() => updateCurrentBranch(currentBranch)}
              />
            }
          >
            <Button type="primary">切换</Button>
          </LoadingProvider>
          <LoadingProvider>
            <Button
              //
              type="link"
              onClick={() =>
                Promise.all([getCurrentBranch(), getLocalBranchList()])
              }
            >
              刷新
            </Button>
          </LoadingProvider>
        </Form.Item>
        <Form.Item
          label="代码提交"
          style={{
            marginBottom: "10px",
          }}
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
        >
          <Input
            readOnly
            value={currentBranch}
            style={{
              width: "300px",
            }}
          />
          {"=>"}
          <Select
            value={target_branch}
            onChange={(val) => {
              set_target_branch(val);
            }}
            style={{
              width: "300px",
            }}
            options={[
              {
                label: "crm-web-apollo-uat",
                value: "crm-web-apollo-uat",
                env: "ocrm",
              },
              {
                label: "crm-web-apollo-prod",
                value: "crm-web-apollo-prod",
                env: "ocrm",
              },
              {
                label: "crm-web-apollo-dev",
                value: "crm-web-apollo-dev",
                env: "ocrm",
              },
              {
                label: "UAT20240530-20240613",
                value: "UAT20240530-20240613",
                env: "mma",
              },
              {
                label: "PRO",
                value: "PRO",
                env: "mma",
              },
              {
                label: "Mobile_Financial_MCRM_DEV",
                value: "Mobile_Financial_MCRM_DEV",
                env: "mma",
              },
              {
                label: "workSpace-0627",
                value: "workSpace-0627",
                env: "crm",
              },
              {
                label: "uat",
                value: "uat",
                env: "crm",
              },
            ].filter((e) => e.env === currentEnv)}
          />
          {currentEnv === "ocrm" && (
            <div>
              PC：
              <a
                target="_blank"
                href={`http://code.cmbc.com.cn:8850/osc/_source/enterprise__OCRM/crm-web-apollo/-/pull_requests/new?target_branch=${target_branch}&source_branch=${currentBranch}`}
              >
                {`http://code.cmbc.com.cn:8850/osc/_source/enterprise__OCRM/crm-web-apollo/-/pull_requests/new?target_branch=${target_branch}&source_branch=${currentBranch}`}
              </a>
            </div>
          )}
          {currentEnv === "mma" && (
            <div>
              APP：
              <a
                target="_blank"
                href={`http://code.cmbc.com.cn:8850/osc/_source/enterprise__MMA/Mobile_Financial_MCRM/-/pull_requests/new?target_branch=${target_branch}&source_branch=${currentBranch}`}
              >
                {`http://code.cmbc.com.cn:8850/osc/_source/enterprise__MMA/Mobile_Financial_MCRM/-/pull_requests/new?target_branch=${target_branch}&source_branch=${currentBranch}`}
              </a>
            </div>
          )}
          {currentEnv === "crm" && (
            <div>
              crm-PC：
              <a
                target="_blank"
                href={`http://code.cmbc.com.cn:8850/osc/_source/enterprise__CRM/crm-workspace/-/pull_requests/new?target_branch=${target_branch}&source_branch=${currentBranch}`}
              >
                {`http://code.cmbc.com.cn:8850/osc/_source/enterprise__CRM/crm-workspace/-/pull_requests/new?target_branch=${target_branch}&source_branch=${currentBranch}`}
              </a>
            </div>
          )}
        </Form.Item>
        <Form.Item
          label="分支列表"
          style={{
            marginBottom: "10px",
          }}
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
        >
          <Select
            style={{
              width: "300px",
              // height: '80px',
              // overflowY: 'scroll',
              verticalAlign: "top",
            }}
            allowClear
            placeholder="请选择需要操作的分支"
            maxTagCount="responsive"
            mode="multiple"
            value={localBranchListSelect}
            onChange={(val) => set_localBranchListSelect(val)}
            options={localBranchList.map((e) => ({ label: e, value: e }))}
          />
          <LoadingProvider
            triggerName="onConfirm"
            triggerWrapper={
              <Popconfirm title="确认操作？" onConfirm={deleteLocalBranch} />
            }
          >
            <Button
              type="primary"
              style={{ marginRight: "16px" }}
              disabled={!localBranchListSelect.length}
            >
              删除所选（{localBranchListSelect.length}）
            </Button>
          </LoadingProvider>
          <p>选择结果：{localBranchListSelect.join(" ")}</p>
        </Form.Item>
      </Card>
      <Card
        style={{
          marginTop: "15px",
        }}
        title={
          <p
            style={{
              flexShrink: "0",
              margin: "0 16px 0 0",
              fontSize: "18px",
              color: "#262626",
              fontWeight: "700",
            }}
          >
            工作倉文件
          </p>
        }
        extra={
          <div>
            <LoadingProvider>
              <Button
                type="primary"
                style={{ marginRight: "16px" }}
                disabled={!selectedRows.length}
                onClick={() => onAprAction("backup")}
              >
                备份所选（{selectedRows.length}）
              </Button>
            </LoadingProvider>
            {/* <LoadingProvider
              triggerName='onConfirm'
              triggerWrapper={
                <Popconfirm title='确认操作？' onConfirm={() => onAprAction('backupall')} />
              }
            >
              <Button type='primary' style={{ marginRight: '16px' }}>
                备份全部
              </Button>
            </LoadingProvider> */}
            <LoadingProvider>
              <Button
                type="primary"
                style={{ marginRight: "16px" }}
                disabled={!selectedRows.length}
                onClick={() => onAprAction("reset")}
              >
                重置所选（{selectedRows.length}）
              </Button>
            </LoadingProvider>
            <LoadingProvider>
              <Button
                type="primary"
                style={{ marginRight: "16px" }}
                onClick={() => onAprAction("resume")}
              >
                恢复全部
              </Button>
            </LoadingProvider>
            <LoadingProvider>
              <Button type="link" onClick={getModifiedFiles}>
                刷新
              </Button>
            </LoadingProvider>
          </div>
        }
      >
        <div>
          <Table
            //
            scroll={{ x: true }}
            loading={tableLoading}
            rowKey={(row, index) => index}
            rowSelection={{
              //   type,
              selectedRowKeys,
              onChange: selectOnChange,
            }}
            dataSource={tableList}
            columns={[
              //   {
              //     title: '序號',
              //     dataIndex: 'IDX',
              //     render: (val, row, index) => index + 1,
              //   },
              {
                title: "操作",
                dataIndex: "IDX",
                render: (val, row) => {
                  return (
                    <div>
                      <Button
                        type="link"
                        onClick={() => onBackupEditModal(row)}
                      >
                        備份配置
                      </Button>
                    </div>
                  );
                },
              },
              {
                title: "源文件名稱",
                dataIndex: "fileName",
              },
              {
                title: "備份文件名稱",
                dataIndex: "backupFileName",
              },
              {
                title: "備份文件倉庫",
                dataIndex: "backupFileRepo",
              },
              {
                title: "備份任务编号",
                dataIndex: "backupTodoId",
              },
              {
                title: "備份任务环境",
                dataIndex: "env",
              },
              {
                title: "上次備份時間",
                render: (val, row) => {
                  if (row.backupFileRepo === "全局") return row.lastBackupTime;
                  if (row.backupFileRepo === "当前分支")
                    return row[`lastBackupTime_${row.currentBranch}`];
                },
              },
              {
                title: "源文件路徑",
                dataIndex: "filePath",
              },
            ]}
          />
        </div>
      </Card>
    </div>
  );
}
