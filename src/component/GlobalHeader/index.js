import React, { useEffect, useState } from 'react';
import { getLocale, setLocale } from 'umi';
import formatText from '@/helpers/format';
import PropTypes from 'prop-types';
import moment from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import styles from './style.less';
import { ReactComponent as Logo } from '@/assets/Logo.svg';

function GlobalHeader({ langChange }) {
  const [currentTime, setTime] = useState({ hhmm: '', yymmdd: '' });
  const currentLang = getLocale();
  const key = formatText('ydm');
  currentLang === 'en-US' ? moment.locale('en') : moment.locale('zh-cn');

  useEffect(() => {
    function tick() {
      const hour = moment().hour();
      const minute = moment().minute();
      const nowSec = moment().second();

      if (hour === 1 && minute === 1 && nowSec === 1) {
        window.location.reload();
      }
      setTime({
        hhmm: `${hour}:${minute < 10 ? `0${minute}` : minute}`,
        yymmdd: `${moment().format(key)}`,
      });
    }
    const timerID = setInterval(tick, 1000);

    return () => {
      clearInterval(timerID);
    };
  });

  return (
    <div className={styles.container}>
      <div>
        <Logo width={136} height={110} />
      </div>
      <div className={styles.secDiv}>
        <div className={styles.switchLanguage}>
          <span
            onClick={() => {
              langChange && langChange('en');
              setLocale('en-US', false);
            }}
            className={`${currentLang === 'en-US' ? styles.active : ''}`}
          >
            EN
          </span>
          <span
            onClick={() => {
              langChange && langChange('zh');
              setLocale('zh-CN', false);
            }}
            className={`${currentLang === 'zh-CN' ? styles.active : ''}`}
          >
            中
          </span>
        </div>

        <div className={styles.times}>
          <div className={styles.hhmm}>{currentTime.hhmm}</div>
          <div className={styles.yymmdd}>{currentTime.yymmdd}</div>
        </div>
      </div>
    </div>
  );
}

GlobalHeader.propTypes = {};

export default GlobalHeader;
