import React from 'react';
import IconProps from '../../interfaces/IconProps';
import Play from './Play';
import Moon from './Moon';
import Sun from './Sun';
import Next from './Next';
import Prev from './Prev';
import Attach from './Attach';

const Icon = (props: IconProps) => {
  switch (props.name) {
    case 'play':
      return <Play {...props} />;
    case 'moon':
      return <Moon {...props} />;
    case 'sun':
      return <Sun {...props} />;
    case 'next':
      return <Next {...props} />;
    case 'prev':
      return <Prev {...props} />;
    case 'attach':
      return <Attach {...props} />;
    default:
      return null;
  }
};

export default Icon;
