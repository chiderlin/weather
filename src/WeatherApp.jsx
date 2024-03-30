// useCallback用來
import React, { useState, useEffect, useCallback, useMemo } from 'react'; // [useState]STEP 1.載入useState
import styled from 'styled-components';
import WeatherCard from './WeatherCard.jsx';
import dayjs from 'dayjs';
import useWeatherApi from './useWeatherApi.jsx';
import axios from 'axios';

const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TOKEN = process.env.REACT_APP_TOKEN;
const DOMAIN = process.env.REACT_APP_DOMAIN;
const fetchSunRiseAndSet = async () => {
  const startDate = dayjs().format('YYYY-MM-DD');
  const endDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
  // console.log('startDate', startDate, 'endDate', endDate);
  const URL = `${DOMAIN}/api/v1/rest/datastore/A-B0062-001?Authorization=${TOKEN}&format=JSON&CountyName=臺北市&parameter=SunRiseTime,SunSetTime&timeFrom=${startDate}&timeTo=${endDate}`;
  const data = (await axios.request({ method: 'GET', url: URL })).data;
  // console.log(data);
  const timeList = data.records.locations.location[0].time;
  const dayOrnight = getMoment(timeList, startDate, endDate);
  // console.log('dayOrnight', dayOrnight);
  return dayOrnight;
};

const getMoment = (timeList, startDate, endDate) => {
  const unix_s = dayjs(startDate).valueOf();
  const unix_e = dayjs(endDate).valueOf();
  const currentDayObj = timeList.find((time) => {
    const unix_currentDay = dayjs(time.Date).valueOf();
    return unix_s <= unix_currentDay <= unix_e;
  });
  // console.log(currentDayObj);
  const nowTimestamp = dayjs().valueOf();
  const sunriseTimestamp = dayjs(
    `${startDate} ${currentDayObj.SunRiseTime}`
  ).valueOf();
  const sunsetTimestamp = dayjs(
    `${startDate} ${currentDayObj.SunSetTime}`
  ).valueOf();
  // console.log('sunriseTimestamp', sunriseTimestamp);
  // console.log('nowTimestamp', nowTimestamp);
  // console.log('sunsetTimestamp', sunsetTimestamp);
  if (sunriseTimestamp <= nowTimestamp && nowTimestamp <= sunsetTimestamp)
    return 'day';
  return 'night';
};

const WeatherApp = () => {
  const [currentWeather, fetchData] = useWeatherApi();
  let moment;
  useMemo(() => fetchSunRiseAndSet(), []).then((m) => {
    moment = m;
  });

  // [useState]STEP3 將資料帶到JSX中
  return (
    <Container>
      {/* {console.log('render, isLoading: ', currentWeather.isLoading)} */}
      <WeatherCard
        currentWeather={currentWeather}
        moment={moment}
        fetchData={fetchData}
      />
    </Container>
  );
};

export default WeatherApp;
