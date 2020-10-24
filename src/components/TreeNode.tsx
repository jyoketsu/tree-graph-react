import React, { useState } from 'react';
import CNode from '../interfaces/CNode';
import { nodeLocation } from '../services/util';

interface CheckFunc {
  (node: CNode, event: MouseEvent): void;
}

interface Props {
  node: CNode;
  startId: string;
  BLOCK_HEIGHT: number;
  FONT_SIZE: number;
  alias: number;
  selected: string | null;
  showMoreButton: boolean;
  nodeOptionsOpened: boolean;
  showIcon: boolean;
  showAvatar: boolean;
  showCheckbox: boolean;
  showStatus: boolean;
  hideBorder?: boolean;
  handleCheck: CheckFunc;
  handleClickNode: Function;
  handleDbClickNode: Function;
  clickMore: Function;
}
const TreeNode = ({
  node,
  startId,
  BLOCK_HEIGHT,
  FONT_SIZE,
  alias,
  selected,
  showIcon,
  showAvatar,
  showCheckbox,
  showStatus,
  hideBorder,
  showMoreButton,
  nodeOptionsOpened,
  handleCheck,
  handleClickNode,
  handleDbClickNode,
  clickMore,
}: Props) => {
  const [hover, sethover] = useState(false);
  const [hoverMore, setHoverMore] = useState(false);
  function rectClassName(node: CNode) {
    // 选中的节点
    if (selected === node._key) {
      return 'selected';
    } else if (
      // 有边框的节点
      !hideBorder &&
      ((node.sortList && node.sortList.length) ||
        node.father === startId ||
        node._key === startId)
    ) {
      return 'border-rect';
    } else return '';
  }

  function location(node: CNode, type: string) {
    return nodeLocation(
      node,
      type,
      BLOCK_HEIGHT,
      showIcon,
      showAvatar,
      showCheckbox,
      showStatus
    );
  }

  const textLocationRes = location(node, 'text');
  const circleLocationRes = location(node, 'avatar');
  const checkLocationRes = location(node, 'checkbox');
  const statusLocationRes = location(node, 'status');
  const iconLocationRes = location(node, 'icon');

  const nodeRectClassName = rectClassName(node);
  let nodeRectStyle = {};
  switch (nodeRectClassName) {
    case 'border-rect':
      nodeRectStyle = { fill: '#FFF', stroke: '#D9D9D9' };
      break;
    case 'selected':
      nodeRectStyle = { fill: '#FFF', stroke: '#333333', strokeWidth: 2 };
      break;
    default:
      nodeRectStyle = { fillOpacity: 0 };
      break;
  }

  return node.x && node.y ? (
    <g
      onClick={() => handleClickNode(node)}
      onDoubleClick={() => handleDbClickNode(node)}
      onMouseEnter={() => sethover(true)}
      onMouseLeave={() => sethover(false)}
    >
      {/* 外框 */}
      <rect
        x={node.x}
        y={node.y}
        width={node.width + BLOCK_HEIGHT}
        height={BLOCK_HEIGHT}
        fillOpacity={0}
      />
      <rect
        className="node-rect"
        x={node.x}
        y={node.y}
        rx={4}
        ry={4}
        width={node.width}
        height={BLOCK_HEIGHT}
        filter={
          nodeRectClassName !== 'selected' && node.father === startId
            ? 'url(#filterShadow)'
            : 'unset'
        }
        style={{
          ...nodeRectStyle,
          ...{
            strokeWidth:
              nodeRectClassName === 'selected' && node.father === startId
                ? 2
                : 1,
          },
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
      {/* 头像/图片 */}
      {showAvatar && node.avatarUri
        ? [
            <clipPath
              key="avatar-path"
              id={`${alias}-avatar-clip-${node._key}`}
            >
              <circle
                cx={circleLocationRes ? circleLocationRes.x + 11 : 0}
                cy={circleLocationRes ? circleLocationRes.y + 11 : 0}
                r="11"
              />
            </clipPath>,
            <image
              key="avatar-image"
              x={circleLocationRes?.x}
              y={circleLocationRes?.y}
              width="22"
              height="22"
              xlinkHref={node.avatarUri}
              clipPath={`url(#${alias}-avatar-clip-${node._key})`}
            />,
          ]
        : null}

      {/* 勾选框 */}
      {showCheckbox ? (
        <use
          key="checkbox"
          href={`#checkbox-${node.checked ? 'checked' : 'uncheck'}`}
          x={checkLocationRes?.x}
          y={checkLocationRes?.y}
          onClick={(event: any) => handleCheck(node, event)}
        />
      ) : null}

      {/* 任务状态 */}
      {showStatus
        ? [
            <use
              key="status"
              href={`#status${node.limitDay || 0 < 0 ? '-overdue' : ''}`}
              x={statusLocationRes?.x}
              y={statusLocationRes?.y}
            />,
            <g
              key="status-text"
              fill="#fff"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              <text
                x={statusLocationRes ? statusLocationRes.x + 11 : 0}
                y={statusLocationRes ? statusLocationRes.y + 13 : 0}
                fontSize="10"
                fontWeight="800"
              >
                {Math.abs(node.limitDay || 0)}
              </text>
              <text
                x={statusLocationRes ? statusLocationRes.x + 18 : 0}
                y={statusLocationRes ? statusLocationRes.y + 5 : 0}
                fontSize="6"
                fontWeight="800"
              >
                {node.hour}
              </text>
            </g>,
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
          fill: nodeRectClassName === 'selected' ? '#333333' : '#999',
          fontFamily: "'Microsoft YaHei', sans-serif",
          userSelect: 'none',
        }}
      >
        {node.name || '未命名文件'}
      </text>
      {/* 选项/更多按钮 */}
      {(showMoreButton && hover) || nodeOptionsOpened ? (
        <g
          onClick={() => clickMore(node)}
          onMouseEnter={() => setHoverMore(true)}
          onMouseLeave={() => setHoverMore(false)}
        >
          <circle
            cx={node.x + node.width + BLOCK_HEIGHT / 2 + 5}
            cy={node.y + BLOCK_HEIGHT / 2}
            r={BLOCK_HEIGHT / 2}
            fill="rgb(220, 224, 226)"
            // stroke="#ddd"
            fillOpacity={hoverMore ? 1 : 0}
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
