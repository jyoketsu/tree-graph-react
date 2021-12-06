import React from 'react';
import IconProps from '../../interfaces/IconProps';

const SVG = ({
  style = {},
  width = 22,
  height = 22,
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
      d="M565.228999 34.689634l112.062243 237.506364c8.702621 18.317097 25.411973 31.05108 44.816898 33.994614l250.736267 38.073966c48.688285 7.406826 68.213191 70.036902 32.930782 105.95921L824.307945 635.130487c-13.997782 14.237744-20.348775 34.810484-17.053298 54.927296l42.809217 261.086627c8.342678 50.687968-42.633244 89.441827-86.210339 65.50962l-224.276461-123.252469a57.030963 57.030963 0 0 0-55.271241 0l-224.276461 123.260467c-43.577095 23.91621-94.553017-14.82965-86.20234-65.509619l42.809216-261.094626c3.319474-20.116812-3.095509-40.697551-17.085293-54.927296L18.147691 450.223788C-17.126719 414.30148 2.326198 351.671404 51.070474 344.264578l250.704273-38.073966c19.348934-2.943534 36.074284-15.677516 44.752908-33.994614L458.63789 34.689634c21.820542-46.152687 84.826558-46.152687 106.58311 0z"
      fill="#FFB11B"
    ></path>
  </svg>
);

export default SVG;
