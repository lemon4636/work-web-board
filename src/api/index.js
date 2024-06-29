import axios from 'axios';

const request = async (url, params) => {
  return new Promise(resolve => {
    axios.post(`${url}`, params).then(
      res => resolve(res),
      () => resolve(),
    );
  });
};

export default request;
