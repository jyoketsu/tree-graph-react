import React, { useState } from 'react';
import Node from '../interfaces/Node';
import CNode from '../interfaces/CNode';
import Dot from '../components/Dot';
import Expand from '../components/Expand';
import DragInfo from '../interfaces/DragInfo';
import { nodeLocation, textWidthAll } from '../services/util';

interface CheckFunc {
  (node: CNode, event: MouseEvent): void;
}

interface setDragInfoFunc {
  (dragInfo: DragInfo): void;
}

// 今天零点的时间戳
const now = new Date(new Date().setHours(0, 0, 0, 0)).getTime();

interface Props {
  node: CNode;
  startId: string;
  BLOCK_HEIGHT: number;
  FONT_SIZE: number;
  avatarRadius: number;
  color: string;
  alias: number;
  selected: string | null;
  selectedNodes: Node[];
  showPreviewButton: boolean;
  showAddButton: boolean;
  showMoreButton: boolean;
  moreButtonWidth?: number;
  showIcon: boolean;
  showAvatar: boolean;
  singleColumn?: boolean;
  hideBorder?: boolean;
  dotColor: string;
  hoverBorderColor: string;
  selectedBorderColor: string;
  selectedBackgroundColor: string;
  handleCheck: CheckFunc;
  handleClickAvatar: Function;
  handleClickStatus: Function;
  handleClickNode: Function;
  handleDbClickNode: Function;
  clickPreview: Function;
  clickAdd: Function;
  clickMore: Function;
  handleClickDot: Function;
  handleExpand: Function;
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
  hideHour?: boolean;
  isMind?: boolean;
  fontWeight?: number;
}

// let timer: NodeJS.Timeout;

