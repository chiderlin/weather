// useCallback用來
import React, { useState, useEffect, useCallback } from 'react'; // [useState]STEP 1.載入useState
import styled from 'styled-components';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import WeatherIcon from './WeatherIcon.jsx';

const Container = styled.div`
    background-color: #ededed;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const WeatherCard = styled.div`
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
    }
`;

const WeatherApp = () => {
    const fetchSunRiseAndSet = () => {
        const startDate = formatDate(new Date());
        const endDate = formatDate(new Date(), 8);
        console.log('startDate', startDate, 'endDate', endDate);
        const URL = `${DOMAIN}/v1/rest/datastore/A-B0062-001?Authorization=${TOKEN}&limit=10&offset=0&format=JSON&CountyName=臺北市&parameter=SunRiseTime,SunSetTime&timeFrom=${startDate}&timeTo=${endDate}&sort=Date`;
        fetch(URL)
            .then((response) => response.json())
            .then((data) => {
                // TODO: SunRiseTime, SunSetTime
                console.log('data2', data);
            });
    };
    fetchSunRiseAndSet();

    // [useState]STEP2 定義會使用到的資料狀態
    const [currentWeather, setCurrentWeather] = useState({
        observationTime: '2024-01-01 12:00:00',
        locationName: '臺北市',
        description: '多雲時晴',
        temperature: 27,
        windSpeed: 0.3,
        humid: 0.88,
    });

    // ---- old ------
    // [fetchAPI]STEP1: 抓取API
    const fetchCurrentWeather = () => {
        const TOKEN = process.env.TOKEN;
        const URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-061?Authorization=${TOKEN}&limit=1&offset=0`;
        fetch(URL)
            .then((response) => response.json())
            .then((data) => {
                console.log('data', data);
                const locationData = data.records.locations[0];
                const locationsName = locationData.locationsName;
                const loca = locationData.location[0];
                const weaEle = loca.weatherElement.filter((wea) => {
                    if (
                        ['Wx', 'PoP6h', 'CI', 'WS', 'T', 'RH'].includes(
                            wea.elementName
                        )
                    ) {
                        const time = wea.time[0];
                        const datetime = time.dataTime
                            ? time.dataTime
                            : time.startTime;
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
                    description: weaEle.find((ele) => ele.elementName === 'Wx')
                        .elementValue,
                    weatherCode: weaEle.find((ele) => ele.elementName === 'Wx')
                        .weatherCode,
                    temperature: weaEle.find((ele) => ele.elementName === 'T')
                        .elementValue,
                    windSpeed: weaEle.find((ele) => ele.elementName === 'WS')
                        .elementValue,
                    humid: weaEle.find((ele) => ele.elementName === 'RH')
                        .elementValue,
                });
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
            <WeatherCard>
                <Location>{currentWeather.locationName}</Location>
                {/* <District>{currentWeather.district}</District> */}
                <Description>
                    {/* {currentWeather.observationTime}  */}
                    {/*   優化時間格式 */}
                    {/* {new Intl.DateTimeFormat("zh-TW", {
            hour: "numeric",
            minute: "numeric",
          }).format(new Date(currentWeather.observationTime))} */}
                    {currentWeather.description}
                </Description>
                <CurrentWeather>
                    <Temperature>
                        {/* {currentWeather.temperature} */}
                        {/* 優化溫度格式 */}
                        {Math.round(currentWeather.temperature)}

                        <Celsius>°C</Celsius>
                    </Temperature>
                    <WeatherIcon
                        currentWeatherCode={currentWeather.weatherCode}
                        moment="night"
                    />
                </CurrentWeather>
                <AirFlow>
                    <AirFlowIcon />
                    {currentWeather.windSpeed} m/h
                </AirFlow>
                <Rain>
                    <RainIcon />
                    {currentWeather.humid}%
                </Rain>
                {/* [fetchAPI]STEP2: 綁定onclick時呼叫handleClick */}
                <Redo onClick={fetchCurrentWeather}>
                    最後觀測時間：
                    {new Intl.DateTimeFormat('zh-TW', {
                        hour: 'numeric',
                        minute: 'numeric',
                    }).format(new Date(currentWeather.observationTime))}
                    <RefreshIcon />
                </Redo>
            </WeatherCard>
        </Container>
    );
};

export default WeatherApp;
