import React, { useRef, useEffect } from 'react';
import { Carousel } from 'antd';
import Weather from '../Weather';
import ChartsPart from '../ChartsPart';
import style from './style.less';

function Right({ weatherData, meetingUse, deskUse, floor }) {
  const swiper = useRef();

  useEffect(() => {
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

    const timer = setInterval(() => {
      slide();
    }, 30 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Carousel ref={swiper} dots>
      <Weather weatherData={weatherData} />
      <ChartsPart meetingUse={meetingUse} deskUse={deskUse} floor={floor} />
    </Carousel>
  );
}

export default Right;
