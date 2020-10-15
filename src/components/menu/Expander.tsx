import React from 'react';
import CNode from '../../interfaces/CNode';

interface Props {
  node: CNode;
  BLOCK_HEIGHT: number;
  color: string;
  selected: string | null;
  handleClickExpand: Function;
}

const Expander = ({
  node,
  BLOCK_HEIGHT,
  handleClickExpand,
  color,
  selected,
}: Props) => {
  const width = 12;
  const x = node.x;
  const y = node.y + (BLOCK_HEIGHT - width) / 2;
  return node.x && node.y && node.sortList && node.sortList.length ? (
    <g onClick={() => handleClickExpand(node)}>
      <rect x={x} y={y} width={width} height={width} fillOpacity={0} />
      {node.contract ? (
        <path
          d={`M ${x + width / 4} ${y} L ${x + width / 4 + width / 2} ${y +
            width / 2} L ${x + width / 4} ${y + width} Z`}
          fill={node._key === selected ? '#FFF' : color}
        ></path>
      ) : (
        <path
          d={`M ${x} ${y + width / 4} H ${x + width} L ${x + width / 2} ${y +
            width / 4 +
            width / 2} Z`}
          fill={node._key === selected ? '#FFF' : color}
        ></path>
      )}
    </g>
  ) : null;
};

export default Expander;
