import React, { useMemo, useState } from 'react';
import Node from '../interfaces/Node';
import CNode from '../interfaces/CNode';
import Dot from '../components/Dot';
import Expand from '../components/Expand';
import DragInfo from '../interfaces/DragInfo';
import { isEmoji, nodeLocation, textWidthAll, urlReg } from '../services/util';
import { HandleFileChange } from '..';

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
  topBottomMargin: number;
  lineHeight: number;
  FONT_SIZE: number;
  avatarRadius: number;
  color: string;
  alias: number;
  selected: string | null;
  selectedNodes: Node[];
  showPreviewButton: boolean;
  showAddButton: boolean;
  showMoreButton: boolean;
  showChildNum: boolean;
  moreButtonWidth?: number;
  showIcon: boolean;
  showAvatar: boolean;
  singleColumn?: boolean;
  hideBorder?: boolean;
  dotColor: string;
  hoverBorderColor: string;
  selectedBorderColor: string;
  selectedBackgroundColor: string;
  nodeColor?: string;
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
  bottomOptions?: boolean;
  hideHour?: boolean;
  isMind?: boolean;
  handleFileChange?: HandleFileChange;
  onContextMenu?: (nodeKey: string, event: React.MouseEvent) => void;
  onClickNodeImage?: (url?: string) => void;
  onResizeImage: (nodeKey: string, width: number) => void;
}

// let timer: NodeJS.Timeout;

