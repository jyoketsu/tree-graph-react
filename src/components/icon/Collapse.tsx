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
      d="M475.648 728.064L236.032 473.6c-14.848-15.872-18.944-38.912-11.264-59.392 8.192-20.48 26.624-33.792 47.616-33.792h479.744c20.992 0 39.424 13.312 47.616 33.792 2.56 6.656 4.096 13.824 4.096 20.992 0 14.336-5.12 28.16-15.36 38.4l-239.616 254.464c-9.728 10.24-23.04 15.872-36.352 15.872-14.336 0-27.136-5.632-36.864-15.872z"
    ></path>
  </svg>
);

export default SVG;
