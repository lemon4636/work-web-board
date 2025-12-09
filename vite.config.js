import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import qiankun from "vite-plugin-qiankun";
import reactRefresh from "@vitejs/plugin-react-refresh";

// const useDevMode = true; // true===不使用热更新插件
const qinakunAppName = "work-web-board";

export default ({ mode }) => {
  const __DEV__ = mode === "development";
  return defineConfig({
    base: "/" + qinakunAppName,
    // experimental: {
    //   // renderBuiltUrl(filename, { hostId, hostType, type }) {
    //   renderBuiltUrl(filename, options) {
    //     console.log('hhhhhh===', filename, options)
    //     if (options.type === 'public') {
    //       return 'https://www.domain.com/' + filename
    //     }
    //     else {
    //       return 'https://cdn.domain.com/assets/' + filename
    //     }
    //   }
    // },
    plugins: [
      //
      ...(__DEV__ ? [] : [reactRefresh()]),
      react(),
      qiankun(qinakunAppName, {
        __DEV__,
      }),
    ],
    resolve: {
      alias: {
        "@": __dirname + "/src",
      },
    },
    server: {
      port: 5173,
      host: "0.0.0.0",
      origin: "//localhost:5173",
      cors: true,
      headers: {
        "access-control-allow-origin": "*",
      },
      proxy: {
        "/login": {
          target: "https://lemonyun.net",
          changeOrigin: true,
        },
        "/wwb-api": {
          target: "https://lemonyun.net",
          changeOrigin: true,
        },
        "/crm-app": {
          target: "https://lemonyun.net",
          changeOrigin: true,
        },
      },
    },
  });
};
