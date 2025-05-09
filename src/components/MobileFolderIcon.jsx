import React from 'react';

const MobileFolderIcon = ({ size = 40, count = 0, style = {} }) => {
  // These values are from the SVG for the indicator and text
  const indicatorCenterX = 3450.86;
  const indicatorCenterY = 924.91;
  const indicatorRx = 924.082;
  const indicatorRy = 934.58;
  const textX = 2983.85;
  const textY = 1255.18;
  const fontSize = 1400;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 4417 4781"
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
    >
      <rect id="Mobile_folder" x="0" y="0" width="2944.45" height="3186.89" fill="none"/>
      <path d="M1532.17,469.63l0,2597.22l-8.16,40.25l-22.1,32.79l-32.79,22.1l-40.25,8.16l-1312.9,-0l-40.25,-8.16l-32.79,-22.1l-22.1,-32.79l-8.16,-40.25l0,-2597.22l8.16,-40.25l22.1,-32.79l32.79,-22.1l40.25,-8.16l1312.9,0l40.25,8.16l32.79,22.1l22.1,32.79l8.16,40.25Zm-569.61,2472.25c0,-39.63 -32.18,-71.81 -71.81,-71.81l-236.66,0c-39.63,0 -71.81,32.18 -71.81,71.81c-0,39.63 32.18,71.81 71.81,71.81l236.66,-0c39.63,-0 71.81,-32.18 71.81,-71.81Zm404.27,-213.02l0,-2197.53l-1188.83,0l0,2197.53l1188.83,-0Zm-594.42,-2117.01c51.74,-0 93.75,42.01 93.75,93.75c0,51.74 -42.01,93.75 -93.75,93.75c-51.74,-0 -93.75,-42.01 -93.75,-93.75c0,-51.74 42.01,-93.75 93.75,-93.75Z" style={{fill:'#274c77'}}/>
      {/* Static color circle */}
      <ellipse cx={indicatorCenterX} cy={indicatorCenterY} rx={indicatorRx} ry={indicatorRy} style={{fill:'#ffb300'}}/>
      {/* Dynamic count overlay, centered in the circle */}
      <text x={indicatorCenterX} y={indicatorCenterY + 120} style={{ fontFamily: "'RobotoCondensed-Bold', 'Roboto Condensed'", fontWeight: 700, fontSize, fill: '#274c77' }} textAnchor="middle" dominantBaseline="middle">{count}</text>
    </svg>
  );
};

export default MobileFolderIcon; 