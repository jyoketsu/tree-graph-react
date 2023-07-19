import React from 'react';
import CNode from '../interfaces/CNode';

interface Props {
  node: CNode;
  BLOCK_HEIGHT: number;
  position?: 'right' | 'left' | 'leftBottom' | 'bottomCenter';
  showChildNum?: boolean;
  handleClickExpand: Function;
}

const Expand = ({
  node,
  BLOCK_HEIGHT,
  position,
  showChildNum,
  handleClickExpand,
}: Props) => {
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
  function getY(radius: number) {
    const pos = position || 'right';
    let y = 0;
    switch (pos) {
      case 'right':
      case 'left':
        y = node.y + BLOCK_HEIGHT / 2 - radius;
        break;
      case 'leftBottom':
      case 'bottomCenter':
        y = node.y + BLOCK_HEIGHT - radius;
        break;
      default:
        y = node.y + BLOCK_HEIGHT / 2 - radius;
        break;
    }
    if (node.imageUrl && node.imageHeight && pos.includes('ottom')) {
      y += node.imageHeight + 15 / 2;
    }
    return y;
  }

  return node.x && node.y && node.sortList && node.sortList.length ? (
    <g>
      {node.contract ? (
        showChildNum ? (
          <g>
            <circle
              cx={getX() + 1}
              cy={getY(0)}
              r={10}
              fill="#F0F0F0"
              stroke="#BFBFBF"
              onClick={() => handleClickExpand(node)}
            />
            <text
              x={getX() + 1}
              y={getY(0) + 1}
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
