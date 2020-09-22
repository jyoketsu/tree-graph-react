import React from 'react';
import { Tree, Props } from '../src';

export default {
  title: 'Tree',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const Default = (props?: Partial<Props>) => <Tree {...props} />;