const TreeNode = ({
  node,
  startId,
  BLOCK_HEIGHT,
  FONT_SIZE,
  avatarRadius,
  color,
  alias,
  selected,
  selectedNodes,
  showIcon,
  showAvatar,
  singleColumn,
  hideBorder,
  showPreviewButton,
  showAddButton,
  showMoreButton,
  moreButtonWidth,
  dotColor,
  hoverBorderColor,
  selectedBorderColor,
  selectedBackgroundColor,
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
  handleExpand,
  dragEndFromOutside,
  mouseEnterAvatar,
  mouseLeaveAvatar,
  pasteNodeKey,
  bottomOptions,
  hideHour,
  fontWeight,
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

  let limitDayNum = node.limitDay
    ? node.limitDay - now > 0
      ? Math.floor((node.limitDay - now) / 86400000)
      : Math.floor((node.limitDay - now) / 86400000) - 1
    : 0;

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
    event.stopPropagation();
    clickAdd(node, event);
  }

  function handleClickMore(event: React.MouseEvent) {
    // clearTimeout(timer);
    clickMore(node, event);
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
    if (
      selected === node._key ||
      selectedNodes.findIndex(item => item._key === node._key) !== -1
    ) {
      return 'selected';
    } else if (
      // 有边框的节点
      !hideBorder &&
      (node.father === startId || node._key === startId)
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
    return nodeLocation(
      node,
      type,
      BLOCK_HEIGHT,
      showIcon,
      showAvatar,
      avatarRadius
    );
  }

  function handleClickLink(type: string, url: string) {
    if (type === 'link') {
      if (url.includes('http')) {
        window.open(url, '_blank');
      } else {
        window.open(`http://${url}`, '_blank');
      }
    }
  }

  const textLocationRes = location(node, 'text');
  const circleLocationRes = location(node, 'avatar');
  const checkLocationRes = location(node, 'checkbox');
  const statusLocationRes = location(node, 'status');
  const iconLocationRes = location(node, 'icon');

  const nodeRectClassName = rectClassName(node);

  const backgroundColor = node.backgroundColor
    ? node.backgroundColor
    : node._key === startId
    ? '#CB1B45'
    : selectedBackgroundColor;

  const urlReg = /((\w{1,}\.+)+(com|cn|org|net|info))|(http:\/\/(\w{1,}\.+)+(com|cn|org|net|info))|(https:\/\/(\w{1,}\.+)+(com|cn|org|net|info))/g;
  let nameLinkArr = [];
  if (urlReg.test(node.name)) {
    let arr1: string[] = [];
    const matchList = node.name.match(urlReg);
    if (matchList) {
      const splitReg = new RegExp(matchList.join('|'));
      const textList = node.name.split(splitReg);
      for (let index = 0; index < textList.length; index++) {
        const text = textList[index];
        arr1.push(text);
        if (matchList[index]) {
          arr1.push(matchList[index]);
        }
      }
    }

    let marginLeft = 0;
    let count = 0;
    if (arr1 && arr1.length) {
      for (let index = 0; index < arr1.length; index++) {
        let name = arr1[index];
        if (index !== 0) {
          marginLeft += textWidthAll(FONT_SIZE, arr1[index - 1]);
        }
        let type = urlReg.test(name) ? 'link' : 'text';

        let shortedName = '';
        if (node.shorted) {
          for (let index = 0; index < name.length; index++) {
            if (count < 28) {
              const char = name[index];
              // 全角
              if (char.match(/[^\x00-\xff]/g)) {
                count++;
              } else {
                count += 0.5;
              }
              shortedName += char;
            } else {
              break;
            }
          }
          if (count >= 28) {
            shortedName = `${shortedName}...`;
          }
        }
        if (count >= 28) {
          nameLinkArr.push({
            text: name,
            shortedName,
            type,
            marginLeft,
          });
          break;
        } else {
          nameLinkArr.push({
            text: name,
            type,
            marginLeft,
          });
        }
      }
    }
  }

  let nodeRectStyle = {};
  if ((dragStarted && hover) || dragIn) {
    nodeRectStyle = {
      fill: backgroundColor,
      fillOpacity: 0.5,
      stroke: selectedBorderColor,
      strokeWidth: 2,
    };
  } else {
    switch (nodeRectClassName) {
      case 'border-rect':
        nodeRectStyle = {
          fill: backgroundColor,
          stroke: hover ? hoverBorderColor : 'unset',
          strokeWidth: 2,
        };
        break;
      case 'selected':
        nodeRectStyle = {
          fill: backgroundColor,
          stroke: selectedBorderColor,
          strokeWidth: 2,
          fillOpacity: pasteNodeKey && pasteNodeKey === node._key ? 0.4 : 1,
          strokeOpacity: pasteNodeKey && pasteNodeKey === node._key ? 0.4 : 1,
        };
        break;
      default:
        nodeRectStyle = {
          fill: node.backgroundColor ? backgroundColor : '#f0f0f0',
          // fillOpacity: node.backgroundColor ? 1 : 0,
          stroke: hover ? hoverBorderColor : 'unset',
          strokeWidth: 2,
        };
        break;
    }
  }

  const normalTextColor = nodeRectClassName ? '#595959' : color;
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
        if (e.button === 0) {
          e.stopPropagation();
          setMouseDown(true);
          setclickX(e.clientX);
          setclickY(e.clientY);
        }
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
        y={node.y}
        width={node.name ? node.width + totalButtonWidth : 100}
        height={BLOCK_HEIGHT}
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
        // filter={
        //   nodeRectClassName !== 'selected' &&
        //   node.father === startId &&
        //   !node.backgroundColor
        //     ? 'url(#filterShadow)'
        //     : 'unset'
        // }
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
          viewBox={`0,0,${avatarRadius * 2},${avatarRadius * 2}`}
        >
          <clipPath id={`${alias}-avatar-clip-${node._key}`}>
            <circle
              cx={circleLocationRes ? circleLocationRes.x + avatarRadius : 0}
              cy={circleLocationRes ? circleLocationRes.y + avatarRadius : 0}
              r={avatarRadius}
            />
          </clipPath>
          <image
            x={circleLocationRes?.x}
            y={circleLocationRes?.y}
            width={avatarRadius * 2}
            height={avatarRadius * 2}
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
          {!hideHour ? (
            <use
              href={`#status${
                limitDayNum && limitDayNum < 0
                  ? node.checked
                    ? '-complete'
                    : '-overdue'
                  : ''
              }`}
              x={statusLocationRes?.x}
              y={statusLocationRes?.y}
            />
          ) : (
            <use
              href={`#status-onlyday${
                limitDayNum && limitDayNum < 0
                  ? node.checked
                    ? '-complete'
                    : '-overdue'
                  : ''
              }`}
              x={statusLocationRes?.x}
              y={statusLocationRes?.y}
            />
          )}
          <g fill="#fff" textAnchor="middle" dominantBaseline="middle">
            <text
              x={
                statusLocationRes
                  ? !hideHour
                    ? statusLocationRes.x + 9
                    : statusLocationRes.x + 11
                  : 0
              }
              y={
                statusLocationRes
                  ? !hideHour
                    ? statusLocationRes.y + 15
                    : statusLocationRes.y + 11
                  : 0
              }
              fontSize="10"
              fontWeight="800"
              style={{ userSelect: 'none' }}
            >
              {node.limitDay !== undefined
                ? Math.abs(limitDayNum) > 99
                  ? '99+'
                  : Math.abs(limitDayNum)
                : '-'}
            </text>
            {!hideHour ? (
              <text
                x={statusLocationRes ? statusLocationRes.x + 15 : 0}
                y={statusLocationRes ? statusLocationRes.y + 6 : 0}
                fontSize="8"
                fontWeight="800"
                style={{ userSelect: 'none' }}
              >
                {node.hour ? (node.hour > 9 ? '9+' : node.hour) : '-'}
              </text>
            ) : null}
          </g>
        </g>
      ) : null}

      {/* 文字 */}
      {nameLinkArr.length ? (
        nameLinkArr.map((name, index) => (
          <text
            key={index}
            className={`node-text ${selected === node._key ? 'selected' : ''}`}
            x={textLocationRes ? textLocationRes.x + name.marginLeft : 0}
            y={textLocationRes?.y}
            dominantBaseline="middle"
            fontSize={FONT_SIZE}
            style={{
              fill:
                name.type === 'link'
                  ? '#6495ED'
                  : node.strikethrough
                  ? '#999'
                  : nodeRectClassName === 'selected' &&
                    !node.color &&
                    node._key !== startId
                  ? '#000000'
                  : node._key === startId
                  ? '#FFF'
                  : node.color
                  ? node.color
                  : normalTextColor,
              fillOpacity: pasteNodeKey && pasteNodeKey === node._key ? 0.4 : 1,
              fontFamily: "'Microsoft YaHei', sans-serif",
              userSelect: 'none',
              textDecoration: node.strikethrough ? 'line-through' : 'unset',
              cursor: name.type === 'link' ? 'pointer' : 'auto',
              fontWeight: fontWeight ? fontWeight : 'normal',
            }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDragEnd}
            onClick={() => handleClickLink(name.type, name.text)}
          >
            {name.shortedName || name.text}
          </text>
        ))
      ) : (
        <text
          className={`node-text ${selected === node._key ? 'selected' : ''}`}
          x={textLocationRes?.x}
          y={textLocationRes?.y}
          dominantBaseline="middle"
          fontSize={FONT_SIZE}
          style={{
            fill: node.strikethrough
              ? '#999'
              : nodeRectClassName === 'selected' &&
                !node.color &&
                node._key !== startId
              ? '#000000'
              : node._key === startId
              ? '#FFF'
              : node.color
              ? node.color
              : normalTextColor,
            fillOpacity: pasteNodeKey && pasteNodeKey === node._key ? 0.4 : 1,
            fontFamily: "'Microsoft YaHei', sans-serif",
            userSelect: 'none',
            textDecoration: node.strikethrough ? 'line-through' : 'unset',
            fontWeight: fontWeight ? fontWeight : 'normal',
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDragEnd}
        >
          {node.shorted || node.name || ''}
        </text>
      )}

      {true ? (
        // || nodeOptionsOpened
        <g
          style={{
            opacity: hover && !dragStarted ? 1 : 0,
          }}
        >
          {/* 預覽按鈕 */}
          {showPreviewButton ? (
            <use
              href="#preview"
              x={hoverPreview ? previewButtonX - 2 : previewButtonX}
              y={hoverPreview ? buttonY - 2 : buttonY}
              width={hoverPreview ? buttonWidth + 2 : buttonWidth}
              height={hoverPreview ? buttonWidth + 2 : buttonWidth}
              onClick={handleClickPreview}
              // fill={hoverPreview ? '#000000' : '#757676'}
              fill={color}
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
              // fill={hoverAdd ? '#000000' : '#757676'}
              fill={color}
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
              // fill={hoverMore ? '#000000' : '#757676'}
              fill={color}
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
          // nodeHover={hover}
          color={dotColor}
          position={node.toLeft ? 'right' : 'left'}
        />
      ) : null}

      {hover || selected === node._key || node.contract ? (
        <Expand
          node={node}
          BLOCK_HEIGHT={BLOCK_HEIGHT}
          handleClickExpand={() => handleExpand(node)}
          position={
            bottomOptions
              ? node.toLeft
                ? 'left'
                : 'right'
              : node._key === startId && !singleColumn
              ? 'bottomCenter'
              : 'leftBottom'
          }
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
