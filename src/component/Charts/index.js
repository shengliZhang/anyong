import React from 'react';
import ReactEcharts from 'echarts-for-react';
import dayjs from 'dayjs';
import formatText from '../../helpers/format';
import style from './style.less';

function Index({ type, data }) {
  const chartsHeight = '372px';
  return (
    <div className={style.container}>
      <div className={style.title}>
        <div className={style.left}>
          {formatText(type === 'desk' ? 'DESK_SYQS' : 'MEETING_SYQS')}
        </div>
        <div className={style.right}>
          <div>
            <i
              style={{
                backgroundColor: type === 'desk' ? '#155EE0' : '#9a91ff',
              }}
            />
            <span>{formatText('MAX_USE')}</span>
          </div>
          <div>
            <i
              style={{
                backgroundColor: type === 'desk' ? '#1D9EF8' : '#4177ff',
              }}
            />
            <span>{formatText('AVEL_USE')}</span>
          </div>
        </div>
      </div>
      <ReactEcharts
        option={Opts(type, data)}
        notMerge={true}
        style={{ height: chartsHeight, width: '100%' }}
      />
    </div>
  );
}

export default Index;

function Opts(type = 'meeting', data = []) {
  const config = {
    meeting: {
      line: {
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(154, 145, 255, 0.5)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(154, 145, 255, 0)', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        itemStyle: {
          normal: {
            color: '#9a91ff', //改变折线点的颜色
            lineStyle: {
              color: '#9a91ff', //改变折线颜色
            },
          },
        },
      },
      bar: {
        color: '#4177ff',
      },
    },
    desk: {
      line: {
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(21, 94, 224, 0.5)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(21, 94, 224, 0)', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        itemStyle: {
          normal: {
            color: '#155ee0', //改变折线点的颜色
            lineStyle: {
              color: '#155ee0', //改变折线颜色
            },
          },
        },
      },
      bar: {
        color: '#1d9ef8',
      },
    },
  };
  let barData = [];
  let lineData = [];
  let time = [];
  if (Array.isArray(data)) {
    barData = data.map((item) => {
      if (type === 'meeting') {
        return Number(item.currentDayAveRate) * 100;
      }
      return item.currentDayAveRate;
    });
    lineData = data.map((item) => {
      if (type === 'meeting') {
        return Number(item.currentDayMaxRate) * 100;
      }
      return item.currentDayMaxRate;
    });
    time = data.map((item) => dayjs(item.time).format('MM.DD'));
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      show: false,
    },
    animation: false,
    grid: {
      top: 40,
      right: 10,
      bottom: 50,
      left: 80,
    },
    xAxis: [
      {
        type: 'category',
        axisLabel: {
          fontSize: 24,
          lineHeight: 56,
          color: '#b5c0ca',
          lineStyle: {
            color: 'red', //'#5a6b7b'
          },
          interval: 0,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
          lineStyle: {
            color: 'red', //'#5a6b7b'
          },
        },
        data: time,
      },
    ],
    yAxis: [
      {
        nameTextStyle: {
          color: '#b5c0ca',
          fontSize: 24,
          padding: [0, 48, 0, 0],
        },
        type: 'value',
        // min: 0,
        // max: 100,
        axisLine: {
          show: false,
        },
        axisTick: { show: false },
        axisLabel: {
          fontSize: 24,
          color: '#b5c0ca',
          formatter(val) {
            if (type === 'meeting') {
              return `${val}%`;
            }
            return `${val}`;
          },
        },
        splitLine: {
          //分割线
          show: true, //控制分割线是否显示
          lineStyle: {
            //分割线的样式
            color: 'rgba(255, 255, 255, 0.1)',
            width: 2,
            type: 'solid',
          },
        },
      },
    ],
    series: [
      {
        data: lineData,
        type: 'line',
        ...config[type].line,
      },
      {
        type: 'bar',
        data: barData,
        barWidth: '19',
        itemStyle: {
          borderRadius: [9, 9, 0, 0],
          ...config[type].bar,
        },
      },
    ],
  };
  return option;
}
