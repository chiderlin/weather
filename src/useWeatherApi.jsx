/* custom hook */
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

const TOKEN = process.env.REACT_APP_TOKEN;
const DOMAIN = process.env.REACT_APP_DOMAIN;

export async function fetchCityWeather(cityCode = '063') {
  const URL = `${DOMAIN}/api/v1/rest/datastore/F-D0047-${cityCode}?Authorization=${TOKEN}&limit=1&offset=0`;
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
  return { weaEle, locationsName };
}

const useWeatherApi = () => {
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

  const fetchCurrentWeather = async (cityCode) => {
    const { weaEle, locationsName } = await fetchCityWeather(cityCode);
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

  // -------------------
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

  // 把要給其他React組件使用的資料或方法回傳出去
  return [currentWeather, fetchData];
};

export default useWeatherApi;
