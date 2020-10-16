import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import NodeMap from './interfaces/NodeMap';
import CNode from './interfaces/CNode';
import TreeNode from './components/TreeNode';
import Dot from './components/Dot';
import Expand from './components/Expand';
import NodeInput from './components/NodeInput';
import NodeOptions from './components/NodeOptions';
import calculate from './services/treeService';
import {
  dot,
  checkNode,
  changeNodeText,
  addNextNode,
  addChildNode,
  deleteNode,
} from './services/util';

export interface TreeProps {
  // 节点
  nodes: NodeMap;
  // 根节点id
  startId: string;
  // 选中节点id
  defaultSelectedId?: string;
  //  非受控模式
  uncontrolled?: boolean;
  // 是否单列
  singleColumn?: boolean;
  // 节点元素高度
  itemHeight?: number;
  // 节点块高度
  blockHeight?: number;
  // 节点字体大小
  fontSize?: number;
  // 缩进
  indent?: number;
  // 头像宽度
  avatarWidth?: number;
  checkBoxWidth?: number;
  pathWidth?: number;
  disableShortcut?: boolean;
  showNodeOptions?: boolean;
  nodeOptions?: any;
  showIcon?: boolean;
  handleClickExpand?: Function;
  handleCheck?: Function;
  handleClickNode?: Function;
  handleDbClickNode?: Function;
  handleChangeNodeText?: Function;
  handleAddNext?: Function;
  handleAddChild?: Function;
  handleDeleteNode?: Function;
  handleClickOptionsButton?: Function;
  ref?: any;
}

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
export const Tree = React.forwardRef(
  (
    {
      nodes,
      startId,
      defaultSelectedId,
      uncontrolled,
      singleColumn,
      itemHeight,
      blockHeight,
      fontSize,
      indent,
      // avatarWidth,
      // checkBoxWidth,
      pathWidth,
      disableShortcut,
      showNodeOptions,
      nodeOptions,
      showIcon,
      handleClickExpand,
      handleCheck,
      handleClickNode,
      handleDbClickNode,
      handleChangeNodeText,
      handleAddNext,
      handleAddChild,
      handleDeleteNode,
      handleClickOptionsButton,
    }: TreeProps,
    ref
  ) => {
    let clickTimeId: NodeJS.Timeout;

    const ITEM_HEIGHT = itemHeight || 50;
    const BLOCK_HEIGHT = blockHeight || 30;
    const FONT_SIZE = fontSize || 14;
    const INDENT = indent || 25;
    // const AVATAR_WIDTH = avatarWidth || 22;
    // const CHECK_BOX_WIDTH = checkBoxWidth || 18;
    const PATH_WIDTH = pathWidth || 1.5;
    const UNCONTROLLED = uncontrolled === undefined ? true : uncontrolled;
    const SHOW_ICON = showIcon === undefined ? true : showIcon;

    const [nodeMap, setNodeMap] = useState(nodes);
    const [secondStartX, setSecondStartX] = useState<number | undefined>(0);
    const [secondEndX, setSecondEndX] = useState<number | undefined>(0);
    const [cnodes, setcnodes] = useState<CNode[]>([]);
    // const [maxX, setmaxX] = useState(0);
    const [maxY, setmaxY] = useState(0);
    const [maxEnd, setmaxEnd] = useState(0);
    const [selectedId, setselectedId] = useState<string | null>(null);
    const [showInput, setshowInput] = useState(false);
    const [showNewInput, setshowNewInput] = useState(false);
    const [isSingle, setisSingle] = useState(singleColumn);
    const [showOptions, setShowOptions] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    // 暴露方法
    useImperativeHandle(ref, () => ({
      deleteNode: deletenode,
      saveNodes,
      addNext,
      addChild,
      rename: function() {
        if (selectedId) {
          setshowInput(true);
        } else {
          alert('请先选中节点');
        }
      },
    }));

    // 参数nodes发生改变，重设nodeMap
    useEffect(() => {
      setNodeMap(nodes);
    }, [nodes]);

    // nodeMap发生改变，根据nodeMap计算渲染所需数据
    useEffect(() => {
      console.log('根据nodeMap计算渲染所需数据');
      const cal = calculate(
        nodeMap,
        startId,
        singleColumn,
        ITEM_HEIGHT,
        INDENT,
        FONT_SIZE,
        SHOW_ICON
      );

      setcnodes(cal.nodes);
      // setmaxX(cal.max_x);
      setmaxY(cal.max_y);
      setmaxEnd(cal.max_end);
      setSecondStartX(cal.second_start_x);
      setSecondEndX(cal.second_end_x);
      setisSingle(cal.isSingle);
    }, [nodeMap, startId, singleColumn]);

    useEffect(() => {
      if (defaultSelectedId) {
        setShowOptions(false);
        setselectedId(defaultSelectedId);
      }
    }, [defaultSelectedId]);

    // 有父节点时的左侧水平线条
    function fatherPath(node: CNode) {
      const M = `M ${node.x} ${node.y + BLOCK_HEIGHT / 2}`;
      const H = `H ${node.x - (INDENT - 5)}`;
      return `${M} ${H}`;
    }

    // 有子节点时的下部线条
    function childPath(node: CNode) {
      const M = `M ${node.x + 5} ${node.y + BLOCK_HEIGHT}`;
      const V = `V ${node.last_child_y + BLOCK_HEIGHT / 2}`;
      return `${M} ${V}`;
    }

    // 根节点底部水平线
    function rootHpaht() {
      const M = `M ${secondStartX} ${ITEM_HEIGHT * 1.5 -
        (ITEM_HEIGHT * 1.5 - BLOCK_HEIGHT) / 2}`;
      const H = `H ${secondEndX}`;
      return `${M} ${H}`;
    }

    // 根节点底部纵线
    function rootVpath(node: CNode) {
      const M = `M ${node.x + node.width / 2} ${node.y + BLOCK_HEIGHT}`;
      const V = `V ${ITEM_HEIGHT * 1.5 -
        (ITEM_HEIGHT * 1.5 - BLOCK_HEIGHT) / 2}`;
      return `${M} ${V}`;
    }

    // 第二层节点头部纵线
    function rootBottomVpath(node: CNode) {
      const M = `M ${node.x + node.width / 2} ${node.y}`;
      const V = `V ${node.y - (ITEM_HEIGHT * 1.5 - BLOCK_HEIGHT) / 2}`;
      return `${M} ${V}`;
    }

    // 单击节点
    function clickNode(node: CNode) {
      clearTimeout(clickTimeId);
      clickTimeId = setTimeout(function() {
        setselectedId(node._key);
        if (handleClickNode) {
          handleClickNode(node);
        }
      }, 250);
    }

    // 双击节点
    function dbClickNode(node: CNode) {
      clearTimeout(clickTimeId);
      setselectedId(node._key);
      setshowInput(true);
      if (handleDbClickNode) {
        handleDbClickNode(node);
      }
    }

    // 展开/收起节点
    function handleExpand(node: CNode) {
      if (UNCONTROLLED) {
        let nodes = dot(nodeMap, node._key);
        setNodeMap(nodes);
      }
      if (handleClickExpand) {
        handleClickExpand(node);
      }
    }
    // check节点
    function check(node: CNode, e: MouseEvent) {
      e.stopPropagation();
      if (UNCONTROLLED) {
        let nodes = checkNode(nodeMap, node._key);
        setNodeMap(nodes);
      }
      if (handleCheck) {
        handleCheck(node);
      }
    }

    // 节点改名
    function changeText(nodeId: string, text: string) {
      setshowInput(false);
      setshowNewInput(false);

      if (UNCONTROLLED) {
        let nodes = changeNodeText(nodeMap, nodeId, text);
        setNodeMap(nodes);
        if (containerRef && containerRef.current) {
          containerRef.current.focus();
        }
      }
      if (handleChangeNodeText) {
        handleChangeNodeText(nodeId, text);
      }
    }

    // 添加平级节点
    function addNext() {
      if (!selectedId) {
        return alert('请先选中节点！');
      }
      if (selectedId === startId) {
        return alert('根节点无法添加兄弟节点！');
      }
      setShowOptions(false);
      if (UNCONTROLLED) {
        const res = addNextNode(nodeMap, selectedId);

        if (handleAddNext) {
          handleAddNext(selectedId, res.addedNode);
        }

        setselectedId(res.addedNode._key);
        setNodeMap(res.nodes);
        setshowInput(true);
      } else {
        if (handleAddNext) {
          handleAddNext(selectedId);
        }
      }
    }

    // 添加子节点
    function addChild() {
      if (!selectedId) {
        return alert('请先选中节点！');
      }

      setShowOptions(false);
      if (UNCONTROLLED) {
        const res = addChildNode(nodeMap, selectedId);

        if (handleAddChild) {
          handleAddChild(selectedId, res.addedNode);
        }

        setselectedId(res.addedNode._key);
        setNodeMap(res.nodes);
        setshowInput(true);
      } else {
        if (handleAddChild) {
          handleAddChild(selectedId);
        }
      }
    }

    // 删除节点
    function deletenode() {
      if (!selectedId) {
        return alert('请先选中节点！');
      }
      if (selectedId === startId) {
        return alert('根节点不允许删除！');
      }

      setShowOptions(false);
      if (UNCONTROLLED) {
        let nodes = deleteNode(nodeMap, selectedId);

        if (handleDeleteNode) {
          handleDeleteNode(selectedId);
        }

        setselectedId(null);
        setNodeMap(nodes);
      } else {
        if (handleDeleteNode) {
          handleDeleteNode(selectedId);
        }
      }
    }

    function saveNodes() {
      return nodeMap;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (disableShortcut || showInput || showNewInput) {
        return;
      }
      event.preventDefault();
      switch (event.key) {
        case 'Enter':
          addNext();
          break;
        case 'Tab':
          addChild();
          break;
        case 'Delete':
        case 'Backspace':
          deletenode();
          break;
        default:
          break;
      }
    }

    function handleClick(node: CNode, e: MouseEvent) {
      e.stopPropagation();
      if (handleClickOptionsButton) {
        handleClickOptionsButton(node);
      }
      setShowOptions(true);
    }

    return (
      <div
        className="svg-wrapper"
        style={{
          position: 'relative',
          outline: 'none',
        }}
        // className={styles.svgwrapper}
        tabIndex={-1}
        ref={containerRef}
        onKeyDown={(e: any) => handleKeyDown(e)}
      >
        <svg
          className="tree-svg"
          viewBox={`0 0 ${maxEnd + 35} ${maxY + ITEM_HEIGHT}`}
          width={maxEnd + 35}
          height={maxY + ITEM_HEIGHT}
        >
          <defs>
            <filter id="filterShadow" x="0" y="0" width="200%" height="200%">
              <feOffset
                result="offOut"
                in="SourceAlpha"
                dx="2"
                dy="4"
              ></feOffset>
              <feColorMatrix
                result="matrixOut"
                in="offOut"
                type="matrix"
                values="0.3 0 0 0 0 
                     0 0.3 0 0 0 
                     0 0 0.3 0 0 
                     0 0 0 0.3 0"
              ></feColorMatrix>
              <feGaussianBlur
                result="blurOut"
                in="matrixOut"
                stdDeviation="1"
              ></feGaussianBlur>
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>
            </filter>

            <g
              id="contract"
              width="10"
              height="10"
              viewBox="0,0,10,10"
              preserveAspectRatio="xMinYMin meet"
            >
              <circle cx="5" cy="5" r="5" fill="#F0F0F0" stroke="#BFBFBF" />
              <path d="M 2 5 H 8 5" stroke="#666" strokeWidth="1.6" />
            </g>
            <g
              id="expand"
              width="10"
              height="10"
              viewBox="0,0,10,10"
              preserveAspectRatio="xMinYMin meet"
            >
              <circle cx="5" cy="5" r="5" fill="#F0F0F0" stroke="#BFBFBF" />
              <path d="M 2 5 H 8 5" stroke="#666" strokeWidth="1.6" />
              <path d="M 5 2  V 5 8" stroke="#666" strokeWidth="1.6" />
            </g>
            <g
              id="checkbox-checked"
              width="18"
              height="18"
              viewBox="0,0,18,18"
              preserveAspectRatio="xMinYMin meet"
            >
              <circle cx="9" cy="9" r="9" fill="rgb(85, 85, 85)" />
              <path d="M 4 9 L 8 13 L 14 5" stroke="#fff" strokeWidth="1.6" />
            </g>
            <g
              id="checkbox-uncheck"
              width="18"
              height="18"
              viewBox="0,0,18,18"
              preserveAspectRatio="xMinYMin meet"
            >
              <circle
                cx="9"
                cy="9"
                r="9"
                fill="rgb(216, 216, 216)"
                stroke="#000000"
              />
            </g>
            <g
              id="status"
              width="22"
              height="22"
              viewBox="0,0,22,22"
              preserveAspectRatio="xMinYMin meet"
            >
              <path d="M0 0 H 11 L 22 11 V 22 H 0 Z" fill="rgb(85, 85, 85)" />
              <path d="M 11 0 H 22 V 11 Z" fill="rgb(53, 166, 248)" />
            </g>
            <g
              id="status-overdue"
              width="22"
              height="22"
              viewBox="0,0,22,22"
              preserveAspectRatio="xMinYMin meet"
            >
              <path d="M0 0 H 11 L 22 11 V 22 H 0 Z" fill="rgb(221, 53, 53)" />
              <path d="M 11 0 H 22 V 11 Z" fill="rgb(53, 166, 248)" />
            </g>
          </defs>
          {cnodes.map(node => (
            <g key={node._key} className={`node-group-${node._key}`}>
              <TreeNode
                node={node}
                BLOCK_HEIGHT={BLOCK_HEIGHT}
                FONT_SIZE={FONT_SIZE}
                startId={startId}
                alias={new Date().getTime()}
                selected={selectedId}
                showIcon={SHOW_ICON}
                showNodeOptions={showNodeOptions || false}
                handleCheck={check}
                handleClickNode={clickNode}
                handleDbClickNode={dbClickNode}
                openOptions={handleClick}
              />
              {isSingle ? (
                node.x && node.y ? (
                  <g className="multi-column">
                    <path
                      d={fatherPath(node)}
                      fill="none"
                      stroke="rgb(192,192,192)"
                      strokeWidth={PATH_WIDTH}
                    />
                    {node.sortList && node.sortList.length && !node.contract ? (
                      <path
                        d={childPath(node)}
                        fill="none"
                        stroke="rgb(192,192,192)"
                        strokeWidth={PATH_WIDTH}
                      />
                    ) : null}
                  </g>
                ) : null
              ) : (
                <g className="single-column">
                  {/* 线条：左侧横线 */}
                  {node.x &&
                  node.y &&
                  // 有父节点
                  node.father &&
                  // 父节点不为开始节点
                  node.father !== startId &&
                  node._key !== startId ? (
                    <path
                      d={fatherPath(node)}
                      fill="none"
                      stroke="rgb(192,192,192)"
                      strokeWidth={PATH_WIDTH}
                    />
                  ) : null}

                  {/* 线条：纵线 */}
                  {node.x &&
                  node.y &&
                  node.sortList &&
                  node.sortList.length &&
                  !node.contract &&
                  node._key !== startId ? (
                    <path
                      d={childPath(node)}
                      fill="none"
                      stroke="rgb(192,192,192)"
                      strokeWidth={PATH_WIDTH}
                    />
                  ) : null}

                  {/* 根节点底部线条 */}
                  {node._key === startId &&
                  node.sortList &&
                  node.sortList.length &&
                  !node.contract ? (
                    <path
                      d={rootHpaht()}
                      fill="none"
                      stroke="rgb(192,192,192)"
                      strokeWidth={PATH_WIDTH}
                    />
                  ) : null}
                  {node._key === startId &&
                  node.sortList &&
                  node.sortList.length &&
                  !node.contract ? (
                    <path
                      d={rootVpath(node)}
                      fill="none"
                      stroke="rgb(192,192,192)"
                      strokeWidth={PATH_WIDTH}
                    />
                  ) : null}
                  {node.x &&
                  node.y &&
                  node.father &&
                  node.father === startId ? (
                    <path
                      d={rootBottomVpath(node)}
                      fill="none"
                      stroke="rgb(192,192,192)"
                      strokeWidth={PATH_WIDTH}
                    />
                  ) : null}
                </g>
              )}
              <Dot node={node} BLOCK_HEIGHT={BLOCK_HEIGHT} />
              <Expand
                node={node}
                BLOCK_HEIGHT={BLOCK_HEIGHT}
                handleClickExpand={() => handleExpand(node)}
                position={
                  node._key === startId && !singleColumn
                    ? 'bottomCenter'
                    : 'leftBottom'
                }
              />
            </g>
          ))}
        </svg>
        {showInput || showNewInput ? (
          <NodeInput
            selectedId={selectedId}
            nodeList={cnodes}
            handleChangeNodeText={changeText}
          />
        ) : null}
        {selectedId && showOptions && nodeOptions ? (
          <NodeOptions
            selectedId={selectedId}
            nodeList={cnodes}
            content={nodeOptions}
            handleClose={() => setShowOptions(false)}
          />
        ) : null}
      </div>
    );
  }
);
