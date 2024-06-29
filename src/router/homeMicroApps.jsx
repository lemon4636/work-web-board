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
  //   entry: "//" + "localhost:5174" + "/pocket-book",
  //   container: "#microAppContainer",
  //   loader: (loading) => {
  //     console.log("PocketBook-loader======", loading);
  //   },
  //   props: {
  //     qiankunWindowURL: new URL(
  //       location.protocol +
  //         "//" +
  //         "localhost:5174" +
  //         "/pocket-book#/Home/PocketBook"
  //     ),
  //   },
  // },
];

const router = apps.map((app) => {
  return {
    path: app.name,
    Component: HomeMicroAppBox,
  };
});

export default router;
