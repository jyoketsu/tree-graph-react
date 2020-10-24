import React from 'react';
import CNode from '../../interfaces/CNode';
import { nodeLocation } from '../../services/util';

interface Props {
  node: CNode;
  width: number;
  selectedBackgroundColor: string;
  color: string;
  BLOCK_HEIGHT: number;
  FONT_SIZE: number;
  selected: string | null;
  showMoreButton: boolean;
  showIcon: boolean;
  handleClickNode: Function;
  handleDbClickNode: Function;
  clickMore: Function;
}
const TreeNode = ({
  node,
  width,
  selectedBackgroundColor,
  color,
  BLOCK_HEIGHT,
  FONT_SIZE,
  selected,
  showIcon,
  showMoreButton,
  handleClickNode,
  handleDbClickNode,
  clickMore,
}: Props) => {
  function rectClassName(node: CNode) {
    // 选中的节点
    if (selected === node._key) {
      return 'selected';
    } else return '';
  }

  function location(node: CNode, type: string) {
    return nodeLocation(
      node,
      type,
      BLOCK_HEIGHT,
      showIcon,
      false,
      false,
      false,
      16
    );
  }

  const textLocationRes = location(node, 'text');
  const iconLocationRes = location(node, 'icon');

  const nodeRectClassName = rectClassName(node);

  return node.x && node.y ? (
    <g
      onClick={() => handleClickNode(node)}
      onDoubleClick={() => handleDbClickNode(node)}
    >
      {/* 外框 */}
      <rect
        className="node-rect"
        x={0}
        y={node.y}
        width={width}
        height={BLOCK_HEIGHT}
        style={{
          fill:
            nodeRectClassName === 'selected'
              ? selectedBackgroundColor
              : 'white',
          fillOpacity: nodeRectClassName === 'selected' ? 1 : 0,
        }}
      />

      {/* 图标 */}
      {showIcon && node.icon ? (
        <image
          key="avatar-image"
          x={iconLocationRes?.x}
          y={iconLocationRes?.y}
          width="22"
          height="22"
          xlinkHref={node.icon}
        />
      ) : null}

      {/* 文字 */}
      <text
        className="node-text"
        x={textLocationRes?.x}
        y={textLocationRes?.y}
        dominantBaseline="middle"
        fontSize={FONT_SIZE}
        style={{
          fill: nodeRectClassName === 'selected' ? '#FFF' : color,
          fontFamily: "'Microsoft YaHei', sans-serif",
          userSelect: 'none',
        }}
      >
        {node.name || '未命名文件'}
      </text>
      {showMoreButton && selected === node._key ? (
        <g onClick={e => clickMore(node, e)}>
          <circle
            cx={node.x + node.width + BLOCK_HEIGHT / 2 + 5}
            cy={node.y + BLOCK_HEIGHT / 2}
            r={BLOCK_HEIGHT / 2}
            fillOpacity={0}
            stroke="#ddd"
          />
          <circle
            cx={node.x + node.width + BLOCK_HEIGHT / 2 + 5 - 6}
            cy={node.y + BLOCK_HEIGHT / 2}
            r={2}
            fill="#757676"
          />
          <circle
            cx={node.x + node.width + BLOCK_HEIGHT / 2 + 5}
            cy={node.y + BLOCK_HEIGHT / 2}
            r={2}
            fill="#757676"
          />
          <circle
            cx={node.x + node.width + BLOCK_HEIGHT / 2 + 5 + 6}
            cy={node.y + BLOCK_HEIGHT / 2}
            r={2}
            fill="#757676"
          />
        </g>
      ) : null}
    </g>
  ) : null;
};
export default TreeNode;