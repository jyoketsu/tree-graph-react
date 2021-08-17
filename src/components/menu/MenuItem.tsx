import React, { useState, useRef } from 'react';
import CNode from '../../interfaces/CNode';
import { ClickOutside } from '@jyoketsu/click-outside-react';
import { textWidthAll } from '../../services/util';

interface Props {
  node: CNode;
  startId: string;
  indent: number;
  selectedBackgroundColor: string;
  dragLineColor: string;
  selectedColor: string;
  color: string;
  hoverColor: string;
  hoverBackgroundColor: string;
  cutColor: string;
  BLOCK_HEIGHT: number;
  FONT_SIZE: number;
  selected: string | null;
  showMoreButton: boolean;
  showIcon: boolean;
  disabled: boolean;
  showChildNum: boolean;
  handleClickNode: Function;
  handleDbClickNode: Function;
  handleClickExpand: Function;
  handleClickIcon: Function;
  clickMore: Function;
  showInput: boolean;
  handleChangeNodeText: Function;
  handleDrop: Function;
  pasteNodeKey: string | null;
  compId: string;
  collapseMode?: boolean;
  collapseModeCollapsed?: boolean;
}
const TreeNode = ({
  node,
  indent,
  selectedBackgroundColor,
  dragLineColor,
  color,
  selectedColor,
  hoverColor,
  hoverBackgroundColor,
  cutColor,
  BLOCK_HEIGHT,
  FONT_SIZE,
  selected,
  showIcon,
  disabled,
  showChildNum,
  showMoreButton,
  handleClickNode,
  handleDbClickNode,
  handleClickExpand,
  handleClickIcon,
  clickMore,
  showInput,
  handleChangeNodeText,
  handleDrop,
  pasteNodeKey,
  compId,
  collapseMode,
  collapseModeCollapsed,
}: Props) => {
  const width = 12;
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, sethover] = useState(false);
  const [value, setValue] = useState(node.name);
  const [dragStarted, setDragStarted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragIn, setIsDragIn] = useState(false);

  function rectClassName(node: CNode) {
    // 选中的节点
    if (selected === node._key) {
      return 'selected';
    } else return '';
  }

  function handleClickMore(e: React.MouseEvent) {
    clickMore(node, e);
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    handleClickExpand(node);
  }

  function handleCommit(event: KeyboardEvent) {
    if (event.key === 'Enter' && selected) {
      handleChangeNodeText(selected, value);
    }
  }

  const handleClickoutside = () => {
    if (selected && value) {
      handleChangeNodeText(selected, value);
    }
  };

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.dropEffect = 'move';
    setDragStarted(true);
    sessionStorage.setItem('dragNodeId', node._key);
    sessionStorage.setItem('cross-comp-drag', node._key);
    sessionStorage.setItem('cross-drag-compId', compId);
    // if (!editable) {
    //   dispatch(setCopyInfo(null, node._key, node.name, nodeKey));
    // }
  }

  function handleDropNode() {
    setIsDragOver(false);
    sessionStorage.setItem('dropNodeId', node._key);
    sessionStorage.setItem('placement', isDragIn ? 'in' : 'down');
    handleDrop();
    sessionStorage.removeItem('cross-comp-drag');
    sessionStorage.removeItem('cross-drag-compId');
  }

  function handleDragOver(e: React.MouseEvent) {
    if (!node.disabled) {
      e.preventDefault();
    }

    if (!isDragOver) {
      setIsDragOver(true);
    }
    if (BLOCK_HEIGHT - e.nativeEvent.offsetY > 5) {
      setIsDragIn(true);
    } else {
      setIsDragIn(false);
    }
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }
  function handleDragEnd() {
    setDragStarted(false);
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

  const nodeRectClassName = rectClassName(node);

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

  let collapsed;
  if (collapseMode) {
    collapsed = collapseModeCollapsed;
  } else {
    collapsed = node.contract;
  }

  return node.x && node.y ? (
    <div
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        handleClickNode(node);
      }}
      onDoubleClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        handleDbClickNode(node);
      }}
      onMouseEnter={() => sethover(true)}
      onMouseLeave={() => sethover(false)}
      style={{
        width: '100%',
        height: `${BLOCK_HEIGHT}px`,
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'Microsoft YaHei', sans-serif",
        userSelect: 'none',
        cursor: hover ? 'pointer' : 'default',
        paddingLeft: `${node.x - indent}px`,
        fontSize: `${FONT_SIZE}px`,
        boxSizing: 'border-box',
        backgroundColor: hover
          ? hoverBackgroundColor
          : nodeRectClassName === 'selected'
          ? selectedBackgroundColor
          : 'unset',
        borderStyle: 'solid',
        borderColor: dragLineColor,
        borderWidth: isDragOver ? (isDragIn ? '3px' : '0 0 2px 0') : 0,
      }}
      draggable={showInput || disabled || node.disabled ? false : true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropNode}
      onDragEnd={handleDragEnd}
      ref={containerRef}
    >
      <div
        style={{
          width: `${width}px`,
          marginRight: '4px',
        }}
      >
        {/* 折疊按鈕 */}
        {node.sortList && node.sortList.length ? (
          <div onClick={handleClick}>
            <svg width={width} height={width} viewBox={`0,0,${width},${width}`}>
              {collapsed ? (
                <path
                  d={`M ${width / 4} ${0} L ${width / 4 + width / 2} ${width /
                    2} L ${width / 4} ${width} Z`}
                  fill={hover ? hoverColor : color}
                ></path>
              ) : (
                <path
                  d={`M 0 ${width / 4} H ${width} L ${width / 2} ${width / 4 +
                    width / 2} Z`}
                  fill={hover ? hoverColor : color}
                ></path>
              )}
            </svg>
          </div>
        ) : null}
      </div>

      {/* 圖標 */}
      {showIcon && node.icon ? (
        <div
          style={{
            width: '22px',
            height: '22px',
            backgroundImage: `url("${node.icon}")`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            marginRight: '4px',
            flexShrink: 0,
          }}
          onClick={() => handleClickIcon(node)}
        ></div>
      ) : null}

      {/* 文字 */}
      {showInput ? (
        <ClickOutside onClickOutside={handleClickoutside}>
          <input
            autoFocus={true}
            placeholder="请输入名称"
            value={value}
            style={{
              boxSizing: 'border-box',
              border: '1px solid #000000',
              outline: 'none',
            }}
            onChange={e => setValue(e.target.value)}
            onKeyDown={(e: any) => handleCommit(e)}
            onBlur={() => handleChangeNodeText(selected, value)}
            onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
            onContextMenu={(e: React.MouseEvent) => e.stopPropagation()}
          />
        </ClickOutside>
      ) : nameLinkArr.length ? (
        <span
          style={{
            fontSize: `${FONT_SIZE}px`,
            fontFamily: "'Microsoft YaHei', sans-serif",
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            display: 'flex',
          }}
        >
          {nameLinkArr.map((name, index) => (
            <span
              key={index}
              style={{
                color:
                  pasteNodeKey === node._key
                    ? cutColor
                    : nodeRectClassName === 'selected'
                    ? selectedColor
                    : hover
                    ? hoverColor
                    : color,
                textDecoration: name.type === 'link' ? 'underline' : 'unset',
                fontWeight:
                  nodeRectClassName === 'selected' ? 'bold' : 'normal',
                // overflow: 'hidden',
                // whiteSpace: 'nowrap',
                // textOverflow: 'ellipsis',
              }}
              onClick={() => handleClickLink(name.type, name.text)}
            >
              {name.text || ''}
            </span>
          ))}
          {showChildNum ? (
            <span
              style={{
                color:
                  pasteNodeKey === node._key
                    ? cutColor
                    : nodeRectClassName === 'selected'
                    ? selectedColor
                    : hover
                    ? hoverColor
                    : color,
                fontWeight:
                  nodeRectClassName === 'selected' ? 'bold' : 'normal',
              }}
            >{` (${node.childNum || node.sortList.length})`}</span>
          ) : null}
        </span>
      ) : (
        <span
          style={{
            fontSize: `${FONT_SIZE}px`,
            fontFamily: "'Microsoft YaHei', sans-serif",
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            color:
              pasteNodeKey === node._key
                ? cutColor
                : nodeRectClassName === 'selected'
                ? selectedColor
                : hover
                ? hoverColor
                : color,
            fontWeight: nodeRectClassName === 'selected' ? 800 : 'normal',
          }}
        >
          {`${node.name || ''}${
            showChildNum ? ` (${node.childNum || node.sortList.length})` : ''
          }`}
        </span>
      )}

      <div style={{ flex: 1 }}></div>
      {showMoreButton ? (
        <div
          onClick={handleClickMore}
          style={{
            opacity: hover && !dragStarted ? 1 : 0,
          }}
        >
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3163"
            width={BLOCK_HEIGHT}
            height={BLOCK_HEIGHT - 8}
          >
            <path
              d="M426.666667 512a85.333333 85.333333 0 1 1 170.709333 0.042667A85.333333 85.333333 0 0 1 426.666667 512z m0 298.666667a85.333333 85.333333 0 1 1 170.709333 0.042666A85.333333 85.333333 0 0 1 426.666667 810.666667z m0-597.333334a85.333333 85.333333 0 1 1 170.709333 0.042667A85.333333 85.333333 0 0 1 426.666667 213.333333z"
              p-id="3164"
              fill={
                nodeRectClassName === 'selected' ? selectedColor : hoverColor
              }
            ></path>
          </svg>
        </div>
      ) : null}
    </div>
  ) : null;
};
export default TreeNode;
