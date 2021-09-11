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
  try {
    return require(`../assets/weather/${type}/${state}.svg`);
  } catch (error) {
    return '';
  }
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

export function boosRoom() {
  const obj = {
    18: [
      ['4335581801100', '4335581801100'],
      ['4335581801102', '4335581801102'],
      ['433558180139', '433558180139'],
      ['433558180172', '433558180172'],
      ['4335581801120', '4335581801120'],
      ['4335581801121', '4335581801121'],
      ['4335581801122', '4335581801122'],
      ['4335581801119', '4335581801119'],
      ['433558180168', '433558180168'],
      ['433558180166', '433558180166'],
      ['4335581801107', '4335581801107'],
      ['4335581801106', '4335581801106'],
      ['4335581801104', '4335581801104'],
      ['4335581801103', '4335581801103'],
      ['433558180194', '433558180194'],
      ['43355818017', '43355818017'],
      ['43355818018', '43355818018'],
      ['43355818019', '43355818019'],
    ],
    20: [
      ['433558200171', '433558200171'],
      ['433558200185', '433558200185'],
      ['433558200186', '433558200186'],
      ['433558200177', '433558200177'],
      ['433558200183', '433558200183'],
      ['433558200181', '433558200181'],
      ['433558200114', '433558200114'],
      ['4335582001103', '4335582001103'],
      ['4335582001105', '4335582001105'],
      ['4335582001101', '4335582001101'],
      ['4335582001100', '4335582001100'],
      ['433558200115', '433558200115'],
      ['433558200116', '433558200116'],
      ['433558200117', '433558200117'],
    ],
  };
  return obj;
}
