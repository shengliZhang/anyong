const UMI_PUBLIC_PATH =
  process.env.NODE_ENV === 'production' ? 'UMI_PUBLIC_PATH_PLACEHOLDER__' : '.';
const UMI_ROUTER_BASE =
  process.env.NODE_ENV === 'production' ? 'UMI_ROUTER_BASE_PLACEHOLDER__' : '.';

module.exports = {
  UMI_PUBLIC_PATH,
  UMI_ROUTER_BASE,
};
