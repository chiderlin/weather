import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { fetchCityWeather } from './useWeatherApi.jsx';

const locations = {
  宜蘭縣: '003',
  桃園市: '007',
  新竹縣: '009',
  新竹市: '055',
  苗栗縣: '015',
  彰化縣: '017',
  南投縣: '023',
  雲林縣: '027',
  嘉義縣: '031',
  屏東縣: '035',
  臺東縣: '039',
  花蓮縣: '043',
  澎湖縣: '045',
  基隆市: '051',
  嘉義市: '059',
  臺北市: '063',
  高雄市: '067',
  新北市: '071',
  臺中市: '075',
  臺南市: '079',
  連江縣: '083',
  金門縣: '087',
};

const WeatherSettingWrapper = styled.div`
  postion: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: #212121;
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: #212121;
  margin-bottom: 15px;
`;

const StyledInputList = styled.input`
  display: block;
  box-sizing: border-box;
  backaground: transparent;
  border: 1px solid #212121;
  width: 100%;
  min-height: 30px;
  border-radius: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top:20px;

  > button {
    display flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding:0;
      border-style:none;
    }
  }
`;

const Back = styled.button`
  && {
    color: #212121;
    border-color: #212121;
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

const WeatherSetting = (props) => {
  const { setCurrentPage } = props;

  // STEP1: 定義locationName, default 為 空值
  const [locationName, setLocationName] = useState('臺北市');

  // STEP3: 定義handleChange要做的事情
  const handleChange = (e) => {
    console.log(e.target.value);

    // STEP4: 把使用者輸入內容更新到React內
    setLocationName(e.target.value);
  };

  // 1. 定義function
  const handleSave = () => {
    // 2. 判斷地區是否出現在array中
    const locationsArray = Object.keys(locations);
    if (locationsArray.includes(locationName)) {
      console.log(`儲存的地區資訊為：${locationName}`);
      const cityCode = locations[locationName];
      fetchCityWeather(cityCode).then((res) => {
        setCurrentPage('WeatherCard');
      });
    } else {
      // 4. 不包含，顯示錯誤資訊
      alert(`儲存失敗：您輸入的${locationName}並非有效地區`);
      return;
    }
  };

  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      <StyledLabel htmlFor="location">地區</StyledLabel>
      {/* STEP2: 使用onChange事件來監聽使用者輸入資料 */}
      <StyledInputList
        list="location-list"
        id="location"
        name="location"
        onChange={handleChange}
        value={locationName}
      />
      <datalist id="location-list">
        {/* 定義datalist中的options */}
        {Object.keys(locations).map((location) => (
          <option value={location} key={location} />
        ))}
      </datalist>
      <ButtonGroup>
        <Back onClick={() => setCurrentPage('WeatherCard')}>返回</Back>
        <Save onClick={handleSave}>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
};

export default WeatherSetting;
