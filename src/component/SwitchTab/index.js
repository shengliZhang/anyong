import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { ReactComponent as TimeUp } from '@/assets/timeup.svg';
import { ReactComponent as Book } from '@/assets/book.svg';
import formatText from '../../helpers/format';

function SwitchTabs({ onChange, active }) {
  //const [avtive, setAvtive] = useState('real');
  const handleItemClick = (type) => {
    return () => {
      //setAvtive(type);
      if (type === active) return;
      onChange && onChange(type);
    };
  };

  //useEffect(() => {
  //  setAvtive(acriveTab);
  //}, [acriveTab]);

  return (
    <div className={styles.container}>
      <div
        onClick={handleItemClick('real')}
        className={`${styles.item} ${
          active === 'real' ? styles.activeleft : ''
        }`}
      >
        <div>
          <TimeUp width={40} height={30} />
        </div>
        <div>{formatText('REAL')}</div>
      </div>
      <div
        onClick={handleItemClick('book')}
        className={`${styles.item} ${
          active === 'book' ? styles.activeRight : ''
        }`}
      >
        <div>
          <Book width={34} height={30} />
        </div>
        <div>{formatText('BOOK')}</div>
      </div>
    </div>
  );
}

export default SwitchTabs;
