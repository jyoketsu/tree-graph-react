import React from 'react';
import './TreeNode.css';
import CNode from '../interfaces/CNode';
import { nodeLocation } from '../services/util';

interface Props {
  node: CNode;
  startId: string;
  BLOCK_HEIGHT: number;
  FONT_SIZE: number;
  alias: number;
  selected: CNode | null;
}
const TreeNode = ({
  node,
  startId,
  BLOCK_HEIGHT,
  FONT_SIZE,
  alias,
  selected,
}: Props) => {
  function rectClassName(node: CNode) {
    // 选中的节点
    if (selected && selected._key === node._key) {
      return 'selected';
    } else if (
      // 有边框的节点
      node.sortList.length ||
      node.father === startId ||
      node._key === startId
    ) {
      return 'border-rect';
    } else return '';
  }

  function location(node: CNode, type: string) {
    return nodeLocation(node, type, BLOCK_HEIGHT);
  }

  const locationRes = location(node, 'text');

  return node.x && node.y ? (
    <g>
      {/* 外框 */}
      <rect
        className={`node-rect ${rectClassName(node)}`}
        x={node.x}
        y={node.y}
        rx={4}
        ry={4}
        width={node.width}
        height={BLOCK_HEIGHT}
      />
      {/* 文字 */}
      <text
        className={`node-text ${rectClassName(node)}`}
        x={locationRes?.x}
        y={locationRes?.y}
        dominantBaseline="middle"
        fontSize={FONT_SIZE}
      >
        {node.name}
      </text>
    </g>
  ) : null;
};
export default TreeNode;
