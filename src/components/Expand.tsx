import React from 'react';
import CNode from '../interfaces/CNode';

interface Props {
  node: CNode;
  BLOCK_HEIGHT: number;
  rectHeight: number;
  position?: 'right' | 'left' | 'leftBottom' | 'bottomCenter';
  PATH_COLOR: string;
  backgroundColor: string;
  handleClickExpand: Function;
}

const Expand = ({
  node,
  BLOCK_HEIGHT,
  rectHeight,
  position,
  PATH_COLOR,
  backgroundColor,
  handleClickExpand,
}: Props) => {
  function getX() {
    const pos = position || 'right';
    const diff = 2;
    switch (pos) {
      case 'right':
        return node.x + node.width + 2 * diff;
      case 'left':
        return node.x - 20 - diff;
      case 'leftBottom':
        return node.x - 5;
      case 'bottomCenter':
        return node.x + node.width / 2 - 10;
      default:
        return node.x;
    }
  }

  function getY(radius: number) {
    const pos = position || 'right';
    const diff = 2;
    let y = 0;
    switch (pos) {
      case 'right':
      case 'left':
        y = node.y + BLOCK_HEIGHT / 2 - radius;
        break;
      case 'leftBottom':
      case 'bottomCenter':
        y = node.y + rectHeight + diff;
        break;
      default:
        y = node.y + rectHeight / 2 - radius;
        break;
    }
    return y;
  }

  function getPath() {
    const pos = position || 'right';
    switch (pos) {
      case 'right':
        return `M ${node.x + node.width} ${getY(0)} H ${getX()}`;
      case 'left':
        return `M ${node.x} ${getY(0)} H ${getX()}`;
      case 'leftBottom':
        return `M ${getX() + 10} ${node.y + rectHeight} V ${
          node.y + rectHeight + 2
        }`;
      case 'bottomCenter':
        return `M ${node.x + node.width / 2} ${node.y + BLOCK_HEIGHT} V ${
          node.y + BLOCK_HEIGHT + 2
        }`;
      default:
        return '';
    }
  }

  return node.x && node.y && node.sortList && node.sortList.length ? (
    <g>
      {node.contract ? (
        <g>
          <path d={getPath()} fill="none" stroke={PATH_COLOR} strokeWidth={1} />
          <circle
            cx={getX() + 10}
            cy={getY(10) + 10 + 1}
            r={10}
            fill={backgroundColor}
            stroke={PATH_COLOR}
            onClick={() => handleClickExpand(node)}
          />
          <text
            x={getX() + 10}
            y={getY(10) + 10 + 1 + 1}
            alignmentBaseline="middle"
            textAnchor="middle"
            fontSize={(node.childNum || 0) > 999 ? 10 : 12}
            fill={PATH_COLOR}
            style={{ pointerEvents: 'none' }}
          >
            {(node.childNum || 0) > 999 ? '999+' : node.childNum}
          </text>
        </g>
      ) : (
        <use
          className="dot-action"
          key="contract"
          href={`#contract-${
            position === 'right' ? 'left' : position === 'left' ? 'right' : 'up'
          }`}
          x={getX()}
          y={getY(10)}
          onClick={() => handleClickExpand(node)}
        />
      )}
    </g>
  ) : null;
};

export default Expand;
