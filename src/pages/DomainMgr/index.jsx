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
                size: '2 vCPU, 1GB RAM, 50GB Disk, 流量包 - 3072GB/月（带宽：共享1Gbps）',
                information: 'Los Angeles - DC1 - HS106',
                creatTime: "2023-10-15",
                desc: 'cf代理域名us3_cf.lemonyun.net/lemonyun.net/v2-subscription.lemonyun.net; aws的cdn域名d3nm9yd7vw3lkd.cloudfront.net'
              },
              {
                hostname: "us2.lemonyun.net",
                ip: '74.48.12.156',
                size: '2 vCPU, 1GB RAM, 40GB Disk, 流量包 - 3072GB/月（带宽：共享1Gbps）',
                information: 'Los Angeles - DC1 - HS18',
                creatTime: "2023-02-04",
                desc: 'cf的cdn域名us2_cf.lemonyun.net aws的cdn域名d17egxcl74ka24.cloudfront.net'
              },
              {
                hostname: "lemonyun.top",
                ip: '(公) 122.152.237.172 (内) 10.0.8.3 ',
                size: 'CPU - 2核 内存 - 2GB,系统盘 - SSD云硬盘 50GB,流量包 - 300GB/月（带宽：4Mbps）',
                information: '广州   |   广州三区',
                creatTime: "2023-08-26 02:05:02 - 2026-08-26 02:05:02"
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
                title: "备注",
                dataIndex: "desc",
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
