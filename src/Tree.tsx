import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import NodeMap from './interfaces/NodeMap';
import CNode from './interfaces/CNode';
import DragInfo from './interfaces/DragInfo';
import TreeNode from './components/TreeNode';
import Expand from './components/Expand';
import NodeInput from './components/NodeInput';
// import NodeOptions from './components/NodeOptions';
import DragNode from './components/DragNode';
import calculate from './services/treeService';
import {
  dot,
  checkNode,
  changeNodeText,
  addNextNode,
  addChildNode,
  deleteNode,
  changeSortList,
  dragSort,
  pasteNode,
} from './services/util';

const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

interface PasteFunc {
  (
    pasteNodeKey: string,
    pasteType: 'copy' | 'cut' | null,
    targetNodeKey: string
  ): void;
}

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
  // 列間距
  columnSpacing?: number;
  // 头像宽度
  avatarWidth?: number;
  checkBoxWidth?: number;
  pathWidth?: number;
  // 线条圆角半径
  lineRadius?: number;
  disableShortcut?: boolean;
  disabled?: boolean;
  showPreviewButton?: boolean;
  showAddButton?: boolean;
  showMoreButton?: boolean;
  moreButtonWidth?: number;
  // nodeOptions?: any;
  showIcon?: boolean;
  showAvatar?: boolean;
  handleClickExpand?: Function;
  handleCheck?: Function;
  handleClickAvatar?: Function;
  handleClickStatus?: Function;
  handleClickNode?: Function;
  handleDbClickNode?: Function;
  handleChangeNodeText?: Function;
  handleAddNext?: Function;
  handleAddChild?: Function;
  handleDeleteNode?: Function;
  handleClickPreviewButton?: Function;
  handleClickAddButton?: Function;
  handleClickMoreButton?: Function;
  handleClickDot?: Function;
  handleShiftUpDown?: Function;
  handleDrag?: Function;
  handlePaste?: PasteFunc;
  dragEndFromOutside?: Function;
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
      columnSpacing,
      // avatarWidth,
      // checkBoxWidth,
      pathWidth,
      lineRadius,
      disableShortcut,
      disabled,
      showPreviewButton,
      showAddButton,
      showMoreButton,
      moreButtonWidth,
      // nodeOptions,
      showIcon,
      showAvatar,
      handleClickExpand,
      handleCheck,
      handleClickAvatar,
      handleClickStatus,
      handleClickNode,
      handleDbClickNode,
      handleChangeNodeText,
      handleAddNext,
      handleAddChild,
      handleDeleteNode,
      handleClickPreviewButton,
      handleClickAddButton,
      handleClickMoreButton,
      handleClickDot,
      handleShiftUpDown,
      handleDrag,
      handlePaste,
      dragEndFromOutside,
    }: TreeProps,
    ref
  ) => {
    let clickTimeId: NodeJS.Timeout;

    const ITEM_HEIGHT = itemHeight || 50;
    const BLOCK_HEIGHT = blockHeight || 30;
    const FONT_SIZE = fontSize || 14;
    const INDENT = indent || 25;
    const RADIUS = lineRadius || 4;
    // const AVATAR_WIDTH = avatarWidth || 22;
    // const CHECK_BOX_WIDTH = checkBoxWidth || 18;
    const PATH_WIDTH = pathWidth || 1;
    const UNCONTROLLED = uncontrolled === undefined ? true : uncontrolled;
    const SHOW_ICON = showIcon === undefined ? true : showIcon;
    const SHOW_AVATAR = showAvatar === undefined ? false : showAvatar;

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
    // const [showOptionsNode, setShowOptionsNode] = useState<CNode | null>(null);

    // 拖拽節點相關的狀態
    const [dragStarted, setDragStarted] = useState(false);
    const [showDragNode, setShowDragNode] = useState(false);
    const [clickX, setClickX] = useState(0);
    const [clickY, setClickY] = useState(0);
    const [movedNodeX, setMovedNodeX] = useState(0);
    const [movedNodeY, setMovedNodeY] = useState(0);
    // 拖拽的相關信息
    const [dragInfo, setDragInfo] = useState<DragInfo | null>(null);

    // 粘貼的節點key
    const [pasteNodeKey, setPasteNodeKey] = useState<string | null>(null);
    // 粘貼方式
    const [pasteType, setPasteType] = useState<'copy' | 'cut' | null>(null);

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
      // closeOptions: function() {
      //   setShowOptionsNode(null);
      // },
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
        SHOW_ICON,
        SHOW_AVATAR,
        undefined,
        undefined,
        columnSpacing
      );

      if (cal) {
        setcnodes(cal.nodes);
        // setmaxX(cal.max_x);
        setmaxY(cal.max_y);
        setmaxEnd(cal.max_end);
        setSecondStartX(cal.second_start_x);
        setSecondEndX(cal.second_end_x);
        setisSingle(cal.isSingle);
      }
    }, [nodeMap, startId, singleColumn]);

    useEffect(() => {
      if (defaultSelectedId) {
        // setShowOptionsNode(null);
        setselectedId(defaultSelectedId);
      }
    }, [defaultSelectedId]);

    // 有父节点时的左侧水平线条
    function fatherPath(node: CNode) {
      // 从左向右画
      const startX = node.x;
      const Y = node.y + BLOCK_HEIGHT / 2;
      const endX = node.x - (INDENT - 5);
      const lineEndX = endX + RADIUS;
      const curveEndY = Y - RADIUS;
      const M = `M ${startX} ${Y}`;
      const H = `H ${lineEndX}`;
      const Q = `Q ${endX} ${Y} ${endX} ${curveEndY}`;
      return `${M} ${H} ${Q}`;
    }

    // 有子节点时的下部纵线
    function childPath(node: CNode) {
      const M = `M ${node.x + 5} ${node.y + BLOCK_HEIGHT}`;
      const V = `V ${node.last_child_y + BLOCK_HEIGHT / 2 - RADIUS}`;
      return `${M} ${V}`;
    }

    // 根节点底部水平线
    function rootHpaht() {
      const M = `M ${secondStartX ? secondStartX + RADIUS : 0} ${ITEM_HEIGHT *
        1.5 -
        (ITEM_HEIGHT * 1.5 - BLOCK_HEIGHT) / 2}`;
      const H = `H ${secondEndX ? secondEndX - RADIUS : 0}`;
      return `${M} ${H}`;
    }

    // 根节点底部纵线
    function rootVpath(node: CNode) {
      const M = `M ${node.x + node.width / 2} ${node.y + BLOCK_HEIGHT}`;
      const V = `V ${ITEM_HEIGHT * 1.5 -
        (ITEM_HEIGHT * 1.5 - BLOCK_HEIGHT) / 2}`;
      return `${M} ${V}`;
    }

    // 第二层节点头部纵线（从下往上画）
    function rootBottomVpath(node: CNode) {
      const startX = node.x + node.width / 2;
      const startY = node.y;
      const endY = node.y - (ITEM_HEIGHT * 1.5 - BLOCK_HEIGHT) / 2;

      // 第二层的第一个节点
      if (node.x + node.width / 2 === secondStartX) {
        const lineEndY = endY + RADIUS;
        const curveEndX = startX + RADIUS;

        const M = `M ${startX} ${startY}`;
        const V = `V ${lineEndY}`;
        const Q = `Q ${startX} ${endY} ${curveEndX} ${endY}`;
        return `${M} ${V} ${Q}`;
      }
      // 第二层的最后一个节点
      if (node.x + node.width / 2 === secondEndX) {
        const lineEndY = endY + RADIUS;
        const curveEndX = startX - RADIUS;

        const M = `M ${startX} ${startY}`;
        const V = `V ${lineEndY}`;
        const Q = `Q ${startX} ${endY} ${curveEndX} ${endY}`;
        return `${M} ${V} ${Q}`;
      }
      const M = `M ${startX} ${startY}`;
      const V = `V ${endY}`;
      return `${M} ${V}`;
    }

    // 单击节点
    function clickNode(node: CNode) {
      if (disabled) {
        return;
      }
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
      if (disabled || node.disabled) {
        return;
      }
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
      if (disabled) {
        return;
      }
      e.stopPropagation();
      if (UNCONTROLLED) {
        let nodes = checkNode(nodeMap, node._key);
        setNodeMap(nodes);
      }
      if (handleCheck) {
        handleCheck(node);
      }
    }

    function clickAvatar(node: CNode, e: MouseEvent) {
      if (handleClickAvatar) {
        e.stopPropagation();
        handleClickAvatar(node);
      }
    }

    function clickStatus(node: CNode, e: MouseEvent) {
      if (handleClickStatus) {
        e.stopPropagation();
        handleClickStatus(node);
      }
    }

    // 节点改名
    function changeText(nodeId: string, text: string) {
      setshowInput(false);
      setshowNewInput(false);

      if (UNCONTROLLED) {
        let nodes = changeNodeText(nodeMap, nodeId, text);
        setNodeMap(nodes);
      }
      if (handleChangeNodeText) {
        handleChangeNodeText(nodeId, text);
      }
      if (containerRef && containerRef.current) {
        containerRef.current.focus();
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
      // setShowOptionsNode(null);
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
      // setShowOptionsNode(null);
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

    // 節點上移
    function shiftUp() {
      if (!selectedId) {
        return alert('请先选中节点！');
      }
      const res = changeSortList(nodeMap, selectedId, 'up');

      if (res) {
        if (UNCONTROLLED) {
          setNodeMap(res.nodes);
        } else {
          if (handleShiftUpDown) {
            handleShiftUpDown(selectedId, res.brotherKeys, 'up');
          }
        }
      }
    }

    // 節點下移
    function shiftDown() {
      if (!selectedId) {
        return alert('请先选中节点！');
      }
      const res = changeSortList(nodeMap, selectedId, 'down');
      if (res) {
        if (UNCONTROLLED) {
          setNodeMap(res.nodes);
        } else {
          if (handleShiftUpDown) {
            handleShiftUpDown(selectedId, res.brotherKeys, 'down');
          }
        }
      }
    }

    // 删除节点
    function deletenode() {
      if (!selectedId) {
        return alert('请先选中节点！');
      }

      const node = nodeMap[selectedId];
      if (node.disabled) {
        return;
      }
      if (selectedId === startId) {
        return alert('根节点不允许删除！');
      }

      // setShowOptionsNode(null);
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
      return { rootKey: startId, data: nodeMap };
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (disabled || disableShortcut || showInput || showNewInput) {
        return;
      }
      event.preventDefault();

      const commandKey = isMac ? event.metaKey : event.ctrlKey;

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
        case 'ArrowUp':
          if (event.shiftKey) {
            shiftUp();
          }
          break;
        case 'ArrowDown':
          if (event.shiftKey) {
            shiftDown();
          }
          break;
        // 複製
        case 'c':
          if (commandKey && selectedId) {
            setPasteNodeKey(selectedId);
            setPasteType('copy');
          }
          break;
        // 剪切
        case 'x':
          if (commandKey && selectedId) {
            // 根節點不允許剪切
            if (selectedId === startId) {
              setPasteNodeKey(null);
              setPasteType(null);
              return;
            }
            setPasteNodeKey(selectedId);
            setPasteType('cut');
          }
          break;
        // 粘貼
        case 'v':
          if (commandKey && pasteType && pasteNodeKey && selectedId) {
            if (UNCONTROLLED) {
              const res = pasteNode(
                nodeMap,
                pasteNodeKey,
                pasteType,
                selectedId
              );
              if (res) {
                setNodeMap(res);
              }
            } else if (handlePaste) {
              handlePaste(pasteNodeKey, pasteType, selectedId);
            }
            setPasteNodeKey(null);
            setPasteType(null);
          }
          break;
        default:
          break;
      }
    }

    // function clickOptionsButton(node: CNode) {
    //   clickNode(node);
    //   setShowOptionsNode(node);
    // }

    function clickMore(node: CNode) {
      if (handleClickMoreButton) {
        handleClickMoreButton(node);
      }
    }

    function clickPreview(node: CNode) {
      if (handleClickPreviewButton) {
        handleClickPreviewButton(node);
      }
    }

    function clickAdd(node: CNode) {
      if (handleClickAddButton) {
        handleClickAddButton(node);
      }
    }

    function clickDot(node: CNode) {
      if (handleClickDot) {
        handleClickDot(node);
      }
    }

    function handleDragStart(e: any) {
      if (disabled) {
        return;
      }
      if (selectedId && e.target.classList.contains('selected')) {
        e.stopPropagation();
        const node = nodeMap[selectedId];
        if (node.disabled) {
          return;
        }
        setDragStarted(true);
        setShowDragNode(true);
        setDragInfo({ targetNodeKey: selectedId, placement: 'in' });
        setClickX(e.clientX);
        setClickY(e.clientY);
        setMovedNodeX(0);
        setMovedNodeY(0);
      }
    }

    function handleMoveNode(e: React.MouseEvent) {
      if (dragStarted) {
        e.stopPropagation();
        let movedX = 0;
        let movedY = 0;
        movedX = e.clientX - clickX;
        movedY = e.clientY - clickY;

        setMovedNodeX(movedNodeX + movedX);
        setMovedNodeY(movedNodeY + movedY);

        setClickX(e.clientX);
        setClickY(e.clientY);
      }
    }

    function handleDragEnd(e: React.MouseEvent) {
      if (dragStarted && dragInfo && selectedId) {
        e.stopPropagation();
        setDragStarted(false);
        const selectedNode = nodeMap[selectedId];
        // 判斷拖拽是否無效
        if (
          // 拖拽對象為自己：無效
          dragInfo.targetNodeKey === selectedId ||
          // 拖動對象為拖動節點的父節點：無效
          (selectedNode &&
            selectedNode.father === dragInfo.targetNodeKey &&
            dragInfo.placement === 'in')
        ) {
          setDragInfo(null);
          // 動畫：移動到最初的選中節點
          const fps = 30;
          const animeTime = 500;
          const stepX = movedNodeX / fps;
          const stepY = movedNodeY / fps;
          const interval = setInterval(() => {
            setMovedNodeX(movedNodeX => movedNodeX - stepX);
            setMovedNodeY(movedNodeY => movedNodeY - stepY);
          }, Math.floor(animeTime / fps));

          setTimeout(() => {
            setShowDragNode(false);
            clearInterval(interval);
          }, animeTime);
        } else if (selectedNode) {
          setShowDragNode(false);
          if (UNCONTROLLED) {
            const res = dragSort(nodeMap, selectedId, dragInfo);
            if (res) {
              setNodeMap(res);
            }
          } else if (handleDrag) {
            handleDrag(dragInfo);
          }
        }
      }
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
        onMouseDown={handleDragStart}
        onMouseMove={handleMoveNode}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <svg
          className="tree-svg"
          viewBox={`0 0 ${maxEnd + 100} ${maxY + ITEM_HEIGHT}`}
          width={maxEnd + 100}
          height={maxY + ITEM_HEIGHT}
        >
          <defs>
            <filter id="filterShadow" x="0" y="0" width="200%" height="200%">
              <feOffset
                result="offOut"
                in="SourceAlpha"
                dx="2"
                dy="2"
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
            <g
              id="status-complete"
              width="22"
              height="22"
              viewBox="0,0,22,22"
              preserveAspectRatio="xMinYMin meet"
            >
              <path d="M0 0 H 11 L 22 11 V 22 H 0 Z" fill="#417505" />
              <path d="M 11 0 H 22 V 11 Z" fill="rgb(53, 166, 248)" />
            </g>
            <symbol
              id="preview"
              width="200"
              height="200"
              viewBox="0,0,1024,1024"
              preserveAspectRatio="xMinYMin meet"
            >
              <path
                d="M466 146c41.6 0 82.1 7.9 120.4 23.4 39.7 16.1 75.3 39.7 105.8 70.3 58.2 58.3 91.5 135.7 93.6 218 2.1 82-26.8 160.7-81.4 221.6l-11.9 13.3-13.3 11.9C620.7 757 544.9 786 465.9 786c-41.6 0-82.1-7.9-120.4-23.4-39.7-16.1-75.3-39.7-105.8-70.3-30.6-30.6-54.2-66.2-70.3-105.8-15.6-38.4-23.4-79-23.4-120.5 0-41.6 7.9-82.1 23.4-120.4 16.1-39.7 39.7-75.3 70.3-105.8 30.6-30.6 66.2-54.2 105.8-70.3C383.9 153.8 424.4 146 466 146m0-40c-92.1 0-184.3 35.1-254.6 105.4-140.6 140.6-140.6 368.5 0 509.1C281.7 790.8 373.8 826 465.9 826c85.9 0 171.8-30.6 240-91.7L889.8 918l28.3-28.3L734.3 706C861 564.7 856.4 347.3 720.5 211.4 650.2 141.1 558.1 106 466 106z"
                fill="inherit"
              ></path>
              <rect
                fillOpacity="0"
                x="0"
                y="0"
                width="1024"
                height="1024"
              ></rect>
            </symbol>
            <symbol id="add" viewBox="0 0 1024 1024" width="200" height="200">
              <path
                d="M543.978319 543.978319l352.427678 0c17.665335 0 31.975249-14.312984 31.975249-31.978319 0-17.665335-14.308891-31.978319-31.975249-31.978319L543.978319 480.021681l0-352.426655c0-17.665335-14.312984-31.975249-31.978319-31.975249-17.665335 0-31.978319 14.308891-31.978319 31.975249l0 352.426655-352.426655 0c-17.665335 0-31.975249 14.310937-31.975249 31.976272 0 8.833179 3.577478 16.829294 9.363252 22.615067 5.785773 5.785773 13.778818 9.365298 22.611997 9.365298l352.426655 0 0 352.426655c0 8.833179 3.578502 16.826224 9.364275 22.611997s13.781888 9.363252 22.615067 9.363252c17.665335 0 31.977295-14.308891 31.977295-31.975249L543.978319 543.978319z"
                fill="inherit"
              ></path>
              <rect
                fillOpacity="0"
                x="0"
                y="0"
                width="1024"
                height="1024"
              ></rect>
            </symbol>
            <symbol id="more" viewBox="0 0 1024 1024" width="200" height="200">
              <path
                d="M512 255.262708m-87.020936 0a85.039 85.039 0 1 0 174.041872 0 85.039 85.039 0 1 0-174.041872 0Z"
                fill="inherit"
              ></path>
              <path
                d="M512 511.792269m-87.020936 0a85.039 85.039 0 1 0 174.041872 0 85.039 85.039 0 1 0-174.041872 0Z"
                fill="inherit"
              ></path>
              <path
                d="M512 765.572206m-87.020936 0a85.039 85.039 0 1 0 174.041872 0 85.039 85.039 0 1 0-174.041872 0Z"
                fill="inherit"
              ></path>
              <rect
                fillOpacity="0"
                x="0"
                y="0"
                width="1024"
                height="1024"
              ></rect>
            </symbol>
          </defs>
          {cnodes.map(node => (
            <g key={node._key} className={`node-group-${node._key}`}>
              {isSingle ? (
                node.x && node.y ? (
                  <g className="multi-column">
                    {node._key !== startId ? (
                      <path
                        d={fatherPath(node)}
                        fill="none"
                        stroke="rgb(192,192,192)"
                        strokeWidth={PATH_WIDTH}
                      />
                    ) : null}
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
              <TreeNode
                node={node}
                ITEM_HEIGHT={ITEM_HEIGHT}
                BLOCK_HEIGHT={BLOCK_HEIGHT}
                FONT_SIZE={FONT_SIZE}
                startId={startId}
                alias={new Date().getTime()}
                selected={selectedId}
                showIcon={SHOW_ICON}
                showAvatar={SHOW_AVATAR}
                showPreviewButton={showPreviewButton || false}
                showAddButton={
                  disabled || node.disabled ? false : showAddButton || false
                }
                showMoreButton={showMoreButton || false}
                moreButtonWidth={moreButtonWidth}
                // openOptions={clickOptionsButton}
                // nodeOptionsOpened={
                //   showOptionsNode && node._key === showOptionsNode._key
                //     ? true
                //     : false
                // }
                handleClickDot={clickDot}
                handleCheck={check}
                handleClickAvatar={clickAvatar}
                handleClickStatus={clickStatus}
                handleClickNode={clickNode}
                handleDbClickNode={dbClickNode}
                clickPreview={clickPreview}
                clickAdd={clickAdd}
                clickMore={clickMore}
                setDragInfo={setDragInfo}
                dragStarted={dragStarted}
                dragEndFromOutside={dragEndFromOutside}
              />
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
          {/* 拖拽用節點 */}
          {showDragNode &&
          (Math.abs(movedNodeX) > 5 || Math.abs(movedNodeY) > 5) ? (
            <DragNode
              selectedId={selectedId}
              nodeList={cnodes}
              BLOCK_HEIGHT={BLOCK_HEIGHT}
              FONT_SIZE={FONT_SIZE}
              alias={new Date().getTime()}
              selected={selectedId}
              showIcon={SHOW_ICON}
              showAvatar={SHOW_AVATAR}
              movedNodeX={movedNodeX}
              movedNodeY={movedNodeY}
              dragInfo={dragInfo}
            />
          ) : null}
        </svg>

        {/* 節點名輸入框 */}
        {showInput || showNewInput ? (
          <NodeInput
            selectedId={selectedId}
            nodeList={cnodes}
            handleChangeNodeText={changeText}
            BLOCK_HEIGHT={BLOCK_HEIGHT}
          />
        ) : null}

        {/* 選項菜單 */}
        {/* {selectedId &&
        showOptionsNode &&
        nodeOptions &&
        selectedId === showOptionsNode._key ? (
          <NodeOptions
            node={showOptionsNode}
            content={nodeOptions}
            handleClose={() => setShowOptionsNode(null)}
          />
        ) : null} */}
      </div>
    );
  }
);
