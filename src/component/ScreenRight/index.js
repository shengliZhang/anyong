import React, { useRef, useEffect } from 'react';
import { Carousel } from 'antd';
import Weather from '../Weather';
import ChartsPart from '../ChartsPart';
import style from './style.less';

function Right({ weatherData, meetingUse, deskUse, floor }) {
  const swiper = useRef();
  const timer = useRef();

  const intervalFun = () => {
    let next = true;
    const slide = () => {
      if (next) {
        next = false;
        swiper.current.next();
      } else {
        next = true;
        swiper.current.prev();
      }
    };

    timer.current = setInterval(() => {
      slide();
    }, 30 * 1000);
  };

  useEffect(() => {
    intervalFun();
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  const handleChange = (type) => {
    //console.log('handleChange', type);
    //if (timer.current) {
    //  clearInterval(timer.current);
    //}
    //intervalFun(type);
  };

  return (
    // onSwipe={handleChange}
    <Carousel ref={swiper} dots>
      <Weather weatherData={weatherData} />
      <ChartsPart meetingUse={meetingUse} deskUse={deskUse} floor={floor} />
    </Carousel>
  );
}

export default Right;
