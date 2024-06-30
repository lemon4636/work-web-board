import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { registerMicroApps, start } from "qiankun";
import {
  renderWithQiankun,
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";
import getRouter from "./router";
// import { apps as homeMicroApps } from "./router/homeMicroApps";
// import { getHashRouterPath } from "./utils/format";
import "antd/dist/antd.css";
import "./utils/axios";

let instance = null;
function render(props) {
  const { container, qiankunWindowURL } = props;
  // if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  //   registerMicroApps(
  //     homeMicroApps.map((app) => ({
  //       ...app,
  //       activeRule: ({ hash }) =>
  //         getHashRouterPath(qiankunWindowURL ? qiankunWindowURL.hash : hash) ===
  //         `/Home/${app.name}`,
  //     })),
  //     {
  //       beforeLoad: [
  //         (app) => {
  //           console.log("beforeLoad", app);
  //         },
  //       ],
  //       beforeMount: [
  //         (app) => {
  //           console.log("beforeLoad", app);
  //         },
  //       ],
  //     }
  //   );
  //   start({
  //     sandbox: {
  //       strictStyleIsolation: true,
  //       experimentalStyleIsolation: true,
  //     },
  //   });
  // }
  const root = ReactDOM.createRoot(
    container
      ? container.querySelector("#root")
      : document.getElementById("root")
  );
  root.render(
    <RouterProvider
      router={getRouter(
        qiankunWindow.__POWERED_BY_QIANKUN__ && {
          window: {
            ...qiankunWindow,
            ...(qiankunWindowURL && {
              location: {
                hash: qiankunWindowURL.hash,
                host: qiankunWindowURL.host,
                hostname: qiankunWindowURL.hostname,
                href: qiankunWindowURL.href,
                origin: qiankunWindowURL.origin,
                pathname: qiankunWindowURL.pathname,
                port: qiankunWindowURL.port,
                protocol: qiankunWindowURL.protocol,
              },
            }),
          },
        }
      )}
    />
  );
  return root;
}

renderWithQiankun({
  mount(props) {
    console.log("mount_props", props);
    instance = render(props);
  },
  bootstrap() {
    console.log("bootstrap");
  },
  unmount() {
    console.log("unmount", instance);
    instance && instance.unmount();
  },
  update(props) {
    console.log("update", props);
  },
});

console.log(
  "is running __POWERED_BY_QIANKUN__",
  !!qiankunWindow.__POWERED_BY_QIANKUN__
);
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  instance = render({});
}
