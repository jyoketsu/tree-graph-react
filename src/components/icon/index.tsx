import React from 'react';
import IconProps from '../../interfaces/IconProps';
import Play from './Play';
import Moon from './Moon';
import Sun from './Sun';

const Icon = (props: IconProps) => {
  switch (props.name) {
    case 'play':
      return <Play {...props} />;
    case 'moon':
      return <Moon {...props} />;
    case 'sun':
      return <Sun {...props} />;
    default:
      return null;
  }
};

export default Icon;
