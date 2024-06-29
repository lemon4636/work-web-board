import React from "react";
import SpinLoading from "@/components/SpinLoading";
import request from "@/api";

// 鉴权组件
export default class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: "loading",
    };
  }
  getAuth = async () => {
    const { ok } = (await request(`/crm-app/isLogin`)) || {};
    console.log("isLogin===", ok);
    this.setState(
      {
        isLogin: ok ? "success" : "fail",
      },
      () => {
        if (!ok) window.location = "/login";
      }
    );
  };
  componentDidMount() {
    this.getAuth();
  }
  render() {
    const { children } = this.props;
    const { isLogin } = this.state;
    return (
      <React.Fragment>
        {isLogin === "loading" && <SpinLoading tip="系统初始化..." />}
        {/* {isLogin === false && <Navigate to="/Login" replace={true} />} */}
        {isLogin === "fail" && <SpinLoading tip="跳转登录页面..." />}
        {isLogin === "success" && children}
        {/* {children} */}
      </React.Fragment>
    );
  }
}
