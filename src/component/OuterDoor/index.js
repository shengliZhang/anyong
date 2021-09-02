import React from 'react';
import dayjs from 'dayjs';
import { getLocale } from 'umi';
import formatText from '../../helpers/format';
import { Icons, ToDay, reaps } from '../../helpers/object';
import styles from './style.less';

const week = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
};

function CureentWeather({ data }) {
  const isZh = getLocale() === 'en-US';
  const today = ToDay();
  const currentWeather = data?.currentWeather;
  const thDay = reaps(data, '7d', []);
  const currentAir = reaps(data, 'currentAir', {});
  const toDayWeather = thDay.find((key) => key.fxDate === today) || {};

  return (
    <>
      <div className={styles.curw}>
        <div className={styles.left}>
          <div className={styles.detail}>
            <p className={styles.temp}>{currentWeather?.temp}°</p>
            <p className={styles.weather}>{currentWeather?.text}</p>
            <p className={styles.renge}>
              {toDayWeather?.tempMin}°C～{toDayWeather?.tempMax}°C
            </p>
          </div>
          <div className={styles.icon}>
            <div
              style={{
                backgroundImage: `url(${Icons(currentWeather?.icon, 'white')})`,
              }}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.it}>
            <div className={styles.k}>{formatText('SHIDU')}</div>
            <div className={styles.v}>
              <span>{currentWeather?.humidity}</span>
              <i>%</i>
            </div>
            <div className={styles.t}></div>
          </div>
          <div className={styles.it}>
            <div className={styles.k}>PM2.5</div>
            <div className={styles.v}>
              <span>{currentAir?.pm2p5}</span>
              <i>μg/m³</i>
            </div>
            <div className={styles.t}>
              <div
                className={`${styles.tags} ${
                  styles[PM25word(currentAir?.pm2p5).color]
                }`}
              >
                {PM25word(currentAir?.pm2p5).text}
              </div>
            </div>
          </div>
          <div className={styles.it}>
            <div className={styles.k}>AQI</div>
            <div className={styles.v}>
              <span>{currentAir?.aqi}</span>
            </div>
            <div className={styles.t}>
              <div
                className={`${styles.tags} ${
                  styles[AQIword(currentAir?.aqi).color]
                }`}
              >
                {AQIword(currentAir?.aqi).text}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.feature}>
        <Card data={thDay[1]} title={`${resolveTime(thDay[1]?.fxDate)}`} />
        <Card data={thDay[2]} title={`${resolveTime(thDay[2]?.fxDate)}`} />
        <Card data={thDay[3]} title={`${resolveTime(thDay[3]?.fxDate)}`} />
      </div>
    </>
  );
}

export default CureentWeather;

function Card({ data, title }) {
  return (
    <div>
      <p className={styles.day}>{title}</p>
      <p className={styles.date}>{dayjs(data?.fxDate).format('YYYY/MM/DD')}</p>
      <p
        className={styles.wiocn}
        style={{ backgroundImage: `url(${Icons(data?.iconDay, 'colorful')})` }}
      ></p>
      <p className={styles.rain}>{data?.textDay}</p>
      <p className={styles.tempRange}>
        {data?.tempMin}℃ ~ {data?.tempMax}℃
      </p>
      <p className={styles.hid}>
        {formatText('SHIDU')}/{data?.humidity}%
      </p>
    </div>
  );
}

function resolveTime(time) {
  if (!time) return '';
  const t = dayjs(time).format('dddd');
  return t;
}

function PM25word(pm) {
  const nums = Number(pm);
  if (nums <= 35) {
    return {
      color: 'green', //'#59deab',
      text: formatText('YOU'),
    };
  }
  if (nums > 35 && nums <= 75) {
    return {
      color: 'yellow', //'#ffdc68',
      text: formatText('LIANG'),
    };
  }
  if (nums > 75 && nums <= 115) {
    return {
      color: 'yellow', //'#ffdc68',
      text: formatText('ENV_BUIDING_Z'),
    };
  }
  if (nums > 115 && nums <= 150) {
    return {
      color: 'red', //'#ff6c6c',
      text: formatText('ENV_BUIDING_C'),
    }; // '中度污染'
  }
  if (nums > 150) {
    return {
      color: 'red', //'#ff6c6c',
      text: formatText('ENV_BUIDING_D'),
    }; // '重度污染'
  }
  return {};
}

function AQIword(aqi) {
  const nums = Number(aqi);
  if (nums <= 50) {
    return {
      color: 'green', //'#59deab',
      text: formatText('HE_GE'), // '优'
    };
  }
  if (nums > 50 && nums <= 150) {
    return {
      color: 'yellow', //'#ffdc68',
      text: formatText('YI_BAN'), // '优'
    };
  }
  if (nums > 150) {
    return {
      color: 'red', //'#ff6c6c',
      text: formatText('BU_HE_GE'), // '优'
    }; // '重度污染'
  }
  return '';
}
