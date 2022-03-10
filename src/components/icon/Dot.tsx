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
    preserveAspectRatio="xMinYMin meet"
    width={width}
    height={height}
  >
    <path
      d="M512 298.666667c117.333333 0 213.333333 96 213.333333 213.333333s-96 213.333333-213.333333 213.333333-213.333333-96-213.333333-213.333333S394.666667 298.666667 512 298.666667z"
      fill={fill}
    ></path>
  </svg>
);

export default SVG;
