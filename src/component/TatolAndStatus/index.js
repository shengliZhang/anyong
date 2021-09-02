import React from 'react';
import style from './style.less';
import formatText from '../../helpers/format';

function Index({ data, type = 'meeting' }) {
  console.log('Index is', data);
  return (
    <div className={style.container}>
      <div className={style.left}>
        <div className={style.pie}>
          <div className={style.count}>{data?.total}</div>
          <div className={style.name}>
            {formatText(type === 'meeting' ? 'MEETING_TOTAL' : 'DESK_TOTAL')}
          </div>
        </div>
      </div>
      <div className={style.right}>
        <Item
          text={formatText('FLOOR_CAN_USE')}
          color="#59deab"
          num={data?.available}
          total={data?.total}
        />
        <Item
          text={formatText('FLOOR_WETING')}
          color="#ffdc68"
          num={data?.waiting}
          total={data?.total}
        />
        <Item
          text={formatText('FLOOR_USEING')}
          color="#ff6c6c"
          num={data?.using}
          total={data?.total}
        />
        <Item
          text={formatText('FLOOR_OCP')}
          color="#9a91ff"
          num={data?.occupancy}
          total={data?.total}
        />
      </div>
    </div>
  );
}

export default Index;

function Item({ text, color, num, total }) {
  return (
    <div className={style.statusContainer}>
      <div className={style.top}>
        <i style={{ backgroundColor: color }} />
        <div>
          <span className={style.keys}>{text}</span>
          <span className={style.nums}>{num}</span>
        </div>
      </div>
      <div className={style.bot}>
        <div
          style={{ width: `${(num / total) * 207}px` }}
          className={style.bar}
        />
      </div>
    </div>
  );
}
