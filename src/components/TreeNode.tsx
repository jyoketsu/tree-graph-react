import React, { useState } from 'react';
import CNode from '../interfaces/CNode';
import Dot from '../components/Dot';
import DragInfo from '../interfaces/DragInfo';
import { nodeLocation } from '../services/util';

interface CheckFunc {
  (node: CNode, event: MouseEvent): void;
}

interface setDragInfoFunc {
  (dragInfo: DragInfo): void;
}

interface Props {
  node: CNode;
  startId: string;
  ITEM_HEIGHT: number;
  BLOCK_HEIGHT: number;
  FONT_SIZE: number;
  alias: number;
  selected: string | null;
  showMoreButton: boolean;
  showIcon: boolean;
  showAvatar: boolean;
  hideBorder?: boolean;
  handleCheck: CheckFunc;
  handleClickAvatar: Function;
  handleClickStatus: Function;
  handleClickNode: Function;
  handleDbClickNode: Function;
  clickMore: Function;
  handleClickDot: Function;
  // nodeOptionsOpened: boolean;
  openOptions: Function;
  setDragInfo: setDragInfoFunc;
  dragStarted: boolean;
}

// let timer: NodeJS.Timeout;

const TreeNode = ({
  node,
  startId,
  ITEM_HEIGHT,
  BLOCK_HEIGHT,
  FONT_SIZE,
  alias,
  selected,
  showIcon,
  showAvatar,
  hideBorder,
  showMoreButton,
  handleCheck,
  handleClickAvatar,
  handleClickStatus,
  handleClickNode,
  handleDbClickNode,
  clickMore,
  setDragInfo,
  dragStarted,
  openOptions,
  handleClickDot,
}: // nodeOptionsOpened,
Props) => {
  const [hover, sethover] = useState(false);
  // const [hoverMore, setHoverMore] = useState(false);
  const [y, setY] = useState(0);

  function handleMouseEnter(e: React.MouseEvent) {
    sethover(true);
    setY(e.clientY);
    if (dragStarted) {
      setDragInfo({ targetNodeKey: node._key, placement: 'in' });
    }
  }

  function handleMouseLeave(e: React.MouseEvent) {
    sethover(false);
    if (dragStarted) {
      setDragInfo({
        targetNodeKey: node._key,
        placement: e.clientY - y > 0 ? 'down' : 'up',
      });
    }
  }

  // function handleMouseEnterMore() {
  //   setHoverMore(true);
  //   // timer = setTimeout(() => {
  //   //   openOptions(node);
  //   // }, 600);
  // }

  // function handleMouseLeaveMore() {
  //   setHoverMore(false);
  //   // clearTimeout(timer);
  // }

  function handleClickMore() {
    // clearTimeout(timer);
    clickMore(node);
  }

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
    return nodeLocation(node, type, BLOCK_HEIGHT, showIcon, showAvatar);
  }

  const textLocationRes = location(node, 'text');
  const circleLocationRes = location(node, 'avatar');
  const checkLocationRes = location(node, 'checkbox');
  const statusLocationRes = location(node, 'status');
  const iconLocationRes = location(node, 'icon');

  const nodeRectClassName = rectClassName(node);

  const backgroundColor = node.backgroundColor ? node.backgroundColor : '#FFF';

  let nodeRectStyle = {};
  if (dragStarted && hover) {
    nodeRectStyle = {
      fill: '#FFF',
      stroke: '#333333',
      strokeWidth: 2,
    };
  } else {
    switch (nodeRectClassName) {
      case 'border-rect':
        nodeRectStyle = {
          fill: backgroundColor,
          stroke: '#D9D9D9',
        };
        break;
      case 'selected':
        nodeRectStyle = {
          fill: backgroundColor,
          stroke: '#333333',
          strokeWidth: node.father === startId ? 2 : 1,
        };
        break;
      default:
        nodeRectStyle = node.backgroundColor
          ? { fill: backgroundColor, stroke: backgroundColor }
          : { fillOpacity: 0 };
        break;
    }
  }

  return node.x && node.y ? (
    <g
      onClick={() => handleClickNode(node)}
      onDoubleClick={() => handleDbClickNode(node)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 外框 */}
      {/* 隱式外框，用戶擴大鼠標感應面積 */}
      <rect
        x={node.x}
        y={node.y + BLOCK_HEIGHT / 2 - (ITEM_HEIGHT * 0.9) / 2}
        width={node.width + BLOCK_HEIGHT}
        height={ITEM_HEIGHT * 0.9}
        fillOpacity={0}
      />
      {/* 顯式外框 */}
      <rect
        className={`node-rect ${selected === node._key ? 'selected' : ''}`}
        x={node.x}
        y={node.y}
        rx={4}
        ry={4}
        width={node.width}
        height={BLOCK_HEIGHT}
        filter={
          nodeRectClassName !== 'selected' &&
          node.father === startId &&
          !node.backgroundColor
            ? 'url(#filterShadow)'
            : 'unset'
        }
        style={{
          ...nodeRectStyle,
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
      {showAvatar && node.avatarUri ? (
        <g
          onClick={(event: React.MouseEvent) => handleClickAvatar(node, event)}
        >
          <clipPath id={`${alias}-avatar-clip-${node._key}`}>
            <circle
              cx={circleLocationRes ? circleLocationRes.x + 11 : 0}
              cy={circleLocationRes ? circleLocationRes.y + 11 : 0}
              r="11"
            />
          </clipPath>
          <image
            x={circleLocationRes?.x}
            y={circleLocationRes?.y}
            width="22"
            height="22"
            xlinkHref={node.avatarUri}
            clipPath={`url(#${alias}-avatar-clip-${node._key})`}
          />
        </g>
      ) : null}

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
      {node.showStatus ? (
        <g
          onClick={(event: React.MouseEvent) => handleClickStatus(node, event)}
        >
          <use
            href={`#status${
              node.limitDay && node.limitDay < 0
                ? node.checked
                  ? '-complete'
                  : '-overdue'
                : ''
            }`}
            x={statusLocationRes?.x}
            y={statusLocationRes?.y}
          />
          <g fill="#fff" textAnchor="middle" dominantBaseline="middle">
            <text
              x={statusLocationRes ? statusLocationRes.x + 11 : 0}
              y={statusLocationRes ? statusLocationRes.y + 13 : 0}
              fontSize="10"
              fontWeight="800"
              style={{ userSelect: 'none' }}
            >
              {node.limitDay !== undefined
                ? Math.abs(node.limitDay) > 99
                  ? '99+'
                  : Math.abs(node.limitDay)
                : '-'}
            </text>
            <text
              x={statusLocationRes ? statusLocationRes.x + 18 : 0}
              y={statusLocationRes ? statusLocationRes.y + 5 : 0}
              fontSize="6"
              fontWeight="800"
              style={{ userSelect: 'none' }}
            >
              {node.hour ? (node.hour > 9 ? '9+' : node.hour) : '-'}
            </text>
          </g>
        </g>
      ) : null}

      {/* 文字 */}
      <text
        className={`node-text ${selected === node._key ? 'selected' : ''}`}
        x={textLocationRes?.x}
        y={textLocationRes?.y}
        dominantBaseline="middle"
        fontSize={FONT_SIZE}
        style={{
          fill: node.strikethrough
            ? '#999'
            : nodeRectClassName === 'selected'
            ? '#333333'
            : node.color
            ? node.color
            : '#999',
          fontFamily: "'Microsoft YaHei', sans-serif",
          userSelect: 'none',
          textDecoration: node.strikethrough ? 'line-through' : 'unset',
        }}
      >
        {node.shorted || node.name || ''}
      </text>
      {/* 选项/更多按钮 */}
      {showMoreButton && hover && !dragStarted ? (
        // || nodeOptionsOpened
        <g
          onClick={handleClickMore}
          // onMouseEnter={handleMouseEnterMore}
          // onMouseLeave={handleMouseLeaveMore}
        >
          <circle
            cx={node.x + node.width + BLOCK_HEIGHT / 2 + 5}
            cy={node.y + BLOCK_HEIGHT / 2}
            r={BLOCK_HEIGHT / 2}
            fill="#dadbdc"
            // fillOpacity={hoverMore ? 1 : 0}
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
      <Dot
        node={node}
        BLOCK_HEIGHT={BLOCK_HEIGHT}
        handleClick={handleClickDot}
        openOptions={openOptions}
        dragStarted={dragStarted}
        nodeHover={hover}
      />
    </g>
  ) : null;
};
export default TreeNode;
