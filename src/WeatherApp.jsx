// useCallback用來
import React, { useState, useEffect, useCallback, useMemo } from 'react'; // [useState]STEP 1.載入useState
import styled from 'styled-components';
import WeatherCard from './WeatherCard.jsx';
import axios from 'axios';
import dayjs from 'dayjs';

const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TOKEN = process.env.REACT_APP_TOKEN;
const DOMAIN = process.env.REACT_APP_DOMAIN;

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

const WeatherApp = () => {
  let moment;
  useMemo(() => fetchSunRiseAndSet(), []).then((m) => {
    moment = m;
  });

  // [useState]STEP2 定義會使用到的資料狀態
  const [currentWeather, setCurrentWeather] = useState({
    observationTime: '2024-01-01 12:00:00',
    locationName: '臺北市',
    description: '多雲時晴',
    temperature: 27,
    windSpeed: 0.3,
    humid: 0.88,
    weatherCode: 1,
    isLoading: true,
  });

  // ---- old ------
  // [fetchAPI]STEP1: 抓取API
  const fetchCurrentWeather = async () => {
    const URL = `${DOMAIN}/api/v1/rest/datastore/F-D0047-061?Authorization=${TOKEN}&limit=1&offset=0`;
    const data = (await axios.request({ method: 'GET', url: URL })).data;
    // console.log('data', data);
    const locationData = data.records.locations[0];
    const locationsName = locationData.locationsName;
    const loca = locationData.location[0];
    const weaEle = loca.weatherElement.filter((wea) => {
      if (['Wx', 'PoP6h', 'CI', 'WS', 'T', 'RH'].includes(wea.elementName)) {
        const time = wea.time[0];
        const datetime = time.dataTime ? time.dataTime : time.startTime;
        const elementValue = time.elementValue[0].value;
        if (wea.elementName === 'Wx') {
          wea.weatherCode = time.elementValue[1].value;
        }
        wea.datetime = datetime;
        wea.elementValue = elementValue;
        return wea;
      }
    });
    //console.log(weaEle);

    setCurrentWeather({
      observationTime: weaEle[0].datetime,
      locationName: locationsName,
      description: weaEle.find((ele) => ele.elementName === 'Wx').elementValue,
      weatherCode: weaEle.find((ele) => ele.elementName === 'Wx').weatherCode,
      temperature: weaEle.find((ele) => ele.elementName === 'T').elementValue,
      windSpeed: weaEle.find((ele) => ele.elementName === 'WS').elementValue,
      humid: weaEle.find((ele) => ele.elementName === 'RH').elementValue,
      isLoading: false,
    });
  };
  // ---- old ------
  // useCallback可以避免函式內容明明相同卻被判斷為不同，進而導致useEffect一直重複執行的問題
  /**
   * const memoizedCallback = useCallback(() => {
   *    doSomething(a,b)
   *
   * }, [a,b])
   *
   */

  const fetchData = useCallback(() => {
    setCurrentWeather((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    fetchCurrentWeather();
  }, []); // -> []改變才會產生新的fetchData

  // *渲染畫面後才會執行裡面的func, 適合放api呼叫的地方
  // useEffect第一個參數為func：裡面會放要執行的func,
  // 第二個參數為array：如果資料和原來的不一樣會重新渲染畫面 (如果沒給這個參數就會一直重新渲染)
  useEffect(() => {
    console.log('execute function in useEffect');
    fetchData();
  }, [fetchData]); // -> []改變才會產生新的fetchData

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
