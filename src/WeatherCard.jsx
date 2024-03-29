import React from 'react';
import styled from 'styled-components';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import { ReactComponent as LoadingIcon } from './images/loading.svg';
import WeatherIcon from './WeatherIcon.jsx';

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: #212121;
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: #828282;
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between; // 平均分配寬度和間距
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #757575;
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal; // 400
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  color: #828282;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Redo = styled.div`
  //  這裡寫css樣式
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  color: #828282;

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer; // 滑鼠指標變成手指
    // 使用rotate動畫效果在svg圖示上
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? '1.5s' : '0s')};
  }
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

// props傳從WeatherApp來的參數
/*
      <WeatherCard
        currentWeather={currentWeather}
        moment={moment}
        fetchData={fetchData}
      />
*/
const WeatherCard = (props) => {
  const { currentWeather, moment, fetchData } = props;
  const {
    observationTime,
    locationName,
    description,
    temperature,
    windSpeed,
    humid,
    weatherCode,
    isLoading,
  } = currentWeather;
  return (
    <WeatherCardWrapper>
      <Location>{locationName}</Location>
      <Description>{description}</Description>
      <CurrentWeather>
        <Temperature>
          {/* {currentWeather.temperature} */}
          {/* 優化溫度格式 */}
          {Math.round(temperature)}

          <Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon
          currentWeatherCode={weatherCode}
          moment={moment || 'day'}
        />
      </CurrentWeather>
      <AirFlow>
        <AirFlowIcon />
        {windSpeed} m/h
      </AirFlow>
      <Rain>
        <RainIcon />
        {humid}%
      </Rain>
      {/* [fetchAPI]STEP2: 綁定onclick時呼叫handleClick */}
      <Redo onClick={fetchData} isLoading={isLoading}>
        最後觀測時間：
        {new Intl.DateTimeFormat('zh-TW', {
          hour: 'numeric',
          minute: 'numeric',
        }).format(new Date(observationTime))}
        {/* 當 isLoading 的時候顯示 LoadingIcon 否則顯示 RefreshIcon */}
        {isLoading ? <LoadingIcon /> : <RefreshIcon />}
      </Redo>
    </WeatherCardWrapper>
  );
};

export default WeatherCard;
