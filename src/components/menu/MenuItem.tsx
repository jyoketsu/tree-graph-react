import React, { useState } from 'react';
import CNode from '../../interfaces/CNode';
import { ClickOutside } from '@jyoketsu/click-outside-react';

interface Props {
  node: CNode;
  indent: number;
  selectedBackgroundColor: string;
  color: string;
  hoverColor: string;
  BLOCK_HEIGHT: number;
  FONT_SIZE: number;
  selected: string | null;
  showMoreButton: boolean;
  showIcon: boolean;
  handleClickNode: Function;
  handleDbClickNode: Function;
  handleClickExpand: Function;
  clickMore: Function;
  showInput: boolean;
  handleChangeNodeText: Function;
}
const TreeNode = ({
  node,
  indent,
  selectedBackgroundColor,
  color,
  hoverColor,
  BLOCK_HEIGHT,
  FONT_SIZE,
  selected,
  showIcon,
  showMoreButton,
  handleClickNode,
  handleDbClickNode,
  handleClickExpand,
  clickMore,
  showInput,
  handleChangeNodeText,
}: Props) => {
  const width = 12;

  const [hover, sethover] = useState(false);
  const [value, setValue] = useState(node.name);

  function rectClassName(node: CNode) {
    // 选中的节点
    if (selected === node._key) {
      return 'selected';
    } else return '';
  }

  function handleClickMore() {
    clickMore(node);
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

  const nodeRectClassName = rectClassName(node);

  return node.x && node.y ? (
    <div
      onClick={() => handleClickNode(node)}
      onDoubleClick={() => handleDbClickNode(node)}
      onMouseEnter={() => sethover(true)}
      onMouseLeave={() => sethover(false)}
      style={{
        width: '100%',
        height: `${BLOCK_HEIGHT}px`,
        display: 'flex',
        alignItems: 'center',
        color: hover ? hoverColor : color,
        fontFamily: "'Microsoft YaHei', sans-serif",
        userSelect: 'none',
        cursor: hover ? 'pointer' : 'default',
        paddingLeft: `${node.x - indent}px`,
        fontSize: `${FONT_SIZE}px`,
        boxSizing: 'border-box',
        backgroundColor:
          nodeRectClassName === 'selected' ? selectedBackgroundColor : 'unset',
      }}
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
              {node.contract ? (
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
          }}
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
            onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
            onContextMenu={(e: React.MouseEvent) => e.stopPropagation()}
          />
        </ClickOutside>
      ) : (
        <span
          style={{
            fontSize: `${FONT_SIZE}px`,
            fontFamily: "'Microsoft YaHei', sans-serif",
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            color:
              nodeRectClassName === 'selected'
                ? '#FFF'
                : hover
                ? hoverColor
                : color,
          }}
        >
          {node.name || ''}
        </span>
      )}

      <div style={{ flex: 1 }}></div>
      {showMoreButton && hover ? (
        <div onClick={handleClickMore}>
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3163"
            width={BLOCK_HEIGHT}
            height={BLOCK_HEIGHT}
          >
            <path
              d="M426.666667 512a85.333333 85.333333 0 1 1 170.709333 0.042667A85.333333 85.333333 0 0 1 426.666667 512z m0 298.666667a85.333333 85.333333 0 1 1 170.709333 0.042666A85.333333 85.333333 0 0 1 426.666667 810.666667z m0-597.333334a85.333333 85.333333 0 1 1 170.709333 0.042667A85.333333 85.333333 0 0 1 426.666667 213.333333z"
              p-id="3164"
              fill={hoverColor}
            ></path>
          </svg>
        </div>
      ) : null}
    </div>
  ) : null;
};
export default TreeNode;
