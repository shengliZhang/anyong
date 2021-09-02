import { defineConfig } from 'umi';
import { IConfig } from '@umijs/types';
const { UMI_PUBLIC_PATH, UMI_ROUTER_BASE } = require('./src/config/umiconfig');

const config: IConfig = {
  nodeModulesTransform: {
    type: 'none',
  },
  antd: {},
  routes: [{ path: '/', component: '@/pages/index' }],
  locale: {
    default: 'zh-CN',
    antd: true,
    title: false,
    baseNavigator: true,
    baseSeparator: '-',
  },
  fastRefresh: {},
};

if (UMI_PUBLIC_PATH && UMI_ROUTER_BASE) {
  config.publicPath = `/${UMI_PUBLIC_PATH}/`;
  config.base = `/${UMI_ROUTER_BASE}`;
}
export default defineConfig(config);
