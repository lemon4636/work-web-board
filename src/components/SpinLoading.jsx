import React from "react";
import { Spin } from "antd";

// 页面加载loading组件
export default ({ size = "large", height, tip = "Loading" }) => {
  return (
    <div
      style={{
        height,
        textAlign: "center",
      }}
    >
      <Spin size={size} tip={tip} />
    </div>
  );
};
