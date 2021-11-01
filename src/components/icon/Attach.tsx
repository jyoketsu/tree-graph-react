import React from 'react';
import IconProps from '../../interfaces/IconProps';

const SVG = ({
  style = {},
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
      d="M145.6 0C100.8 0 64 35.2 64 80v862.4C64 987.2 100.8 1024 145.6 1024h732.8c44.8 0 81.6-36.8 81.6-81.6V324.8L657.6 0h-512z"
      fill="#8199AF"
      p-id="2680"
    ></path>
    <path
      d="M960 326.4v16H755.2s-100.8-20.8-99.2-108.8c0 0 4.8 92.8 97.6 92.8H960z"
      fill="#617F9B"
      p-id="2681"
    ></path>
    <path
      d="M657.6 0v233.6c0 25.6 17.6 92.8 97.6 92.8H960L657.6 0z"
      fill="#FFFFFF"
      opacity=".5"
      p-id="2682"
    ></path>
    <path
      d="M489.6 664c17.6-19.2 17.6-48 0-67.2s-48-17.6-65.6 0l-147.2 147.2c-17.6 17.6-17.6 48 0 65.6s48 19.2 65.6 0l91.2-89.6c4.8-4.8 4.8-12.8 0-17.6s-14.4-6.4-19.2 0l-57.6 56c-8 8-19.2 8-27.2 0s-8-20.8 0-28.8l56-56c20.8-20.8 54.4-20.8 75.2 0 20.8 20.8 20.8 54.4 0 75.2l-89.6 89.6c-33.6 33.6-88 33.6-123.2 0-33.6-33.6-33.6-88 0-121.6l147.2-147.2c33.6-33.6 89.6-33.6 123.2 0 33.6 33.6 33.6 88 0 121.6l-14.4 14.4c-1.6-14.4-6.4-28.8-16-41.6h1.6z"
      fill="#FFFFFF"
      p-id="2683"
    ></path>
  </svg>
);

export default SVG;
