import React from 'react';
import styled from 'styled-components';

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

const WeatherSetting = () => {
  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      <StyledLabel htmlFor="location">地區</StyledLabel>
      <StyledInputList list="location-list" id="location" name="location" />
      <datalist id="location-list">
        {/* 定義datalist中的options */}
        {Object.keys(locations).map((location) => (
          <option value={location} key={location} />
        ))}
      </datalist>
      <ButtonGroup>
        <Back>返回</Back>
        <Save>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
};

export default WeatherSetting;
