import moment from 'dayjs';

export function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
export function isNumber(obj) {
  return Object.prototype.toString.call(obj) === '[object Number]';
}

export function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

export function isNull(obj) {
  return Object.prototype.toString.call(obj) === '[object Null]';
}
export function isUndefined(obj) {
  return Object.prototype.toString.call(obj) === '[object Undefined]';
}

export function reaps(data, key, def) {
  if (isObject(data)) {
    if (data[key]) {
      return data[key];
    }
    return def;
  }
  return def;
}

export function NumToPercent(num, max) {
  if (isNumber(num)) {
    return (num / max) * 100;
  }
  return 0;
}

export function ToDay() {
  return moment().format('YYYY-MM-DD');
}

export function timeObj(date) {
  const reg = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/;
  const match = reg.exec(date);
  return match;
}

export function getWeekDate(date, local) {
  const weeks = {
    zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    en: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
  };
  const now = new Date(date);
  const day = now.getDay();
  const week = weeks[local][day];
  return week;
}

export function Icons(state, type) {
  if (!state) return '';
  return require(`../assets/weather/${type}/${state}.svg`);
}

export function isEqual(obj1, obj2) {
  if (isNull(obj1) && isNull(obj2)) {
    return true;
  }
  if (isUndefined(obj1) && isUndefined(obj2)) {
    return true;
  }
  if (isNull(obj1) && !isNull(obj2)) {
    return false;
  }
  if (isUndefined(obj1) && !isUndefined(obj2)) {
    return false;
  }
  if (!isNull(obj1) && isNull(obj2)) {
    return false;
  }
  if (!isUndefined(obj1) && isUndefined(obj2)) {
    return false;
  }

  if (isArray(obj1) && !isArray(obj2)) {
    return false;
  }
  if (!isArray(obj1) && isArray(obj2)) {
    return false;
  }
  if (obj1.length !== obj2.length) {
    return false;
  }

  const f1 = arrToObj(obj1);
  const f2 = arrToObj(obj2);

  let isSame = true;
  for (let id in f1) {
    if (!f2[id]) {
      isSame = false;
      break;
    }
    if (f1[id] !== f2[id]) {
      isSame = false;
      break;
    }
  }
  return isSame;
}

function arrToObj(arr) {
  const obj = {};

  for (let i = 0; i < arr.length; i++) {
    const { id, status, name } = arr[i];
    obj[id] = `${name}_${status}`;
  }

  return obj;
}

export function compileTime() {
  const cm = moment().minute();
  let nm = 0;
  if (cm < 15) {
    nm = 15;
  }
  if (cm >= 15 && cm < 30) {
    nm = 30;
  }
  if (cm >= 30 && cm < 45) {
    nm = 45;
  }
  if (cm > 45) {
    nm = 60;
  }
  const start = moment().minute(nm).second(0);
  return {
    start: start.format('YYYY-MM-DD HH:mm:ss'),
    end: start.add(12, 'hour').format('YYYY-MM-DD HH:mm:ss'),
  };
}
