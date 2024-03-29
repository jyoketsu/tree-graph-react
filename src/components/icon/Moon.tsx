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
      d="M518.8 512.7c0-178.9 116.1-330.9 278.5-389.1-45.6-16.3-94.6-25.7-145.9-25.7C417 97.9 227 283.7 227 512.7c0 229.1 190 414.8 424.5 414.8 51.4 0 100.3-9.4 145.9-25.7-162.5-58.1-278.6-210.1-278.6-389.1z"
    ></path>
  </svg>
);

export default SVG;
