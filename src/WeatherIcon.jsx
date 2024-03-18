import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// 載入SVG圖有兩種方式cla
// 1. 把svg變成一個組件
// 2. 把原始svg匯入，搭配img使用

//  1的使用方式
import { ReactComponent as CloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as CogIcon } from './images/cog.svg';
import { ReactComponent as DayClearIcon } from './images/day-clear.svg';
import { ReactComponent as DayCloudyFogIcon } from './images/day-cloudy-fog.svg';
import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as DayFogIcon } from './images/day-fog.svg';
import { ReactComponent as DayPartiallyClearWithRainIcon } from './images/day-partially-clear-with-rain.svg';
import { ReactComponent as DaySnowingIcon } from './images/day-snowing.svg';
import { ReactComponent as DayTunderstormIcon } from './images/day-thunderstorm.svg';
import { ReactComponent as NightClearIcon } from './images/night-clear.svg';
import { ReactComponent as NightCloudyFogIcon } from './images/night-cloudy-fog.svg';
import { ReactComponent as NightCloudyIcon } from './images/night-cloudy.svg';
import { ReactComponent as NightFogIcon } from './images/night-fog.svg';
import { ReactComponent as NightPartiallyClearWithRainIcon } from './images/night-partially-clear-with-rain.svg';
import { ReactComponent as NightSnowingIcon } from 'react';
import { ReactComponent as NightTunderstormIcon } from './images/night-thunderstorm.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';

/*
const App = () => {
    return (
        <div>
            <Cloudy />
            <RainIcon />
        </div>
    )
}
*/

// 2的使用方式
/*
import cloudyIcon from "./images/day-cloudy.svg";
import rainIcon from "./images/rain.svg";

const App = () => (
  <div>
    <img src={cloudyIcon} alt="cloudy" />
    <img src={rainIcon} alt="rain" />
  </div>
);
*/

// ------- old -------
// const Cloudy = styled(CloudyIcon)`
//   flex-basis: auto;
// `;
// ------- old -------

const IconContainer = styled.div`
  flex-basis: auto;
  svg {
    max-height: 110px;
  }
`;

const weatherTypes = {
  isTunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
  isClear: [1],
  isCloudyFog: [25, 26, 27, 28],
  isCloudy: [2, 3, 4, 5, 6, 7],
  isFog: [24],
  isPartiallyClearWithRain: [
    8, 9, 10, 11, 12, 13, 14, 19, 20, 29, 30, 31, 32, 38, 39,
  ],
  isSnowing: [23, 37, 42],
};

const weatherIcons = {
  day: {
    isTunderstorm: <DayTunderstormIcon />,
    isClear: <DayClearIcon />,
    isCloudyFog: <DayCloudyFogIcon />,
    isCloudy: <DayCloudyIcon />,
    isFog: <DayFogIcon />,
    isPartiallyClearWithRain: <DayPartiallyClearWithRainIcon />,
    isSnowing: <DaySnowingIcon />,
  },
  night: {
    isTunderstorm: <NightTunderstormIcon />,
    isClear: <NightClearIcon />,
    isCloudyFog: <NightCloudyFogIcon />,
    isCloudy: <NightCloudyIcon />,
    isFog: <NightFogIcon />,
    isPartiallyClearWithRain: <NightPartiallyClearWithRainIcon />,
    isSnowing: <NightSnowingIcon />,
  },
};

const WeatherIcon = ({ currentWeatherCode, moment }) => {
  const [currentWeatherIcon, setCurrentWeatherIcon] = useState('isClear');
  console.log('moment', moment);
  useEffect(() => {
    // 使用迴圈找出該天氣代碼對應到的天氣型態
    const weatherCode2Type = (weatherCode) => {
      const [weatherType] =
        Object.entries(weatherTypes).find(([weatherType, weatherCodes]) =>
          weatherCodes.includes(Number(weatherCode))
        ) || [];

      return weatherType;
    };

    const currentWeatherIcon = weatherCode2Type(currentWeatherCode); //isClear

    setCurrentWeatherIcon(currentWeatherIcon);
  }, [currentWeatherCode]);

  return (
    <IconContainer>{weatherIcons[moment][currentWeatherIcon]}</IconContainer>
  );
};

export default WeatherIcon;
