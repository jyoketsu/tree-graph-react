import React from 'react';
import CNode from '../interfaces/CNode';

interface Props {
  node: CNode;
  BLOCK_HEIGHT: number;
  position?: 'right' | 'left' | 'leftBottom' | 'bottomCenter';
  showChildNum?: boolean;
  PATH_COLOR: string;
  handleClickExpand: Function;
}

const Expand = ({
  node,
  BLOCK_HEIGHT,
  position,
  showChildNum,
  PATH_COLOR,
  handleClickExpand,
}: Props) => {
  function getX() {
    const pos = position || 'right';
    const diff = node.contract ? 8 : 0;
    switch (pos) {
      case 'right':
        return node.x + node.width + 2 * diff;
      case 'left':
        return node.x - 8 - diff;
      case 'leftBottom':
        return node.x + 5;
      case 'bottomCenter':
        return node.x + node.width / 2 - 4;
      default:
        return node.x;
    }
  }

  function getPath() {
    const pos = position || 'right';
    switch (pos) {
      case 'right':
        return `M ${node.x + node.width} ${getY(0)} H ${getX()}`;
      case 'left':
        return `M ${node.x} ${getY(0)} H ${getX()}`;
      case 'leftBottom':
        return `M ${getX()} ${getY(0)} V ${getY(0) - 16}`;
      case 'bottomCenter':
        return `M ${getX()} ${getY(0)} V ${getY(0) - 16}`;
      default:
        return '';
    }
  }
  function getY(radius: number) {
    const pos = position || 'right';
    const diff = node.contract ? 16 : 0;
    let y = 0;
    switch (pos) {
      case 'right':
      case 'left':
        y = node.y + BLOCK_HEIGHT / 2 - radius;
        break;
      case 'leftBottom':
      case 'bottomCenter':
        y = node.y + BLOCK_HEIGHT - radius + diff;
        break;
      default:
        y = node.y + BLOCK_HEIGHT / 2 - radius;
        break;
    }
    if (pos.includes('ottom')) {
      if (node.imageUrl && node.imageHeight) {
        y += node.imageHeight + 15 / 2;
      }
      if (node.texts && node.texts.length > 1) {
        y += (node.texts.length - 1) * BLOCK_HEIGHT;
      }
    }
    return y;
  }

  return node.x && node.y && node.sortList && node.sortList.length ? (
    <g>
      {node.contract ? (
        showChildNum ? (
          <g>
            <path
              d={getPath()}
              fill="none"
              stroke={PATH_COLOR}
              strokeWidth={1}
            />
            <circle
              cx={getX()}
              cy={getY(0)}
              r={10}
              fill="#F0F0F0"
              stroke="#BFBFBF"
              onClick={() => handleClickExpand(node)}
            />
            <text
              x={getX()}
              y={getY(0)}
              alignmentBaseline="middle"
              textAnchor="middle"
              fontSize={(node.childNum || 0) > 999 ? 10 : 12}
              style={{ pointerEvents: 'none' }}
            >
              {(node.childNum || 0) > 999 ? '999+' : node.childNum}
            </text>
          </g>
        ) : (
          <use
            className="dot-action"
            key="expand"
            href="#expand"
            x={getX()}
            y={getY(5)}
            onClick={() => handleClickExpand(node)}
          />
        )
      ) : (
        <use
          className="dot-action"
          key="contract"
          href="#contract"
          x={getX()}
          y={getY(5)}
          onClick={() => handleClickExpand(node)}
        />
      )}
    </g>
  ) : null;
};

export default Expand;
