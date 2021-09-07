import { RequestConfig } from 'umi';
//import { ENV_API_HOST } from '@/config';
//import errorHandler from '@/util/errorHandle';

export const request: RequestConfig = {
  //credentials: 'include',
  //prefix: ENV_API_HOST,
  //errorHandler,
  // 自定义端口规范
  //errorConfig: {
  //  adaptor: (res) => {
  //    return { ...res };
  //  },
  //},
  middlewares: [],
};
