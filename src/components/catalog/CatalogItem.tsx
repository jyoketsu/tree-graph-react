import React, { ReactElement, useState } from 'react';
import CNode from '../../interfaces/CNode';

interface Props {
  node: CNode;
  indent: number;
  color: string;
  hoverColor: string;
  BLOCK_HEIGHT: number;
  FONT_SIZE: number;
  fontWeight?:
    | '-moz-initial'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'unset'
    | 'normal'
    | 'bold'
    | (number & {})
    | 'bolder'
    | 'lighter'
    | undefined;
  handleClickNode: Function;
  handleClickExpand: Function;
  info?: ReactElement;
}
const CatalogItem = ({
  node,
  indent,
  color,
  hoverColor,
  BLOCK_HEIGHT,
  FONT_SIZE,
  fontWeight,
  handleClickNode,
  handleClickExpand,
  info,
}: Props) => {
  const [hover, sethover] = useState(false);
  const width = 12;

  return node.x && node.y ? (
    <div
      onClick={() => handleClickNode(node)}
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
      }}
    >
      <div
        style={{
          width: `${width}px`,
          marginRight: '8px',
        }}
      >
        {node.sortList && node.sortList.length ? (
          <div onClick={() => handleClickExpand()}>
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
      <span
        style={{
          fontWeight: fontWeight ? fontWeight : 'normal',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {node.name || ''}
      </span>
      <div
        style={{
          position: 'relative',
          flex: 1,
          margin: '0 15px',
          minWidth: '50%',
        }}
      >
        <div
          style={{
            width: '100%',
            borderBottom: '1px dashed #e8e8e8',
            position: 'absolute',
            top: '50%',
            right: 0,
          }}
        ></div>
      </div>
      {info ? <div style={{ flexShrink: 0 }}>{info}</div> : null}
    </div>
  ) : null;
};
export default CatalogItem;
