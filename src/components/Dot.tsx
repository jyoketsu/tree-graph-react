import React, { useState } from 'react';
import CNode from '../interfaces/CNode';

interface Props {
  node: CNode;
  BLOCK_HEIGHT: number;
  handleClick: Function;
  openOptions: Function;
  dragStarted: boolean;
  position?: string;
}

let timer: NodeJS.Timeout;

const Dot = ({
  node,
  BLOCK_HEIGHT,
  handleClick,
  openOptions,
  dragStarted,
  position,
}: Props) => {
  const [hover, sethover] = useState(false);
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

  function handleMouseEnter() {
    if (!dragStarted) {
      sethover(true);
      timer = setTimeout(() => {
        openOptions(node);
      }, 500);
    }
  }

  function handleMouseLeave() {
    if (!dragStarted) {
      sethover(false);
      clearTimeout(timer);
    }
  }

  function handleClickDot() {
    clearTimeout(timer);
    handleClick(node);
  }

  return node.x && node.y ? (
    <g
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClickDot}
    >
      {/* 圆点 */}
      <circle
        id="dot-hover"
        cx={getX()}
        cy={node.y + BLOCK_HEIGHT / 2}
        r={9}
        fill="#bbbfc4"
        cursor="pointer"
        fillOpacity={hover ? 1 : 0}
      />
      <circle
        id="dot"
        cx={getX()}
        cy={node.y + BLOCK_HEIGHT / 2}
        r={4}
        fill="#666"
        cursor={hover ? 'pointer' : 'auto'}
      />
    </g>
  ) : null;
};

export default Dot;
