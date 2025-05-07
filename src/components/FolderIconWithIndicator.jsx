import React from 'react';

export const FOLDER_COLORS = [
  '#ff7043', // deep orange
  '#42a5f5', // blue
  '#66bb6a', // green
  '#ab47bc', // purple
  '#ffa726', // orange
  '#26a69a', // teal
  '#ec407a', // pink
  '#7e57c2', // deep purple
  '#d4e157', // lime
  '#789262', // olive
  '#8d6e63', // brown
  '#29b6f6', // light blue
  '#cfd8dc', // blue gray
];

export const FolderIconWithIndicator = ({ indicatorColor = "#ffb300", size = 18, count = 0, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 7632 4648"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    xmlSpace="preserve"
  >
    <rect id="Folder_icon_with_indicator" x="0" y="0" width="7630.58" height="4647.02" fill="none"/>
    <path id="Folder" d="M0,3616.18l0,-2268.1c-0,-68.382 55.434,-123.816 123.816,-123.816l1087.374,-0c38.504,-0 74.622,18.64 96.928,50.024l247.948,348.846c21.734,30.576 56.926,48.74 94.44,48.74l1539.26,-0c41.962,-0 82.206,16.668 111.878,46.342c29.672,29.672 46.342,69.916 46.342,111.878l0,213.342c0,0.474 -0.026,0.942 -0.074,1.402c-0.04,0.364 -0.326,0.646 -0.68,0.69c0.498,4.158 0.754,8.39 0.754,12.682l0,1557.978c0,58.298 -47.33,105.626 -105.626,105.626l-3136.74,0c-58.296,0 -105.626,-47.328 -105.626,-105.626Z" fill="#274c77"/>
    <circle id="Indicator" cx="2637.54" cy="3449.58" r="879.92" fill={indicatorColor}/>
    <path d="M2637.54,2280.86c645.028,0 1168.71,523.682 1168.71,1168.712c0,645.028 -523.682,1168.71 -1168.71,1168.71c-645.03,0 -1168.712,-523.682 -1168.712,-1168.71c0,-645.03 523.682,-1168.712 1168.712,-1168.712Zm-0,405.064c-421.468,0 -763.648,342.18 -763.648,763.648c0,421.468 342.18,763.646 763.648,763.646c421.468,0 763.646,-342.178 763.646,-763.646c-0,-421.468 -342.178,-763.648 -763.646,-763.648Z" fill="#fff" stroke="#8b8c89" strokeWidth="25"/>
    <text x="4472" y="2458.72" style={{ fontFamily: "Roboto, 'Roboto Condensed', sans-serif", fontWeight: 500, fontSize: 2200, fill: "#274c77" }}>
      {count}
    </text>
  </svg>
); 