import React, { useState, useEffect } from 'react';
import CNode from '../interfaces/CNode';
import DragInfo from '../interfaces/DragInfo';
import { nodeLocation } from '../services/util';

interface Props {
  nodeList: CNode[];
  BLOCK_HEIGHT: number;
  FONT_SIZE: number;
  avatarRadius: number;
  alias: number;
  showIcon: boolean;
  showAvatar: boolean;
  movedNodeX: number;
  movedNodeY: number;
  dragInfo: DragInfo | null;
  showChildNum: boolean;
  mutilMode?: boolean;
}

const DragNode = ({
  nodeList,
  BLOCK_HEIGHT,
  FONT_SIZE,
  avatarRadius,
  alias,
  showIcon,
  showAvatar,
  movedNodeX,
  movedNodeY,
  dragInfo,
  mutilMode,
  showChildNum,
}: Props) => {
  const [node, setNode] = useState<CNode | null>(null);

  useEffect(() => {
    for (let index = 0; index < nodeList.length; index++) {
      const node = nodeList[index];
      if (node._key === dragInfo?.dragNodeId) {
        setNode(node);
        break;
      }
    }
  }, [dragInfo, nodeList]);

  function location(node: CNode, type: string) {
    return nodeLocation(
      node,
      type,
      BLOCK_HEIGHT,
      showIcon,
      showAvatar,
      avatarRadius,
      showChildNum
    );
  }

  if (!node) {
    return null;
  }

  const textLocationRes = location(node, 'text');
  const circleLocationRes = location(node, 'avatar');
  const checkLocationRes = location(node, 'checkbox');
  const statusLocationRes = location(node, 'status');
  const iconLocationRes = location(node, 'icon');

  const backgroundColor = node.backgroundColor ? node.backgroundColor : '#FFF';

  return node.x && node.y ? (
    <g style={{ pointerEvents: 'none' }}>
      {/* 橫線，用於標識拖拽的位置 */}
      {dragInfo && dragInfo.placement !== 'in' ? (
        <line
          x1={node.x - 50 + movedNodeX}
          x2={node.x + node.width + 50 + movedNodeX}
          y1={node.y + BLOCK_HEIGHT / 2 + movedNodeY}
          y2={node.y + BLOCK_HEIGHT / 2 + movedNodeY}
          stroke="#33A6B8"
          strokeWidth={2}
        />
      ) : null}
      {/* 外框 */}
      <rect
        className="node-rect"
        x={node.x + movedNodeX}
        y={node.y + movedNodeY}
        rx={4}
        ry={4}
        width={node.width}
        height={BLOCK_HEIGHT}
        style={{
          fill: backgroundColor,
          fillOpacity: 0.5,
          stroke: '#333333',
        }}
      />

      {/* 图标 */}
      {showIcon && node.icon ? (
        <image
          key="avatar-image"
          x={iconLocationRes ? iconLocationRes.x + movedNodeX : 0}
          y={iconLocationRes ? iconLocationRes.y + movedNodeY : 0}
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
                cx={
                  circleLocationRes ? circleLocationRes.x + 11 + movedNodeX : 0
                }
                cy={
                  circleLocationRes ? circleLocationRes.y + 11 + movedNodeY : 0
                }
                r="11"
              />
            </clipPath>,
            <image
              key="avatar-image"
              x={circleLocationRes ? circleLocationRes.x + movedNodeX : 0}
              y={circleLocationRes ? circleLocationRes.y + movedNodeY : 0}
              width="22"
              height="22"
              xlinkHref={node.avatarUri}
              clipPath={`url(#${alias}-avatar-clip-${node._key})`}
            />,
          ]
        : null}

      {/* 勾选框 */}
      {node.showCheckbox ? (
        <use
          key="checkbox"
          href={`#checkbox-${node.checked ? 'checked' : 'uncheck'}`}
          x={checkLocationRes ? checkLocationRes.x + movedNodeX : 0}
          y={checkLocationRes ? checkLocationRes.y + movedNodeY : 0}
        />
      ) : null}

      {/* 任务状态 */}
      {node.showStatus
        ? [
            <use
              key="status"
              href={`#status${
                node.limitDay && node.limitDay < 0
                  ? node.checked
                    ? '-complete'
                    : '-overdue'
                  : ''
              }`}
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
                x={
                  statusLocationRes ? statusLocationRes.x + 11 + movedNodeX : 0
                }
                y={
                  statusLocationRes ? statusLocationRes.y + 13 + movedNodeY : 0
                }
                fontSize="10"
                fontWeight="800"
              >
                {node.limitDay !== undefined
                  ? Math.abs(node.limitDay) > 99
                    ? '99+'
                    : Math.abs(node.limitDay)
                  : '-'}
              </text>
              <text
                x={
                  statusLocationRes ? statusLocationRes.x + 18 + movedNodeX : 0
                }
                y={statusLocationRes ? statusLocationRes.y + 5 + movedNodeY : 0}
                fontSize="6"
                fontWeight="800"
              >
                {node.hour ? (node.hour > 9 ? '9+' : node.hour) : '-'}
              </text>
            </g>,
          ]
        : null}

      {/* 文字 */}
      <text
        className="node-text"
        x={textLocationRes ? textLocationRes.x + movedNodeX : 0}
        y={textLocationRes ? textLocationRes.y + movedNodeY : 0}
        dominantBaseline="middle"
        fontSize={FONT_SIZE}
        style={{
          fill: node.color ? node.color : '#999',
          fontFamily: "'Microsoft YaHei', sans-serif",
          userSelect: 'none',
        }}
      >
        {mutilMode ? '多个节点' : node.shorted || node.name || ''}
      </text>
    </g>
  ) : null;
};
export default DragNode;
