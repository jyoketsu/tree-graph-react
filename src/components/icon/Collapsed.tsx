import React from 'react';
import IconProps from '../../interfaces/IconProps';

const SVG = ({
  style = {},
  fill = '#7C7B7B"',
  width = 29,
  height = 29,
  className = '',
  viewBox = '0 0 1024 1024',
}: IconProps) => (
  <svg
    className={`svg-icon ${className || ''}`}
    style={style}
    viewBox={viewBox}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={width}
    height={height}
  >
    <path
      fill={fill}
      d="M677.888 598.528l-254.464 239.616c-15.872 14.848-38.912 18.944-59.392 11.264-20.48-8.192-33.792-26.624-33.792-47.616V322.56c0-20.992 13.312-39.424 33.792-47.616 6.656-2.56 13.824-4.096 20.992-4.096 14.336 0 28.16 5.12 38.4 15.36l254.464 239.616c10.24 9.728 15.872 23.04 15.872 36.352 0.512 13.824-5.632 26.624-15.872 36.352z"
    ></path>
  </svg>
);

export default SVG;
