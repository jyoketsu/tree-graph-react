import React from 'react';
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
  selected: CNode | null;
  handleCheck: CheckFunc;
  handleClickNode: Function;
  handleDbClickNode: Function;
}
const TreeNode = ({
  node,
  startId,
  BLOCK_HEIGHT,
  FONT_SIZE,
  alias,
  selected,
  handleCheck,
  handleClickNode,
  handleDbClickNode,
}: Props) => {
  function rectClassName(node: CNode) {
    // 选中的节点
    if (selected && selected._key === node._key) {
      return 'selected';
    } else if (
      // 有边框的节点
      (node.sortList && node.sortList.length) ||
      node.father === startId ||
      node._key === startId
    ) {
      return 'border-rect';
    } else return '';
  }

  function location(node: CNode, type: string) {
    return nodeLocation(node, type, BLOCK_HEIGHT);
  }

  const textLocationRes = location(node, 'text');
  const circleLocationRes = location(node, 'avatar');
  const checkLocationRes = location(node, 'checkbox');
  const statusLocationRes = location(node, 'status');

  const nodeRectClassName = rectClassName(node);
  let nodeRectStyle = {};
  switch (nodeRectClassName) {
    case 'border-rect':
      nodeRectStyle = { fill: '#fff', stroke: 'rgb(192, 192, 192)' };
      break;
    case 'selected':
      nodeRectStyle = { fill: 'rgb(238, 238, 238)', stroke: '#000000' };
      break;
    default:
      break;
  }

  return node.x && node.y ? (
    <g
      onClick={() => handleClickNode(node)}
      onDoubleClick={() => handleDbClickNode(node)}
    >
      {/* 外框 */}
      <rect
        className="node-rect"
        x={node.x}
        y={node.y}
        rx={4}
        ry={4}
        width={node.width}
        height={BLOCK_HEIGHT}
        style={{ ...nodeRectStyle, ...{ fill: 'none', strokeWidth: 1 } }}
      />

      {/* 头像/图片 */}
      {node.showAvatar
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
      {node.showCheckbox ? (
        <use
          key="checkbox"
          href={`#checkbox-${node.checked ? 'checked' : 'uncheck'}`}
          x={checkLocationRes?.x}
          y={checkLocationRes?.y}
          onClick={(event: any) => handleCheck(node, event)}
        />
      ) : null}

      {/* 任务状态 */}
      {node.showStatus
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
          fill: nodeRectClassName === 'selected' ? '#ƒ000000' : '#999',
          fontFamily: "'Microsoft YaHei', sans-serif",
          userSelect: 'none',
        }}
      >
        {node.name}
      </text>
    </g>
  ) : null;
};
export default TreeNode;
