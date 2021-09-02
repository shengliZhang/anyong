import React from 'react';
import { Progress } from 'antd';
import formatText from '../../helpers/format';
import styles from './style.less';

function Dashboard({ data }) {
  console.log('Dashboard is', data);
  return (
    <div className={styles.containers}>
      <Item
        max={1}
        color={TVOCword(Number(data?.tvoc)).color} //"#59DEAB"
        text="TVOC"
        tag={TVOCword(Number(data?.tvoc)).text} //"合格"
        per="" //"mg/m³"
        num={Number(data?.tvoc) / 1000}
      />
      <Item
        max={250}
        color={PM25word(Number(data.pm25 || 0)).color} //"#FF6C6C"
        text="PM2.5"
        tag={PM25word(Number(data.pm25 || 0)).text} //"不合格"
        per="" //"ug/m³"
        num={Number(data.pm25 || 0).toFixed(0)}
      />
      <Item
        max={5000}
        color={CO2word(Number(data?.co2 || 0)).color} //"#FFDC68"
        text="CO₂"
        tag={CO2word(Number(data?.co2 || 0)).text}
        per="ppm"
        num={Number(data?.co2 || 0)}
      />
    </div>
  );
}

export default Dashboard;

function Item({ max, color, text, tag, num, per }) {
  return (
    <div className={styles.warper}>
      <Progress
        type="dashboard"
        strokeColor={color}
        trailColor="#0f2140"
        width={324}
        format={() => ''}
        percent={!isNaN(num) && num ? (Number(num) / max) * 100 : 0}
      />
      <div className={styles.numsAndper}>
        <span>{!isNaN(num) && num ? num : 0}</span>
        <span>{per}</span>
      </div>
      <div className={styles.btms}>
        <span>0</span>
        <span>{max}</span>
      </div>
      <div className={styles.text}>{text}</div>
      <div className={styles.tag} style={{ color }}>
        {tag}
      </div>
    </div>
  );
}

function PM25word(nums) {
  if (nums <= 35) {
    return {
      color: '#59deab',
      text: formatText('YOU'),
    };
  }
  if (nums > 35 && nums <= 75) {
    return {
      color: '#ffdc68',
      text: formatText('LIANG'),
    };
  }
  if (nums > 75 && nums <= 115) {
    return {
      color: '#ffdc68',
      text: formatText('ENV_BUIDING_Z'),
    };
  }
  if (nums > 115 && nums <= 150) {
    return {
      color: '#ff6c6c',
      text: formatText('ENV_BUIDING_C'),
    }; // '中度污染'
  }
  if (nums > 150) {
    return {
      color: '#ff6c6c',
      text: formatText('ENV_BUIDING_D'),
    }; // '重度污染'
  }
  return {};
}

function TVOCword(n) {
  const num = n / 1000;
  if (num <= 0.2) {
    return {
      color: '#59deab',
      text: formatText('ENV_BUIDING_Y'),
    };
  }
  if (num < 0.3 && num > 0.2) {
    return {
      color: '#ffdc68',
      text: formatText('ENV_BUIDING_L'),
    };
  }
  if (num < 0.6 && num >= 0.3) {
    return {
      color: '#ffdc68',
      text: formatText('ENV_BUIDING_Zt'),
    };
  }
  if (num >= 0.6) {
    return {
      color: '#ff6c6c',
      text: formatText('ENV_BUIDING_Ct'),
    };
  }
  return {
    color: '',
    text: '',
  };
}

export function isNumber(obj) {
  return Object.prototype.toString.call(obj) === '[object Number]';
}

function NumToPercent(num, max) {
  if (isNumber(num)) {
    return (num / max) * 100;
  }
  return 0;
}

function CO2word(nums) {
  if (nums <= 550) {
    return {
      color: '#59deab',
      text: formatText('ENV_BUIDING_Y'),
    };
  }
  if (nums > 550 && nums <= 900) {
    return {
      color: '#ffdc68',
      text: formatText('ENV_BUIDING_L'),
    };
  }
  if (nums > 900 && nums <= 1600) {
    return {
      color: '#ffdc68',
      text: formatText('ENV_BUIDING_Zt'),
    };
  }
  if (nums > 1600) {
    return {
      color: '#ff6c6c',
      text: formatText('ENV_BUIDING_Ct'),
    };
  }
  return {
    color: '',
    text: '',
  };
}

//function AQIword(nums) {
//  if (nums <= 50) {
//    return {
//      color: '#59deab',
//      text: formatText('HE_GE'), // '优'
//    };
//  }
//  if (nums > 50 && nums <= 150) {
//    return {
//      color: '#ffdc68',
//      text: formatText('YI_BAN'), // '优'
//    };
//  }
//  if (nums > 150) {
//    return {
//      color: '#ff6c6c',
//      text: formatText('BU_HE_GE'), // '优'
//    }; // '重度污染'
//  }
//  return '';
//}

function PM10word(nums) {
  if (nums <= 50) {
    return {
      color: '#59deab',
      text: formatText('HE_GE'), // '优'
    };
  }
  if (nums > 50 && nums <= 75) {
    return {
      color: '#ffdc68',
      text: formatText('YI_BAN'), // '优'
    };
  }
  if (nums > 75 && nums <= 100) {
    return {
      color: '#ffdc68',
      text: formatText('BU_HE_GE'), // '优'
    };
  }
  if (nums > 100 && nums <= 150) {
    return {
      color: '#ffdc68',
      text: formatText('BU_HE_GE'), // '优'
    };
  }
  if (nums > 150) {
    return {
      color: '#ff6c6c',
      text: formatText('ENV_BUIDING_D'), // '优'
    }; // '重度污染'
  }
  return {};
}
