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
  showPreviewButton: boolean;
  showAddButton: boolean;
  showMoreButton: boolean;
  moreButtonWidth?: number;
  showIcon: boolean;
  showAvatar: boolean;
  hideBorder?: boolean;
  handleCheck: CheckFunc;
  handleClickAvatar: Function;
  handleClickStatus: Function;
  handleClickNode: Function;
  handleDbClickNode: Function;
  clickPreview: Function;
  clickAdd: Function;
  clickMore: Function;
  handleClickDot: Function;
  mouseEnterAvatar?: Function;
  mouseLeaveAvatar?: Function;
  // nodeOptionsOpened: boolean;
  // openOptions: Function;
  handleDragStart: Function;
  updateDragInfo: setDragInfoFunc;
  dragStarted: boolean;
  dragEndFromOutside?: Function;
  pasteNodeKey: string | null;
  bottomOptions?: boolean;
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
  showPreviewButton,
  showAddButton,
  showMoreButton,
  moreButtonWidth,
  handleCheck,
  handleClickAvatar,
  handleClickStatus,
  handleClickNode,
  handleDbClickNode,
  clickPreview,
  clickAdd,
  clickMore,
  updateDragInfo,
  handleDragStart,
  dragStarted,
  // openOptions,
  handleClickDot,
  dragEndFromOutside,
  mouseEnterAvatar,
  mouseLeaveAvatar,
  pasteNodeKey,
  bottomOptions,
}: // nodeOptionsOpened,
Props) => {
  const [hover, sethover] = useState(false);
  const [dragIn, setDragIn] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [clickX, setclickX] = useState(0);
  const [clickY, setclickY] = useState(0);
  // const [hoverMore, setHoverMore] = useState(false);
  const [y, setY] = useState(0);
  const [hoverPreview, setHoverPreview] = useState(false);
  const [hoverAdd, setHoverAdd] = useState(false);
  const [hoverMore, setHoverMore] = useState(false);

  function handleMouseEnter(e: React.MouseEvent) {
    const crossCompDragId = sessionStorage.getItem('cross-comp-drag');
    sethover(true);
    setY(e.clientY);
    if (dragStarted) {
      updateDragInfo({
        dropNodeId: node._key,
        placement: 'in',
      });
    }
    if (crossCompDragId) {
      sessionStorage.setItem('cross-comp-drop', node._key);
    }
  }

  function handleMouseLeave(e: React.MouseEvent) {
    sethover(false);
    if (dragStarted) {
      updateDragInfo({
        dropNodeId: node._key,
        placement: e.clientY - y > 0 ? 'down' : 'up',
      });
    }
    if (mouseDown) {
      handleDragStart(node, clickX, clickY);
      setMouseDown(false);
    }
  }

  function handleMouseEnterPreview() {
    setHoverPreview(true);
  }

  function handleMouseLeavePreview() {
    setHoverPreview(false);
  }

  function handleMouseEnterAdd() {
    setHoverAdd(true);
  }

  function handleMouseLeaveAdd() {
    setHoverAdd(false);
  }

  function handleMouseEnterMore() {
    setHoverMore(true);
  }

  function handleMouseLeaveMore() {
    setHoverMore(false);
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

  function handleClickPreview() {
    clickPreview(node);
  }

  function handleClickAdd(event: React.MouseEvent) {
    clickAdd(node, event.clientX, event.clientY);
  }

  function handleClickMore(event: React.MouseEvent) {
    // clearTimeout(timer);
    clickMore(node, event.clientX, event.clientY);
  }

  function handleDragEnter() {
    setDragIn(true);
  }

  function handleDragLeave() {
    setDragIn(false);
  }

  function handleDragOver(event: React.MouseEvent) {
    event.preventDefault();
  }

  function handleDragEnd(event: React.MouseEvent) {
    event.preventDefault();
    setDragIn(false);
    if (dragEndFromOutside) {
      dragEndFromOutside(node);
    }
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

  function handleMouseEnterAvatar() {
    if (mouseEnterAvatar) {
      mouseEnterAvatar(node);
    }
  }

  function handleMouseLeaveAvatar() {
    if (mouseLeaveAvatar) {
      mouseLeaveAvatar(node);
    }
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
  if ((dragStarted && hover) || dragIn) {
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
          fillOpacity: pasteNodeKey && pasteNodeKey === node._key ? 0.4 : 1,
          strokeOpacity: pasteNodeKey && pasteNodeKey === node._key ? 0.4 : 1,
        };
        break;
      default:
        nodeRectStyle = node.backgroundColor
          ? { fill: backgroundColor, stroke: backgroundColor }
          : { fillOpacity: 0 };
        break;
    }
  }

  const buttonWidth = moreButtonWidth ? moreButtonWidth : BLOCK_HEIGHT * 0.5;

  const buttonY = bottomOptions
    ? node.y + BLOCK_HEIGHT
    : node.y + (BLOCK_HEIGHT - buttonWidth) / 2;

  const optionsButtonWidth =
    (showAddButton ? buttonWidth : 0) +
    (showPreviewButton ? buttonWidth : 0) +
    (showMoreButton ? buttonWidth : 0);

  const previewButtonX =
    node.x + node.width + 2 - (bottomOptions ? optionsButtonWidth : 0);

  const addButtonX =
    node.x +
    node.width +
    2 +
    (showPreviewButton ? buttonWidth : 0) -
    (bottomOptions ? optionsButtonWidth : 0);
  const moreButtonX =
    node.x +
    node.width +
    2 +
    (showPreviewButton ? buttonWidth : 0) +
    (showAddButton ? buttonWidth : 0) -
    (bottomOptions ? optionsButtonWidth : 0);

  const totalButtonWidth =
    2 +
    (showPreviewButton ? buttonWidth : 0) +
    (showAddButton ? buttonWidth : 0) +
    (showMoreButton ? buttonWidth : 0);

  return node.x && node.y ? (
    <g
      onClick={() => handleClickNode(node)}
      onDoubleClick={() => handleDbClickNode(node)}
      // onMouseDown={(e: React.MouseEvent) => handleDragStart(node, e)}
      onMouseDown={(e: React.MouseEvent) => {
        e.stopPropagation();
        setMouseDown(true);
        setclickX(e.clientX);
        setclickY(e.clientY);
      }}
      onMouseUp={() => setMouseDown(false)}
      onMouseMove={(e: React.MouseEvent) => {
        if (mouseDown) {
          e.stopPropagation();
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      {/* 外框 */}
      {/* 隱式外框，用戶擴大鼠標感應面積 */}
      <rect
        x={node.x}
        y={node.y + BLOCK_HEIGHT / 2 - (ITEM_HEIGHT * 0.9) / 2}
        width={node.width + totalButtonWidth}
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
          onMouseEnter={handleMouseEnterAvatar}
          onMouseLeave={handleMouseLeaveAvatar}
          viewBox="0,0,22,22"
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
            preserveAspectRatio="xMidYMid slice"
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
            ? '#000000	'
            : node.color
            ? node.color
            : '#595959',
          fillOpacity: pasteNodeKey && pasteNodeKey === node._key ? 0.4 : 1,
          fontFamily: "'Microsoft YaHei', sans-serif",
          userSelect: 'none',
          textDecoration: node.strikethrough ? 'line-through' : 'unset',
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDragEnd}
      >
        {node.shorted || node.name || ''}
      </text>

      {hover && !dragStarted ? (
        // || nodeOptionsOpened
        <g>
          {/* 預覽按鈕 */}
          {showPreviewButton ? (
            <use
              href="#preview"
              x={hoverPreview ? previewButtonX - 2 : previewButtonX}
              y={hoverPreview ? buttonY - 2 : buttonY}
              width={hoverPreview ? buttonWidth + 2 : buttonWidth}
              height={hoverPreview ? buttonWidth + 2 : buttonWidth}
              onClick={handleClickPreview}
              fill={hoverPreview ? '#000000' : '#757676'}
              onMouseEnter={handleMouseEnterPreview}
              onMouseLeave={handleMouseLeavePreview}
            />
          ) : null}
          {/* 新增按鈕 */}
          {showAddButton ? (
            <use
              href="#add"
              x={hoverAdd ? addButtonX - 2 : addButtonX}
              y={hoverAdd ? buttonY - 2 : buttonY}
              width={hoverAdd ? buttonWidth + 2 : buttonWidth}
              height={hoverAdd ? buttonWidth + 2 : buttonWidth}
              onClick={handleClickAdd}
              fill={hoverAdd ? '#000000' : '#757676'}
              onMouseEnter={handleMouseEnterAdd}
              onMouseLeave={handleMouseLeaveAdd}
            />
          ) : null}
          {/* 选项/更多按钮 */}
          {showMoreButton ? (
            <use
              href="#more"
              x={hoverMore ? moreButtonX - 2 : moreButtonX}
              y={hoverMore ? buttonY - 2 : buttonY}
              width={hoverMore ? buttonWidth + 2 : buttonWidth}
              height={hoverMore ? buttonWidth + 2 : buttonWidth}
              onClick={handleClickMore}
              fill={hoverMore ? '#000000' : '#757676'}
              onMouseEnter={handleMouseEnterMore}
              onMouseLeave={handleMouseLeaveMore}
            />
          ) : null}
        </g>
      ) : null}
      {node._key !== startId ? (
        <Dot
          node={node}
          BLOCK_HEIGHT={BLOCK_HEIGHT}
          handleClick={handleClickDot}
          dragStarted={dragStarted}
          nodeHover={hover}
          position={node.toLeft ? 'right' : 'left'}
        />
      ) : null}

      {/* <div
        style={{
          width: `${node.width}px`,
          height: `${ITEM_HEIGHT}px`,
          backgroundColor: 'red',
        }}
      ></div> */}
    </g>
  ) : null;
};
export default TreeNode;
