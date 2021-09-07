import { message } from 'antd';
const codeMessage: {
  [key: number]: string;
} = {
  200: '服务器成功返回请求的数据。',
};

interface error {
  name: string;
  data: any;
  type: string;
  response: {
    status: number;
    statusText: string;
    url: string;
  };
}

/**
 * 异常处理程序
 */
const errorHandler = (error: error) => {
  if (error.name === 'BizError') {
    //message.error({
    //  message: `请求错误 ${error.data.code}`,
    //  description: error.data.msg,
    //});
    return error.data;
  }
  //const { response } = error;
  //const errortext = codeMessage[response.status] || response.statusText;
  //const { status, url } = response;
  //message.error({
  //  message: `请求错误 ${status}: ${url}`,
  //  description: errortext,
  //});
};

export default errorHandler;
