import React from "react";
import SpinLoading from "@/components/SpinLoading";

// 页面懒加载Hoc组件
export default ({ children }) => (
  <React.Suspense fallback={<SpinLoading />}>{children}</React.Suspense>
);
