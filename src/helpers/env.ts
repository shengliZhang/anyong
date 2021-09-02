export const isDev: boolean =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
export const isProduction: boolean = process.env.NODE_ENV === 'production';

export function isOpenPages(pathname: string) {
  return pathname.startsWith('/o/');
}