const TreeNode = ({
  node,
  startId,
  topBottomMargin,
  lineHeight,
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
  showChildNum,
  moreButtonWidth,
  dotColor,
  hoverBorderColor,
  selectedBorderColor,
  nodeColor,
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
  bottomOptions,
  hideHour,
  handleFileChange,
  onContextMenu,
  onClickNodeImage,
  onResizeImage,
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
  const [hoverImage, setHoverImage] = useState(false);
  const blockHeight = topBottomMargin * 2 + lineHeight;
  const textHeight =
    topBottomMargin * 2 + (node.texts?.length || 1) * lineHeight;
  const rectHeight =
    node.imageUrl && node.imageWidth && node.imageHeight
      ? textHeight + node.imageHeight + 15 / 2
      : textHeight;

  const iconIsEmoji = useMemo(() => isEmoji(node.icon), [node.icon]);

  let limitDayNum = node.limitDay
    ? node.limitDay - now > 0
      ? Math.floor((node.limitDay - now) / 86400000)
      : Math.floor((node.limitDay - now) / 86400000) - 1
    : 0;

  let lastX = 0;
  const gapTime = 166.66;
  let lastTime = 0;
  let width = 0;

  const pasteType = localStorage.getItem('pasteType');
  const pasteNodeKey =
    pasteType === 'cut' ? localStorage.getItem('pasteNodeKey') : null;

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

  function handleDragEnd(event: React.DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length && handleFileChange) {
      handleFileChange(node._key, node.name, files);
    } else {
      setDragIn(false);
      if (dragEndFromOutside) {
        dragEndFromOutside(node);
      }
    }
  }

  function rectClassName(node: CNode) {
    // 选中的节点
    if (
      selected === node._key ||
      selectedNodes.findIndex((item) => item._key === node._key) !== -1
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
      blockHeight,
      showIcon,
      showAvatar,
      avatarRadius,
      false
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

  function handleClickImage(event: React.MouseEvent) {
    event.stopPropagation();
    if (onClickNodeImage) {
      onClickNodeImage(node.imageUrl);
    } else {
      if (node.imageUrl?.startsWith('data:image/')) {
        const img = new window.Image();
        img.src = node.imageUrl;
        const newWin = window.open('');
        if (newWin) {
          newWin.document.write(img.outerHTML);
          newWin.document.title = node.name;
          newWin.document.close();
        }
      } else {
        window.open(node.imageUrl, '_blank');
      }
    }
  }

  function handleContextMenu(event: React.MouseEvent) {
    if (onContextMenu) {
      event.preventDefault();
      onContextMenu(node._key, event);
    }
  }

  function handleMouseEnterImage() {
    setHoverImage(true);
  }

  function handleMouseLeaveImage() {
    setHoverImage(false);
  }

  function handleStartResizeImage(e: React.MouseEvent) {
    e.stopPropagation();
    lastX = e.clientX;
    width = node.imageWidth || 0;
    window.addEventListener('mousemove', mouseMoveHandle);
    window.addEventListener('mouseup', mouseUpHandle);
  }

  function mouseMoveHandle(e: MouseEvent) {
    let time = new Date().getTime();
    if (time - lastTime > gapTime || !lastTime) {
      const diffX = e.clientX - lastX;
      lastX = e.clientX;

      // if (width.value + diffX > 100) {
      //   width.value += diffX;
      // }
      if (width + diffX > 100) {
        width += diffX;
        onResizeImage(node._key, width);
      }
      lastTime = time;
    }
  }

  function mouseUpHandle() {
    window.removeEventListener('mousemove', mouseMoveHandle);
    window.removeEventListener('mouseup', mouseUpHandle);
  }

  // const childNumLocationRes =
  //   showChildNum && node.childNum ? location(node, 'childNum') : null;
  const textLocationRes = location(node, 'text');
  const circleLocationRes = location(node, 'avatar');
  const checkLocationRes = location(node, 'checkbox');
  const statusLocationRes = location(node, 'status');
  const iconLocationRes = location(node, 'icon');
  const favoriteLocationRes = location(node, 'favorite');
  const packLocationRes = location(node, 'pack');
  const startAdornmentLocationRes = location(node, 'startAdornment');

  const singleRowLinks = useMemo(() => {
    if (!node.texts && urlReg.test(node.name)) {
      const name = node.name;
      const matchList = name.match(urlReg);
      if (!matchList) return undefined;
      const arr = name.replace(urlReg, '!@#').split(/(!@#)/);
      let matchListIndex = 0;
      let links = [];
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element === '!@#') {
          links.push({ text: matchList[matchListIndex], type: 'link' });
          matchListIndex++;
        } else {
          links.push({ text: element, type: 'text' });
        }
      }
      return links;
    } else {
      return undefined;
    }
  }, [node.name]);

  const nodeRectClassName = rectClassName(node);

  const backgroundColor = node.backgroundColor
    ? node.backgroundColor
    : node._key === startId
    ? '#CB1B45'
    : nodeColor || '#f0f0f0';

  let nameLinkArr = [];
  if (urlReg.test(node.name)) {
    let arr1: string[] = [];
    const matchList = node.name.match(urlReg);
    if (matchList) {
      let tempText = node.name;
      let textList = [];
      for (let index = 0; index < matchList.length; index++) {
        const element = matchList[index];
        tempText = tempText.replace(element, '!@#');
      }
      textList = tempText.split('!@#');
      for (let index = 0; index < textList.length; index++) {
        const text = textList[index];
        arr1.push(text);
        if (matchList[index]) {
          arr1.push(matchList[index]);
        }
      }
    }
    let marginLeft = 0;
    if (arr1 && arr1.length) {
      for (let index = 0; index < arr1.length; index++) {
        let name = arr1[index];
        if (index !== 0) {
          marginLeft += textWidthAll(FONT_SIZE, arr1[index - 1]);
        }
        let type = urlReg.test(name) ? 'link' : 'text';

        nameLinkArr.push({
          text: name,
          type,
          marginLeft,
        });
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
          fill:
            nodeColor || (node.backgroundColor ? backgroundColor : '#f0f0f0'),
          // fillOpacity: node.backgroundColor ? 1 : 0,
          stroke: hover ? hoverBorderColor : 'unset',
          strokeWidth: 2,
        };
        break;
    }
  }

  const normalTextColor = nodeRectClassName ? '#595959' : color;
  const buttonWidth = moreButtonWidth ? moreButtonWidth : lineHeight * 0.5;

  const buttonY = bottomOptions
    ? node.y + blockHeight
    : node.y + (blockHeight - buttonWidth) / 2;

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
      id={`tree-node-${node._key}`}
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
      onContextMenu={handleContextMenu}
      style={{ position: 'relative' }}
    >
      {/* 外框 */}
      {/* 隱式外框，用戶擴大鼠標感應面積 */}
      <rect
        x={node.x}
        y={node.y}
        width={node.name ? node.width + totalButtonWidth : 100}
        height={rectHeight}
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
        height={rectHeight}
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
      {/* {showChildNum && node.childNum ? (
        <g>
          <circle
            cx={(childNumLocationRes?.x || 0) + 11}
            cy={childNumLocationRes?.y || 0}
            r="11"
            fill={backgroundColor}
            style={{ filter: 'brightness(0.86)' }}
          />
          <text
            x={(childNumLocationRes?.x || 0) + 11}
            y={(childNumLocationRes?.y || 0) + 1}
            alignmentBaseline="middle"
            textAnchor="middle"
            fontSize={node.childNum > 999 ? 10 : 12}
            fill={node._key === startId ? '#FFF' : node.color || color}
            style={{ userSelect: 'none' }}
          >
            {node.childNum > 999 ? '999+' : node.childNum}
          </text>
        </g>
      ) : null} */}
      {node.isPack ? (
        <use
          key="pack"
          href="#pack"
          width="22"
          height="22"
          x={packLocationRes?.x}
          y={packLocationRes?.y}
        />
      ) : null}
      {node.hasCollect ? (
        <use
          key="favorite"
          href="#favorite"
          width="22"
          height="22"
          x={favoriteLocationRes?.x}
          y={favoriteLocationRes?.y}
        />
      ) : null}
      {/* 图标 */}
      {showIcon && node.icon ? (
        iconIsEmoji ? (
          <text
            x={iconLocationRes?.x}
            y={iconLocationRes?.emojiY}
            dominantBaseline="middle"
            fontSize="18px"
          >
            {node.icon}
          </text>
        ) : (
          <image
            key="avatar-image"
            x={iconLocationRes?.x}
            y={iconLocationRes?.y}
            width="22"
            height="22"
            href={node.icon}
            style={{ cursor: 'pointer' }}
            onClick={handleClickPreview}
          />
        )
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
            href={node.avatarUri}
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
              style={{ userSelect: 'none' }}
            >
              {node.limitDay
                ? Math.abs(limitDayNum) > 99
                  ? '99+'
                  : Math.abs(limitDayNum)
                : '∞'}
            </text>
            {!hideHour ? (
              <text
                x={statusLocationRes ? statusLocationRes.x + 15 : 0}
                y={statusLocationRes ? statusLocationRes.y + 6 : 0}
                fontSize="8"
                style={{ userSelect: 'none' }}
              >
                {node.hour ? (node.hour > 9 ? '9+' : node.hour) : '-'}
              </text>
            ) : null}
          </g>
        </g>
      ) : null}
      {node.startAdornment &&
      node.startAdornmentWidth &&
      node.startAdornmentHeight ? (
        <node.startAdornment
          x={startAdornmentLocationRes?.x || 0}
          y={startAdornmentLocationRes?.y || 0}
          nodeKey={node._key}
        />
      ) : null}

      {/* 文字 */}
      <text
        className={`node-text ${selected === node._key ? 'selected' : ''}`}
        x={textLocationRes?.x}
        y={textLocationRes?.y}
        dominantBaseline="middle"
        fontSize={FONT_SIZE}
        style={{
          fill:
            node.textDecoration === 'line-through'
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
          // fontFamily: "'Microsoft YaHei', sans-serif",
          userSelect: 'none',
          textDecoration: node.textDecoration,
          fontWeight: node.bold ? 'bold' : 'normal',
          fontStyle: node.italic ? 'italic' : 'unset',
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDragEnd}
      >
        {node.texts
          ? node.texts.map((text, index) => (
              <tspan
                key={index}
                x={textLocationRes?.x}
                dy={index === 0 ? undefined : lineHeight}
              >
                {text}
              </tspan>
            ))
          : singleRowLinks
          ? singleRowLinks.map((item, index) => (
              <tspan
                key={index}
                fill={item.type === 'link' ? selectedBorderColor : undefined}
                onClick={() => handleClickLink(item.type, item.text)}
              >
                {item.text}
              </tspan>
            ))
          : node.name}
      </text>

      {/* endAdornment */}
      {node.endAdornment &&
      node.endAdornmentWidth &&
      node.endAdornmentHeight ? (
        <node.endAdornment
          x={node.x + node.width - node.endAdornmentWidth - 5}
          y={
            node.y +
            (topBottomMargin * 2 +
              lineHeight -
              (node.endAdornmentHeight || 0)) /
              2
          }
          nodeKey={node._key}
        />
      ) : null}
      {/* 图片 */}
      {node.imageUrl && node.imageWidth && node.imageHeight ? (
        <g
          onMouseEnter={handleMouseEnterImage}
          onMouseLeave={handleMouseLeaveImage}
        >
          {hoverImage
            ? [
                <rect
                  key="image-hover-rect"
                  x={node?.x + 15 / 2}
                  y={
                    (node?.y || 0) +
                    topBottomMargin +
                    (node.texts?.length || 1) * lineHeight
                  }
                  width={node.imageWidth}
                  height={node.imageHeight}
                  stroke={selectedBorderColor}
                  strokeWidth={2}
                  fillOpacity={0}
                />,
                <rect
                  key="image-rect"
                  x={node?.x + 15 / 2}
                  y={
                    (node?.y || 0) +
                    topBottomMargin +
                    (node.texts?.length || 1) * lineHeight
                  }
                  width={node.imageWidth + 5}
                  height={node.imageHeight + 5}
                  fillOpacity={0}
                />,
              ]
            : null}
          <image
            x={node?.x + 15 / 2}
            y={
              (node?.y || 0) +
              topBottomMargin +
              (node.texts?.length || 1) * lineHeight
            }
            width={node.imageWidth}
            height={node.imageHeight}
            href={node.imageUrl}
            style={{ cursor: 'pointer' }}
            onClick={handleClickImage}
          />
          {hoverImage ? (
            <rect
              key="drag-handle"
              x={node?.x + 15 / 2 + node.imageWidth - 4}
              y={
                node.y +
                topBottomMargin +
                (node.texts?.length || 1) * lineHeight +
                node.imageHeight -
                4
              }
              width={8}
              height={8}
              stroke={selectedBorderColor}
              strokeWidth={2}
              // fillOpacity={0}
              fill="#FFF"
              style={{ cursor: 'nwse-resize' }}
              onMouseDown={handleStartResizeImage}
            />
          ) : null}
        </g>
      ) : null}

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
          BLOCK_HEIGHT={blockHeight}
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
          BLOCK_HEIGHT={blockHeight}
          showChildNum={showChildNum}
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
          PATH_COLOR={dotColor}
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
