import React from 'react';
import TitleWithIcon from '../TitleWithIcon';
import OuterDoor from '../OuterDoor';
import Indoor from '../Indoor';
import formatText from '../../helpers/format';
//import Dashboard from '../Dashboard';

function Weather({ weatherData }) {
  return (
    <>
      <TitleWithIcon name={formatText('WEATHER')} />
      <OuterDoor data={weatherData?.outWeather} />
      <TitleWithIcon name={formatText('OUT_DOOR')} />
      <Indoor data={weatherData?.innerAir} type={weatherData.floor} />
    </>
  );
}

Weather.propTypes = {};

export default Weather;
