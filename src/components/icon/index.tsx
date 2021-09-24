import React from 'react';
import IconProps from '../../interfaces/IconProps';
import Play from './Play';

const Icon = (props: IconProps) => {
  switch (props.name) {
    case 'play':
      return <Play {...props} />;
    default:
      return null;
  }
};

export default Icon;
