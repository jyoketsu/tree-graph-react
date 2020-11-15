import React, { useState, useContext } from 'react';
import NodeMap from './interfaces/NodeMap';
import Node from './interfaces/Node';

interface IContextProps {
  nodes: NodeMap;
  width: number;
  backgroundColor: string;
  selectedBackgroundColor: string;
  color: string;
  height: number;
  // setSelectedId: Function;
  handleClickNode?: Function;
  handleClickExpand?: Function;
}
const ThemeContext = React.createContext({} as IContextProps);

export interface MiniMenuProps {
  // 节点
  nodes: NodeMap;
  // 根节点id
  startId: string;
  // 菜单宽度
  width?: number;
  // 菜单背景色
  backgroundColor?: string;
  // 选中菜单背景色
  selectedBackgroundColor?: string;
  // 字体颜色
  color?: string;
  // 节点元素高度
  itemHeight?: number;
  // 节点字体大小
  fontSize?: number;
  handleClickNode?: Function;
  handleClickExpand?: Function;
}

export const MiniMenu = ({
  // 节点
  nodes,
  // 根节点id
  startId,
  // 菜单宽度
  width,
  // 菜单背景色
  backgroundColor,
  // 选中菜单背景色
  selectedBackgroundColor,
  // 字体颜色
  color,
  // 节点元素高度
  itemHeight,
  // 节点字体大小
  fontSize,
  handleClickNode,
  handleClickExpand,
}: MiniMenuProps) => {
  const WIDTH = width || 48;
  const ITEM_HEIGHT = itemHeight || 48;
  const rootNode = nodes[startId];
  const BKCOLOR = backgroundColor || 'rgb(51, 51, 51)';
  const SEL_BKCOLOR = selectedBackgroundColor || 'rgb(0, 205, 211)';
  const COLOR = color || 'rgb(205, 208, 210)';
  const FONT_SIZE = fontSize || 14;

  // 當前點擊的節點id
  // const [selectedId, setSelectedId] = useState<string | null>(null);
  // 當前點擊的節點id所在的第一列節點id
  // const [firstLevelId, setFirstLevelId] = useState<string | null>(null);

  // useEffect(() => {
  //   function getFatherId(node: Node): string | null {
  //     if (node.father === startId) {
  //       return node._key;
  //     } else if (nodes[node.father]) {
  //       return getFatherId(nodes[node.father]);
  //     } else return null;
  //   }

  //   if (selectedId && nodes[selectedId]) {
  //     const id = getFatherId(nodes[selectedId]);
  //     if (id) {
  //       setFirstLevelId(id);
  //     }
  //   }
  // }, [selectedId]);

  return (
    <div
      style={{
        width: `${WIDTH}px`,
        color: COLOR,
        fontSize: `${FONT_SIZE}px`,
        backgroundColor: BKCOLOR,
      }}
    >
      <ThemeContext.Provider
        value={{
          nodes,
          width: WIDTH,
          height: ITEM_HEIGHT,
          backgroundColor: BKCOLOR,
          color: COLOR,
          handleClickNode,
          // setSelectedId,
          selectedBackgroundColor: SEL_BKCOLOR,
          handleClickExpand,
        }}
      >
        {rootNode.sortList.map(key =>
          nodes[key] ? (
            <MenuItem
              key={key}
              node={nodes[key]}
              firstLevel={true}
              // selectedId={firstLevelId}
            />
          ) : null
        )}
      </ThemeContext.Provider>
    </div>
  );
};

interface ItemProps {
  node: Node;
  firstLevel?: boolean;
  // selectedId?: string | null;
}
const MenuItem = ({ node, firstLevel }: ItemProps) => {
  const configProps = useContext(ThemeContext);
  const [hover, setHover] = useState(false);

  const nodes = configProps.nodes;
  const width = configProps.width;
  const height = configProps.height;
  const backgroundColor = configProps.backgroundColor;
  const color = configProps.color;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (configProps.handleClickNode) {
      // configProps.setSelectedId(node._key);
      configProps.handleClickNode(node);
    }
  }

  function clickExpand(e: React.MouseEvent) {
    e.stopPropagation();
    if (configProps.handleClickExpand) {
      configProps.handleClickExpand(node);
    }
  }

  return (
    <div
      style={{
        width: `${firstLevel ? width : 180}px`,
        height: `${height}px`,
        position: 'relative',
        display: 'flex',
        justifyContent: firstLevel ? 'center' : 'flex-start',
        alignItems: 'center',
        cursor: 'pointer',
        boxSizing: 'border-box',
        padding: '0 15px',
        // backgroundColor:
        //   node._key === selectedId
        //     ? configProps.selectedBackgroundColor
        //     : 'unset',
        backgroundColor: hover ? configProps.selectedBackgroundColor : 'unset',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e: React.MouseEvent) => handleClick(e)}
    >
      {/* 圖標 */}
      {node.icon ? (
        <i
          style={{
            width: '22px',
            height: '22px',
            backgroundImage: `url(${node.icon})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            marginRight: firstLevel ? 0 : '8px',
            flexShrink: 0,
          }}
        ></i>
      ) : // 如果沒有圖標，顯示name首個字符
      firstLevel ? (
        <div>{node.name.substring(0, 1)}</div>
      ) : null}
      {!firstLevel ? (
        // 節點名
        <span
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            color: hover ? '#FFF' : color,
          }}
        >
          {node.name || ''}
        </span>
      ) : null}
      {!firstLevel && node.sortList.length ? (
        <div
          style={{ position: 'absolute', right: '3px' }}
          onClick={(e: React.MouseEvent) => clickExpand(e)}
        >
          <svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1">
            <g>
              <path
                d={`M ${12 / 4} 0 L ${12 / 4 + 12 / 2} ${12 / 2} L ${12 /
                  4} ${12} Z`}
                fill={hover ? '#FFF' : color}
              ></path>
            </g>
          </svg>
        </div>
      ) : null}

      {hover ? (
        // 鼠標移上顯示子菜單
        <div
          className="subMenuWrapper"
          style={{
            position: 'absolute',
            top: 0,
            left: `${firstLevel ? width : 180}px`,
            paddingLeft: '5px',
          }}
        >
          <div
            style={{
              backgroundColor: backgroundColor,
              borderRadius: '4px',
            }}
          >
            {node.sortList &&
              node.sortList.map(key =>
                nodes[key] ? <MenuItem key={key} node={nodes[key]} /> : null
              )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
