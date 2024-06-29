import React, { useEffect } from "react";
import { Button, Checkbox, Form, Input, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import request from "@/api/APS";
import { useState } from "react";

const skinList = [
  {
    bg_type: "video",
    title: "【动态】阳光森林",
    img: "",
    video_url:
      "https://duba-static.iscrv.com/static/v4/preview_video/97ba6b60662ab4f31ef06cdf5a5f8e94_preview.mp4",
    video_cover_url:
      "https://duba-static.iscrv.com/static/v4/preview_img_raw/97ba6b60662ab4f31ef06cdf5a5f8e94_preview_raw.jpg",
  },
  {
    bg_type: "video",
    title: "【动态】4k高端护眼屏保",
    img: "",
    video_url:
      "https://duba-static.iscrv.com/static/v4/preview_video/2b25670e88699d262913dbd1d88b8f25_preview.mp4",
    video_cover_url:
      "https://duba-static.iscrv.com/static/v4/preview_img_raw/58818d9c2e5411fb6a30319a81882318.jpg",
  },
  {
    bg_type: "video",
    title: "【动态】慵懒的猫",
    img: "",
    video_url:
      "https://duba-static.iscrv.com/static/v4/preview_video/7c52e0a2a6056f781684b17970095519_preview.mp4",
    video_cover_url:
      "https://duba-static.iscrv.com/static/v4/preview_img_raw/b4e59738dbb5ce643b6225d0158abf66.mp4.jpg",
  },
  {
    bg_type: "video",
    title: "【动态】4K极简插画风景",
    img: "",
    video_url:
      "https://duba-static.iscrv.com/static/v4/preview_video/d0c17a4fe0b0758b5e33b827b13c4b61_preview.mp4",
    video_cover_url:
      "https://duba-static.iscrv.com/static/v4/preview_img_raw/d0c17a4fe0b0758b5e33b827b13c4b61_preview.jpg",
  },
  {
    bg_type: "video",
    title: "【动态】画中画无缝高清海风吹过",
    img: "",
    video_url:
      "https://duba-static.iscrv.com/static/v4/preview_video/657e2332c8f25ce1b8341f48366778a6_preview.mp4",
    video_cover_url:
      "https://duba-static.iscrv.com/static/v4/preview_img_raw/ec3b9ab8001c2950bec519a50f6edad9.mp4.jpg",
  },
  {
    bg_type: "video",
    title: "【动态】4K夕阳余晖",
    img: "",
    video_url:
      "https://duba-static.iscrv.com/static/v4/preview_video/1f0b3635a8b9175338fec93eae33cdff_preview.mp4",
    video_cover_url:
      "https://duba-static.iscrv.com/static/v4/preview_img_raw/0e1a075ba6ab7ed9bbb3659ec125a278.mp4.jpg",
  },
  {
    bg_type: "video",
    title: "【动态】4K天使素颜",
    img: "",
    video_url:
      "https://duba-static.iscrv.com/static/v4/preview_video/452b39371f950bd848d5d51c106001ff_preview.mp4",
    video_cover_url:
      "https://duba-static.iscrv.com/static/v4/preview_img_raw/7048a936b2335e0bce179366d2bd187e.mp4.jpg",
  },
  {
    bg_type: "video",
    title: "【动态】4K 繁华都市 航拍",
    img: "",
    video_url:
      "https://duba-static.iscrv.com/static/v4/preview_video/f5c81eeb10c93aa35ead7e17e6345cec_preview.mp4",
    video_cover_url:
      "https://duba-static.iscrv.com/static/v4/preview_img_raw/2e2e9f5e80049eefd7ea6644e6635451.mp4.jpg",
  },
  {
    bg_type: "video",
    title: "【动态】治愈星空流星",
    img: "",
    video_url:
      "https://duba-static.iscrv.com/static/v4/preview_video/b96913d5a5ddf607c56fec40e99f438e_preview.mp4",
    video_cover_url:
      "https://duba-static.iscrv.com/static/v4/preview_img_raw/eb334a062b5146d27f2f816050bdfe63.mp4.jpg",
  },
  {
    bg_type: "video",
    title: "【动态】C4D版太空人",
    img: "",
    video_url:
      "https://duba-static.iscrv.com/static/v4/preview_video/1b090eef9939d406034485ac1e0eea87_preview.mp4",
    video_cover_url:
      "https://duba-static.iscrv.com/static/v4/preview_img_raw/b598ba6e709e67ccab899a3463935362.mp4.jpg",
  },
  {
    bg_type: "video",
    title: "【动态】天煞 劫",
    img: "",
    video_url:
      "https://duba-static.iscrv.com/static/v4/preview_video/8290d5917bbe636822f11fade1f1b020_preview.mp4",
    video_cover_url:
      "https://duba-static.iscrv.com/static/v4/preview_img_raw/7499481b88705ad0d0ba8cc654187fab.mp4.jpg",
  },
  {
    bg_type: "video",
    title: "【动态】你的名字流星",
    img: "",
    video_url:
      "https://duba-static.iscrv.com/static/v4/preview_video/5b87ca04c13702b5a0d88c3f25fe22c8_preview.mp4",
    video_cover_url:
      "https://duba-static.iscrv.com/static/v4/preview_img_raw/5b87ca04c13702b5a0d88c3f25fe22c8_preview_raw.jpg",
  },
  {
    bg_type: "video",
    title: "【动态】富士山星空",
    img: "",
    video_url:
      "https://duba-static.iscrv.com/static/v4/preview_video/9d32296a90fc647449cb041d9da6c126_preview.mp4",
    video_cover_url:
      "https://duba-static.iscrv.com/static/v4/preview_img_raw/9d32296a90fc647449cb041d9da6c126_preview_raw.jpg",
  },
  {
    bg_type: "img",
    title: "沙滩",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210903/3a57509d40e7d3ba4c02d0e35acd1c06.jpeg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "粉白",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210903/8a5caf580875b9d34d0cb1f71bf19251.jpeg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "man",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210903/cc8a4ad087ae772f9e3d4e8be07bc5ab.jpeg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "条纹",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210903/7149ca76bfddb821c91c2f8761db6853.jpeg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "旅途",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210903/3d285568faa65651a0534cbeddfda3a9.jpeg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "黄药丸",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210903/331c207fba66c850b5a7603b194a0bde.jpeg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "云雾茫茫",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210204/0b190880310a2aa7774367e86388abb6.jpg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "夏天的风",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210204/4fa08ba1e65c743c03d31eb758549715.jpg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "蓝天白云",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210204/ecd4c6ae614b1e7f6e8032fda59f948a.jpg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "花开的日子",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210204/8f1d2103590e0abce862ed8e7553110e.jpg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "孤独的树",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210204/fd28b86a71cdb3a6d0b41c0f814700ef.jpg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "满月时分",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210204/ba535bbd03ade06a67ed9f483bb9d785.jpg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "海上晨曦",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210204/ea638b83b18ab43e1c38cb552651ef75.jpg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "一起去看极光",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210204/57112446fc8de6b8f2417a169ffdac8e.jpg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "满天星空",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210204/74d0d4d1ca28d2245195a08dab163428.jpg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "向日葵",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210204/bd5289e395a6d73fa3d30e7bd8e117ab.jpg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "听海的声音",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210204/75923fb38d3ebde05adcedf32bbe0d5a.jpg",
    video_url: "",
    video_cover_url: "",
  },
  {
    bg_type: "img",
    title: "云雾缭绕",
    img:
      "https://duba-static.iscrv.com/static/images/public/20210204/e380df22256b460280f84ddfd7e9d536.jpg",
    video_url: "",
    video_cover_url: "",
  },
];

export default function Login() {
  const [skin, setSkin] = useState(skinList[0]);

  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("login:", values);
    const { pwd } = values;
    const { ok, msg } = (await request(`/crm-app/login?pwd=${pwd}`)) || {};
    message[ok ? "success" : "error"](msg);
    if (ok) {
      localStorage.setItem("isLogin", "1");
      navigate("/Home");
    }
  };
  const openSkinModal = () => {
    Modal.info({
      title: "壁纸库",
      width: 1200,
      icon: "",
      maskClosable: true,
      footer: null,
      content: (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            height: "600px",
            overflowY: "scroll",
          }}
        >
          {skinList.map((skin, index) => {
            return (
              <div
                key={index}
                style={{
                  color: "#fff",
                  width: "33.33%",
                  height: "210px",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "50%",
                  backgroundSize: "cover",
                  backgroundImage: `url(${skin.video_cover_url || skin.img})`,
                }}
                onClick={() => setSkin(skin)}
              >
                {skin.title}
              </div>
            );
          })}
        </div>
      ),
      // async onOk() {
      //   if (addMsgBoxFormRef.current) {
      //     const vals = await addMsgBoxFormRef.current.validateFields();
      //     console.log('OK', vals);
      //     await addMsgBox({
      //       ...vals,
      //     });
      //     await getMsgBoxList();
      //   }
      // },
    });
  };

  // useEffect(() => {
  //   window.location = '/login'
  // }, [])

  return (
    <div>
      <video
        autoPlay="autoplay"
        loop="loop"
        muted="muted"
        // poster="https://duba-static.iscrv.com/static/v4/preview_img_raw/97ba6b60662ab4f31ef06cdf5a5f8e94_preview_raw.jpg"
        // src="https://duba-static.iscrv.com/static/v4/preview_video/97ba6b60662ab4f31ef06cdf5a5f8e94_preview.mp4"
        poster={skin.video_cover_url}
        src={skin.video_url}
        style={{
          position: "fixed",
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {/* header */}
      <div
        style={{
          position: "relative",
          height: "46px",
          lineHeight: "46px",
          fontSize: "14px",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          opacity: "0.8",
        }}
      >
        {/* left */}
        <div>
          <div>logo</div>
        </div>
        {/* right */}
        <div>
          <div
            style={{
              width: "100px",
              cursor: "pointer",
            }}
            onClick={() => openSkinModal()}
          >
            换肤
          </div>
        </div>
      </div>

      <div
        style={{
          height: "800px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Form
          name="basic"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 16,
          }}
          size="large"
          style={{
            width: "60%",
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          // autoComplete="off"
        >
          {/* <Form.Item
        label="Username"
        name="pwd"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item> */}
          <Form.Item
            label="密码"
            name="pwd"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password style={{ borderRadius: "10px" }} />
          </Form.Item>

          {/* <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item> */}

          {/* <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item> */}
        </Form>
      </div>
    </div>
  );
}
