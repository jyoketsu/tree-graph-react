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
  alias: number;
  selected: string | null;
  showNodeOptions: boolean;
  handleClickNode: Function;
  handleDbClickNode: Function;
  openOptions: Function;
}
const TreeNode = ({
  node,
  width,
  selectedBackgroundColor,
  color,
  BLOCK_HEIGHT,
  FONT_SIZE,
  alias,
  selected,
  showNodeOptions,
  handleClickNode,
  handleDbClickNode,
  openOptions,
}: Props) => {
  function rectClassName(node: CNode) {
    // 选中的节点
    if (selected === node._key) {
      return 'selected';
    } else return '';
  }

  function location(node: CNode, type: string) {
    return nodeLocation(node, type, BLOCK_HEIGHT, 16);
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
      {node.icon
        ? [
            <clipPath
              key="avatar-path"
              id={`${alias}-avatar-clip-${node._key}`}
            >
              <circle
                cx={iconLocationRes ? iconLocationRes.x + 11 : 0}
                cy={iconLocationRes ? iconLocationRes.y + 11 : 0}
                r="11"
              />
            </clipPath>,
            <image
              key="avatar-image"
              x={iconLocationRes?.x}
              y={iconLocationRes?.y}
              width="22"
              height="22"
              xlinkHref={node.icon}
              // clipPath={`url(#${alias}-avatar-clip-${node._key})`}
            />,
          ]
        : null}

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
      {showNodeOptions && selected === node._key ? (
        <g onClick={e => openOptions(node, e)}>
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
