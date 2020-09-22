import React from 'react';
import * as ReactDOM from 'react-dom';
import { Default as Tree } from '../stories/Tree.stories';

describe('Tree', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Tree />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
