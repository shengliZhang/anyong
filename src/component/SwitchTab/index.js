import React, { useState } from 'react';
import styles from './index.less';
import { ReactComponent as TimeUp } from '@/assets/timeup.svg';
import { ReactComponent as Book } from '@/assets/book.svg';
import formatText from '../../helpers/format';

function SwitchTabs({ onChange }) {
  const [avtive, setAvtive] = useState('real');
  const handleItemClick = (type) => {
    return () => {
      setAvtive(type);
      onChange && onChange(type);
    };
  };
  return (
    <div className={styles.container}>
      <div
        onClick={handleItemClick('real')}
        className={`${styles.item} ${
          avtive === 'real' ? styles.activeleft : ''
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
          avtive === 'book' ? styles.activeRight : ''
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
