import React from 'react';
import IconProps from '../../interfaces/IconProps';

const SVG = ({
  style = {},
  fill = '#7C7B7B"',
  width = 20,
  height = 20,
  className = '',
  viewBox = '0 0 20 20',
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
      d="M7.84 14.955c.206 0 .37-.07.505-.21l4.277-4.179a.787.787 0 00.264-.574.78.78 0 00-.258-.574L8.35 5.24a.695.695 0 00-.51-.21.721.721 0 00-.498 1.247l3.814 3.721-3.814 3.709a.721.721 0 00.498 1.248z"
      fill={fill}
      fillRule="nonzero"
    ></path>
  </svg>
);

export default SVG;
