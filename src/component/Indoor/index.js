import React from 'react';
import Dashboard from '../Dashboard';
import styles from './index.less';
import { isObject } from '../../helpers/object';
import formatText from '../../helpers/format';

function Indoor({ data, type = 'F19' }) {
  if (!data) return null;
  const air = isObject(data) ? data[type] : {};
  return (
    <div className={styles.containers}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div>
            <i />
            <span>{formatText('WENDU')}</span>
          </div>
          <span>{Number(air?.rt || 0).toFixed(0)}°C</span>
        </div>
        <div className={styles.right}>
          <div>
            <i />
            <span>{formatText('SHIDU')}</span>
          </div>
          <span>{Number(air?.rh || 0).toFixed(0)}%</span>
        </div>
      </div>
      <Dashboard data={air} />
    </div>
  );
}

export default Indoor;
