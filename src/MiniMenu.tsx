import React, { useState, useEffect, useContext } from 'react';
import NodeMap from './interfaces/NodeMap';
import Node from './interfaces/Node';
import { guid } from './services/util';

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
  handleMouseEnter?: Function;
  handleMouseLeave?: Function;
  handleCrossCompDrag?: Function;
}
const ThemeContext = React.createContext({} as IContextProps);

export interface MiniMenuProps {
  // 节点
  nodes: NodeMap;
  // 根节点id
  startId: string;
  // 下拉节点列表，如果有此参数，则不使用startId的子节点，用此列表代替
  dropdownNodeKeyList?: string[];
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
  columnSpacing?: number;
  borderRadius?: number;
  normalFirstLevel?: boolean;
  handleClickNode?: Function;
  handleClickExpand?: Function;
  handleMouseEnter?: Function;
  handleMouseLeave?: Function;
  handleCrossCompDrag?: Function;
}

export const MiniMenu = ({
  // 节点
  nodes,
  // 根节点id
  startId,
  dropdownNodeKeyList,
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
  columnSpacing,
  borderRadius,
  normalFirstLevel,
  handleClickNode,
  handleClickExpand,
  handleMouseEnter,
  handleMouseLeave,
  handleCrossCompDrag,
}: MiniMenuProps) => {
  const WIDTH = width || 48;
  const ITEM_HEIGHT = itemHeight || 48;
  const rootNode = nodes[startId];
  const BKCOLOR = backgroundColor || 'rgb(51, 51, 51)';
  const SEL_BKCOLOR = selectedBackgroundColor || 'rgb(0, 205, 211)';
  const COLOR = color || 'rgb(205, 208, 210)';
  const FONT_SIZE = fontSize || 14;

  const [compId, setCompId] = useState('');

  useEffect(() => {
    setCompId(guid(8, 16));
  }, []);

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

  const keyList = dropdownNodeKeyList
    ? dropdownNodeKeyList
    : rootNode && rootNode.sortList
    ? rootNode.sortList
    : [];

  return (
    <div
      style={{
        width: `${normalFirstLevel ? 180 : WIDTH}px`,
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
          handleMouseEnter,
          handleMouseLeave,
          handleCrossCompDrag,
        }}
      >
        {keyList.map((key, index) =>
          nodes[key] ? (
            <MenuItem
              key={`${index}_${key}`}
              node={nodes[key]}
              firstLevel={normalFirstLevel ? false : true}
              columnSpacing={columnSpacing}
              borderRadius={borderRadius}
              compId={compId}
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
  columnSpacing: number | undefined;
  borderRadius?: number;
  compId: string;
}
const MenuItem = ({
  node,
  firstLevel,
  columnSpacing,
  borderRadius,
  compId,
}: ItemProps) => {
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

  function handleMouseEnter() {
    setHover(true);
    if (firstLevel && configProps.handleMouseEnter) {
      configProps.handleMouseEnter();
    }
  }

  function handleMouseLeave() {
    setHover(false);
    if (firstLevel && configProps.handleMouseLeave) {
      configProps.handleMouseLeave();
    }
  }

  function handleMouseUp() {
    const crossCompDragId = sessionStorage.getItem('cross-comp-drag');
    const crossDragCompId = sessionStorage.getItem('cross-drag-compId');
    if (
      crossCompDragId &&
      configProps.handleCrossCompDrag &&
      crossDragCompId !== compId
    ) {
      configProps.handleCrossCompDrag(crossCompDragId, node._key);
      sessionStorage.removeItem('cross-comp-drag');
      sessionStorage.removeItem('cross-comp-drop');
      sessionStorage.removeItem('cross-drag-compId');
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e: React.MouseEvent) => handleClick(e)}
      onMouseUp={handleMouseUp}
    >
      {/* 圖標 */}
      {node.icon ? (
        <i
          style={{
            width: '22px',
            height: '22px',
            backgroundImage: `url("${node.icon}")`,
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
      {!firstLevel && node && node.sortList.length ? (
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
            paddingLeft: `${columnSpacing === undefined ? 1 : columnSpacing}px`,
          }}
        >
          <div
            style={{
              backgroundColor: backgroundColor,
              borderRadius: borderRadius === undefined ? '0' : borderRadius,
            }}
          >
            {node &&
              node.sortList &&
              node.sortList.map((key, index) =>
                nodes[key] ? (
                  <MenuItem
                    key={`${index}_${key}`}
                    node={nodes[key]}
                    columnSpacing={columnSpacing}
                    borderRadius={borderRadius}
                    compId={compId}
                  />
                ) : null
              )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
