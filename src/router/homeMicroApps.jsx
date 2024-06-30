import HomeMicroAppBox from "../pages/HomeMicroAppBox";

export const apps = [
  {
    name: "FileUpload",
    entry: "//" + location.host + "/FileUpload",
    container: "#microAppContainer",
    // loader: (loading) => {
    //   console.log("FileUpload-loader======", loading);
    // },
    // props: {
    //   qiankunWindowURL: new URL(location.protocol + '//' + location.host + '/WWB/#/test1'),
    // },
  },
  // {
  //   name: "PocketBook",
  //   entry: "//" + location.host + "/work-web-board/#/Home/PocketBook",
  //   container: "#microAppContainer",
  //   //   loader: (loading) => {
  //   //     console.log("PocketBook-loader======", loading);
  //   //   },
  //   props: {
  //     qiankunWindowURL: new URL(
  //       location.protocol +
  //       "//" +
  //       location.host +
  //       "/pocket-book#/Home/PocketBook"
  //     ),
  //   },
  // },
  {
    name: "WWBold",
    entry: "//" + location.host + "/work-web-board/#/Home/PocketBook",
    container: "#microAppContainer",
    //   loader: (loading) => {
    //     console.log("PocketBook-loader======", loading);
    //   },
    props: {
      qiankunWindowURL: new URL(
        location.protocol +
        "//" +
        location.host +
        "/work-web-board/#/Home/PocketBook"
      ),
    },
  },
];

const router = apps.map((app) => {
  return {
    path: app.name,
    element: <HomeMicroAppBox key={app.name} app={app} />,
  };
});

export default router;
