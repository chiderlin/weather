import { useMemo } from 'react';
import styled from 'styled-components';
// 載入SVG圖有兩種方式
// 1. 把svg變成一個組件
// 2. 把原始svg匯入，搭配img使用

//  1的使用方式
import { ReactComponent as CloudyIcon } from './images/day-cloudy.svg';

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

export default function WeatherIcon() {
    return (
        <IconContainer>
            <CloudyIcon />
        </IconContainer>
    );
}
