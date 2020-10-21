import React from 'react';
import CNode from '../interfaces/CNode';

interface Props {
  node: CNode;
  content?: any;
  BLOCK_HEIGHT?: number;
  handleClose: Function;
}

const NodeOptions = ({ node, BLOCK_HEIGHT, content }: Props) => {
  const blockHeight = BLOCK_HEIGHT || 30;
  const top = node.y + blockHeight + 5;
  const left = node ? node.x + node.width + 5 : 0;

  return (
    <div
      className="node-input"
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      {content}
    </div>
  );
};

export default NodeOptions;
