import React from 'react';
import IconProps from '../../interfaces/IconProps';
import Play from './Play';
import Moon from './Moon';
import Sun from './Sun';
import Next from './Next';
import Prev from './Prev';
import Attach from './Attach';
import Collapse from './Collapse';
import Collapsed from './Collapsed';
import More from './More';
import Preview from './Preview';
import Plus from './Plus';
import Pack from './Pack';
import Fav from './Fav';
import LineCollapse from './LineCollapse';
import Dot from './Dot';

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
    case 'collapse':
      return <Collapse {...props} />;
    case 'collapsed':
      return <Collapsed {...props} />;
    case 'more':
      return <More {...props} />;
    case 'preview':
      return <Preview {...props} />;
    case 'plus':
      return <Plus {...props} />;
    case 'pack':
      return <Pack {...props} />;
    case 'fav':
      return <Fav {...props} />;
    case 'lineCollapse':
      return <LineCollapse {...props} />;
    case 'dot':
      return <Dot {...props} />;
    default:
      return null;
  }
};

export default Icon;
