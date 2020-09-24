import React from 'react';
import './Expand.css';
import CNode from '../interfaces/CNode';

interface Props {
  node: CNode;
  BLOCK_HEIGHT: number;
  position?: string;
  handleClickExpand: Function;
}

const Expand = ({ node, BLOCK_HEIGHT, position, handleClickExpand }: Props) => {
  function getX() {
    const pos = position || 'right';
    switch (pos) {
      case 'right':
        return node.x + node.width;
      case 'left':
        return node.x - 8;
      case 'leftBottom':
        return node.x;
      case 'bottomCenter':
        return node.x + node.width / 2 - 4;
      default:
        return node.x;
    }
  }
  function getY() {
    const pos = position || 'right';
    switch (pos) {
      case 'right':
      case 'left':
        return node.y + BLOCK_HEIGHT / 2 - 5;
      case 'leftBottom':
      case 'bottomCenter':
        return node.y + BLOCK_HEIGHT;
      default:
        return node.y + BLOCK_HEIGHT / 2 - 5;
    }
  }

  return node.x && node.y && node.sortList.length ? (
    <g>
      {node.contract ? (
        <use
          className="dot-action"
          key="expand"
          href="#expand"
          x={getX()}
          y={getY()}
          onClick={() => handleClickExpand(node)}
        />
      ) : (
        <use
          className="dot-action"
          key="contract"
          href="#contract"
          x={getX()}
          y={getY()}
          onClick={() => handleClickExpand(node)}
        />
      )}
    </g>
  ) : null;
};

export default Expand;
