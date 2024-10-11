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

export default function DomainMgr() {
  // console.log('APR props===', props);
  const [currentEnv, set_currentEnv] = useState("ocrm");

  // 更新文件備份配置
  const updateBackupTodo = async (param) => {
    setTableLoading(true);
    const { ok, msg } =
      (await request(`/crm-app/updateBackupTodo?env=${currentEnv}`, param)) ||
      {};
    setTableLoading(false);
    message[ok ? "success" : "error"](msg);
  };

  return (
    <div>
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
            服务器列表
          </p>
        }
        extra={
          <div>
            <LoadingProvider>
              {/* <Button
                type="primary"
              >
                备份所选
              </Button> */}
            </LoadingProvider>
          </div>
        }
      >
        <div>
          <Table
            //
            scroll={{ x: true }}
            // loading={tableLoading}
            rowKey={(row, index) => index}

            dataSource={[
              {
                hostname: "us3.lemonyun.net",
                ip: '66.103.216.148',
                size: '2 vCPU, 1GB RAM, 50GB Disk',
                information: 'Los Angeles - DC1 - HS106',
                creatTime: "2023-10-15"
              },
              {
                hostname: "us2.lemonyun.net",
                ip: '74.48.12.156',
                size: '2 vCPU, 1GB RAM, 40GB Disk',
                information: 'Los Angeles - DC1 - HS18',
                creatTime: "2023-02-04"
              },
            ]}
            columns={[
              {
                title: '序号',
                dataIndex: 'IDX',
                render: (val, row, index) => index + 1,
              },
              {
                title: "服务器名称",
                dataIndex: "hostname",
              },
              {
                title: "IP地址",
                dataIndex: "ip",
              },
              {
                title: "配置",
                dataIndex: "size",
              },
              {
                title: "集群区域",
                dataIndex: "information",
              },
              {
                title: "创建时间",
                dataIndex: "creatTime",
              },
            ]}
          />
        </div>
      </Card>
    </div>
  );
}
