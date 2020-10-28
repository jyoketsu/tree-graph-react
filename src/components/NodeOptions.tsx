import React from 'react';
import CNode from '../interfaces/CNode';

interface Props {
  node: CNode;
  content?: any;
  BLOCK_HEIGHT?: number;
  handleClose: Function;
}

const NodeOptions = ({ node, content, BLOCK_HEIGHT, handleClose }: Props) => {
  const blockHeight = BLOCK_HEIGHT || 30;
  const top = node.y + blockHeight + 5;
  const paddingLeft = 5;
  const dotWidth = 9;
  const left = node ? node.x - paddingLeft - dotWidth - 25 : 0;

  return (
    <div
      className="node-input"
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
      }}
      onMouseLeave={() => handleClose()}
    >
      {content}
    </div>
  );
};

export default NodeOptions;
