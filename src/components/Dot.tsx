import React from 'react';
import CNode from '../interfaces/CNode';

interface Props {
  node: CNode;
  BLOCK_HEIGHT: number;
  position?: string;
}
const Dot = ({ node, BLOCK_HEIGHT, position }: Props) => {
  const pos = position ? position : 'left';
  function getX() {
    switch (pos) {
      case 'left':
        return node.x - 4;
      case 'right':
        return node.x + node.width + 4;
      default:
        return node.x - 4;
    }
  }
  return node.x && node.y ? (
    <g>
      {/* 圆点 */}
      <circle
        id="dot"
        cx={getX()}
        cy={node.y + BLOCK_HEIGHT / 2}
        r={4}
        fill="#666"
      />
    </g>
  ) : null;
};

export default Dot;
