import axios from 'axios';
import { notification } from 'antd';

const openNotification = (message, description, placement = 'topRight') =>
  notification.error({
    message,
    description,
    placement,
  });

// axios.defaults.baseURL = '';
axios.defaults.timeout = 60000;
axios.interceptors.response.use(
  res => {
    const { data, status, statusText } = res || {};
    if (+status !== 200) {
      openNotification(`status:${status}`, statusText);
      return Promise.reject();
    }
    return data;
  },
  err => {
    openNotification(`error:${err}`, '接口响应失败');
    return Promise.reject(err);
  },
);
