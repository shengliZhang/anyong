import { isProduction } from '@/helpers/env';
const { UMI_PUBLIC_PATH } = require('./umiconfig');
/**
 * 所有的 *_PLACEHOLDER__，在npm run serve启动时，都需要指定运行时需要的值
 * 这个在“Use docker for release”时非常好用，可以针对不同的运行环境使用同一个镜像，指定不同的环境变量
 */
export const STORAGE_TOKEN_KEY = 'platform-token';

export const STORAGE_EXPIRE_DAYS = 49;
export const QRCODE_URL = 'QRCODE_URL_PLACEHOLDER__';

export const STORAGE_DOMAIN = !isProduction
  ? window.location.hostname
  : 'STORAGE_DOMAIN_PLACEHOLDER__';

export const ENV_API_HOST = !isProduction
  ? 'http://192.168.10.91:9901'
  : 'ENV_API_HOST_PLACEHOLDER__';
export const DESK_API_HOST = !isProduction
  ? 'http://dftestv3.dfocus.co/bookinganyong'
  : 'DESK_HOST_PLACEHOLDER__';
export const MEETING_API_HOST = !isProduction
  ? 'http://192.168.10.91/apis'
  : 'MEETING_HOST_PLACEHOLDER__';

// 错误message提示  1 打开 其他关闭
export const DEBUGER_TIP = !isProduction ? '1' : 'DEBUGER_TIP_PLACEHOLDER__';

export const appKey = '3f5052ae825dc312df8f5ab84ab1c959';
export const mapId = '1424550523468173313';
export const themeId = '1424550523468173313'; //'1432959141842407426';
export const appName = '招商银行_SaaS平台';

export const mapServerURL = !isProduction
  ? `https://maps.data.dfocus.tech/fengmaps`
  : `MAP_SERVER_URL_PLACEHOLDER__`;
//export const mapThemeURL = !isProduction
//  ? `https://maps.data.dfocus.tech/fengmaps`
//  : 'MAP_THEME_URL_PLACEHOLDER__';
