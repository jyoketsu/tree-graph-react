import React from 'react';
import CNode from '../interfaces/CNode';

interface Props {
  node: CNode;
  BLOCK_HEIGHT: number;
  rectHeight: number;
  position?: 'right' | 'left' | 'leftBottom' | 'bottomCenter';
  PATH_COLOR: string;
  handleAddChild: () => void;
  handleAddNext: () => void;
}

const Add = ({
  node,
  BLOCK_HEIGHT,
  rectHeight,
  position = 'right',
  PATH_COLOR,
  handleAddChild,
}: Props) => {
  function getX(pos: string) {
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

  function getY(pos: string, radius: number) {
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

  function getPath(position: string) {
    switch (position) {
      case 'right':
        return `M ${node.x + node.width} ${getY(position, 0)} H ${
          getX(position) + 2
        }`;
      case 'left':
        return `M ${node.x} ${getY(position, 0)} H ${getX(position) + 3}`;
      case 'leftBottom':
        return `M ${getX(position) + 10} ${node.y + rectHeight} V ${
          node.y + rectHeight + 4
        }`;
      case 'bottomCenter':
        return `M ${node.x + node.width / 2} ${node.y + BLOCK_HEIGHT} V ${
          node.y + BLOCK_HEIGHT + 4
        }`;
      default:
        return '';
    }
  }

  return node.x && node.y ? (
    <g>
      <g>
        <path
          d={getPath(position)}
          fill="none"
          stroke={PATH_COLOR}
          strokeWidth={1}
        />
        <use
          className="add-action"
          key="add"
          href="#add"
          x={getX(position)}
          y={getY(position, 10)}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleAddChild();
          }}
        />
      </g>
      {/* <g>
        <path
          d={getPath(position.includes('ottom') ? 'right' : 'leftBottom')}
          fill="none"
          stroke={PATH_COLOR}
          strokeWidth={1}
        />
        <use
          className="add-action"
          key="add"
          href="#add"
          x={getX(position.includes('ottom') ? 'right' : 'leftBottom')}
          y={getY(position.includes('ottom') ? 'right' : 'leftBottom', 10)}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleAddNext();
          }}
        />
      </g> */}
    </g>
  ) : null;
};

export default Add;
