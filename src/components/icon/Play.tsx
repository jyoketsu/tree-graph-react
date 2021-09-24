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
      d="M896 128H128c-25.6 0-42.666667 17.066667-42.666667 42.666667v554.666666c0 25.6 17.066667 42.666667 42.666667 42.666667h341.333333v85.333333H298.666667v85.333334h426.666666v-85.333334h-170.666666v-85.333333h341.333333c25.6 0 42.666667-17.066667 42.666667-42.666667V170.666667c0-25.6-17.066667-42.666667-42.666667-42.666667z m-42.666667 554.666667H170.666667V213.333333h682.666666v469.333334z"
    ></path>
    <path fill={fill} d="M640 448l-213.333333-128v256z"></path>
  </svg>
);

export default SVG;
