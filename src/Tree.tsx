import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import NodeMap from './interfaces/NodeMap';
import Node from './interfaces/Node';
import CNode from './interfaces/CNode';
import DragInfo from './interfaces/DragInfo';
import TreeNode from './components/TreeNode';
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
  guid,
  changeSelect,
  getNodesInSelection,
  getValidSelectedNodes,
  isDragValid,
  isMutilDragValid,
  getNextSelect,
} from './services/util';
import MutilSelectedNodeKey from './interfaces/MutilSelectedNodeKey';

const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

interface PasteFunc {
  (
    pasteNodeKey: string,
    pasteType: 'copy' | 'cut' | null,
    targetNodeKey: string
  ): void;
}

interface MutiSelectFunc {
  (selectedNodes: Node[]): void;
}

interface NodeClickFunc {
  (node: CNode, targetEl: HTMLElement): void;
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
  fontWeight?: number;
  // 缩进
  indent?: number;
  // 列間距
  columnSpacing?: number;
  // 头像宽度
  avatarWidth?: number;
  checkBoxWidth?: number;
  pathWidth?: number;
  pathColor?: string;
  // 线条圆角半径
  lineRadius?: number;
  // 头像半径
  avatarRadius?: number;
  disableShortcut?: boolean;
  disabled?: boolean;
  showPreviewButton?: boolean;
  showAddButton?: boolean;
  showMoreButton?: boolean;
  moreButtonWidth?: number;
  // nodeOptions?: any;
  showIcon?: boolean;
  showAvatar?: boolean;
  hideHour?: boolean;
  // 根节点放大倍率
  root_zoom_ratio?: number;
  // 第二层节点放大倍率
  second_zoom_ratio?: number;
  // 背景色
  backgroundColor?: string;
  // 字体颜色
  color?: string;
  hoverBorderColor?: string;
  selectedBorderColor?: string;
  selectedBackgroundColor?: string;
  handleClickExpand?: Function;
  handleCheck?: Function;
  handleClickAvatar?: NodeClickFunc;
  handleClickStatus?: NodeClickFunc;
  handleClickNode?: Function;
  handleDbClickNode?: Function;
  handleChangeNodeText?: Function;
  handleAddNext?: Function;
  handleAddChild?: Function;
  handleDeleteNode?: Function;
  handleClickPreviewButton?: Function;
  handleClickAddButton?: NodeClickFunc;
  handleClickMoreButton?: NodeClickFunc;
  handleClickDot?: Function;
  handleShiftUpDown?: Function;
  handleDrag?: Function;
  handlePaste?: PasteFunc;
  dragEndFromOutside?: Function;
  handleMouseEnterAvatar?: Function;
  handleMouseLeaveAvatar?: Function;
  handleCrossCompDrag?: Function;
  handleChange?: Function;
  showDeleteConform?: Function;
  handleMutiSelect?: MutiSelectFunc;
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
      fontWeight,
      indent,
      columnSpacing,
      // avatarWidth,
      // checkBoxWidth,
      pathWidth,
      pathColor,
      lineRadius,
      avatarRadius = 11,
      disableShortcut,
      disabled,
      showPreviewButton,
      showAddButton,
      showMoreButton,
      moreButtonWidth,
      // nodeOptions,
      showIcon,
      showAvatar,
      hideHour,
      root_zoom_ratio,
      second_zoom_ratio,
      backgroundColor,
      color,
      hoverBorderColor,
      selectedBorderColor,
      selectedBackgroundColor,
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
      handleMouseEnterAvatar,
      handleMouseLeaveAvatar,
      handleCrossCompDrag,
      handleChange,
      showDeleteConform,
      handleMutiSelect,
    }: TreeProps,
    ref
  ) => {
    let clickTimeId: NodeJS.Timeout;
    const rootZoomRatio = root_zoom_ratio || 1.8;
    const secondZoomRatio = second_zoom_ratio || 1.4;
    // const ITEM_HEIGHT = itemHeight || 55;
    const ITEM_HEIGHT = itemHeight || 35;
    const BLOCK_HEIGHT = blockHeight || 30;
    const FONT_SIZE = fontSize || 14;
    const INDENT = indent || 25;
    const RADIUS = lineRadius || 4;
    // const AVATAR_WIDTH = avatarWidth || 22;
    // const CHECK_BOX_WIDTH = checkBoxWidth || 18;
    const PATH_WIDTH = pathWidth || 2;
    const PATH_COLOR = pathColor || '#535953';
    const UNCONTROLLED = uncontrolled === undefined ? true : uncontrolled;
    const SHOW_ICON = showIcon === undefined ? true : showIcon;
    const SHOW_AVATAR = showAvatar === undefined ? false : showAvatar;
    const BACKGROUND_COLOR = backgroundColor ? backgroundColor : 'unset';
    const COLOR = color || '#595959';
    const HOVER_BORDER_COLOR = hoverBorderColor || '#bed2fc';
    const SELECTED_BORDER_COLOR = selectedBorderColor || '#35a6f8';
    const SELECTED_BACKGROUND_COLOR = selectedBackgroundColor || '#e8e8e8';

    const [nodeMap, setNodeMap] = useState(nodes);
    const [secondStartX, setSecondStartX] = useState<number | undefined>(0);
    const [secondEndX, setSecondEndX] = useState<number | undefined>(0);
    const [cnodes, setcnodes] = useState<CNode[]>([]);
    // const [maxX, setmaxX] = useState(0);
    const [maxY, setmaxY] = useState(0);
    const [maxEnd, setmaxEnd] = useState(0);
    const [selectedId, setselectedId] = useState<string | null>(null);
    const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
    const [showInput, setshowInput] = useState(false);
    const [showNewInput, setshowNewInput] = useState(false);
    const [isSingle, setisSingle] = useState(singleColumn);
    // const [showOptionsNode, setShowOptionsNode] = useState<CNode | null>(null);

    // 拖拽節點相關的狀態
    const [dragStarted, setDragStarted] = useState(false);
    const [frameSelectionStarted, setFrameSelectionStarted] = useState(false);
    const [selectionX, setselectionX] = useState(0);
    const [selectionY, setselectionY] = useState(0);
    const [selectionWidth, setselectionWidth] = useState(0);
    const [selectionHeight, setselectionHeight] = useState(0);
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

    const [compId, setCompId] = useState('');
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
        }
      },
      renameById: function(id: string, text: string) {
        changeText(id, text);
      },
      getSelectedId: function() {
        return selectedId;
      },
      // closeOptions: function() {
      //   setShowOptionsNode(null);
      // },
    }));

    useEffect(() => {
      setCompId(guid(8, 16));
    }, []);

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
        BLOCK_HEIGHT,
        INDENT,
        FONT_SIZE,
        SHOW_ICON,
        SHOW_AVATAR,
        avatarRadius,
        rootZoomRatio,
        secondZoomRatio,
        85,
        55,
        columnSpacing,
        undefined,
        undefined,
        showInput && selectedId ? selectedId : undefined
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
    }, [nodeMap, startId, singleColumn, showInput]);

    useEffect(() => {
      if (defaultSelectedId) {
        // setShowOptionsNode(null);
        setselectedId(defaultSelectedId);
        setSelectedNodes([]);
      }
    }, [defaultSelectedId]);

    useEffect(() => {
      if (handleMutiSelect) {
        handleMutiSelect(selectedNodes);
      }
    }, [selectedNodes]);

    // 有父节点时的左侧水平线条
    function fatherPath(node: CNode) {
      // 从左向右画
      const startX = node.x;
      const blockHeight =
        node._key === startId
          ? BLOCK_HEIGHT * rootZoomRatio
          : node.father === startId
          ? BLOCK_HEIGHT * secondZoomRatio
          : BLOCK_HEIGHT;
      const Y = node.y + blockHeight / 2;
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
      const blockHeight =
        node._key === startId
          ? BLOCK_HEIGHT * rootZoomRatio
          : node.father === startId
          ? BLOCK_HEIGHT * secondZoomRatio
          : BLOCK_HEIGHT;
      const childBlockHeight =
        node._key === startId ? BLOCK_HEIGHT * secondZoomRatio : BLOCK_HEIGHT;
      const M = `M ${node.x + 5} ${node.y + blockHeight}`;
      const V = `V ${node.last_child_y + childBlockHeight / 2 - RADIUS}`;
      return `${M} ${V}`;
    }

    // 根节点底部水平线
    function rootHpaht(y: number) {
      const diffY =
        ITEM_HEIGHT - BLOCK_HEIGHT * rootZoomRatio > 40
          ? ITEM_HEIGHT
          : BLOCK_HEIGHT * rootZoomRatio + 40;
      const itemY = y + diffY;
      const blockY = y + BLOCK_HEIGHT * rootZoomRatio;
      const middleY = itemY - (itemY - blockY) / 2;
      const M = `M ${secondStartX ? secondStartX + RADIUS : 0} ${middleY}`;
      const H = `H ${secondEndX ? secondEndX - RADIUS : 0}`;
      return `${M} ${H}`;
    }

    // 根节点底部纵线
    function rootVpath(node: CNode) {
      const diffY =
        ITEM_HEIGHT - BLOCK_HEIGHT * rootZoomRatio > 40
          ? ITEM_HEIGHT
          : BLOCK_HEIGHT * rootZoomRatio + 40;
      const itemY = node.y + diffY;
      const blockY = node.y + BLOCK_HEIGHT * rootZoomRatio;
      const middleY = itemY - (itemY - blockY) / 2;

      const M = `M ${node.x + node.width / 2} ${blockY}`;
      const V = `V ${middleY}`;
      return `${M} ${V}`;
    }

    // 第二层节点头部纵线（从下往上画）
    function rootBottomVpath(node: CNode) {
      const diffY =
        ITEM_HEIGHT - BLOCK_HEIGHT * rootZoomRatio > 40
          ? ITEM_HEIGHT
          : BLOCK_HEIGHT * rootZoomRatio + 40;

      const startX = node.x + node.width / 2;
      const startY = node.y;
      const endY = node.y - (diffY - BLOCK_HEIGHT * rootZoomRatio) / 2;

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

    function handleSelectedNodeChanged(node: Node) {
      setselectedId(node._key);
      setSelectedNodes([]);
      if (handleClickNode) {
        handleClickNode(node);
      }
    }

    // 单击节点
    function clickNode(node: CNode) {
      if (disabled) {
        return;
      }
      clearTimeout(clickTimeId);
      clickTimeId = setTimeout(function() {
        setselectedId(node._key);
        setSelectedNodes([]);
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
      setSelectedNodes([]);
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
        if (handleChange) {
          handleChange();
        }
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
        if (handleChange) {
          handleChange();
        }
      }
      if (handleCheck) {
        handleCheck(node);
      }
    }

    function clickAvatar(
      node: CNode,
      event: React.MouseEvent<HTMLButtonElement>
    ) {
      if (handleClickAvatar) {
        event.stopPropagation();
        handleClickAvatar(node, event.currentTarget);
      }
    }

    function clickStatus(
      node: CNode,
      event: React.MouseEvent<HTMLButtonElement>
    ) {
      if (handleClickStatus) {
        event.stopPropagation();
        handleClickStatus(node, event.currentTarget);
      }
    }

    // 节点改名
    function changeText(nodeId: string, text: string) {
      setshowInput(false);
      setshowNewInput(false);

      if (UNCONTROLLED) {
        let nodes = changeNodeText(nodeMap, nodeId, text);
        setNodeMap(nodes);
        if (handleChange) {
          handleChange();
        }
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
        return;
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
        setSelectedNodes([]);
        setNodeMap(res.nodes);
        setshowInput(true);
        if (handleChange) {
          handleChange();
        }
      } else {
        if (handleAddNext) {
          handleAddNext(selectedId);
        }
      }
    }

    // 添加子节点
    function addChild() {
      if (!selectedId) {
        return;
      }
      // setShowOptionsNode(null);
      if (UNCONTROLLED) {
        const res = addChildNode(nodeMap, selectedId);
        if (handleAddChild) {
          handleAddChild(selectedId, res.addedNode);
        }
        setselectedId(res.addedNode._key);
        setSelectedNodes([]);
        setNodeMap(res.nodes);
        setshowInput(true);
        if (handleChange) {
          handleChange();
        }
      } else {
        if (handleAddChild) {
          handleAddChild(selectedId);
        }
      }
    }

    // 節點上移
    function shiftUp() {
      if (!selectedId) {
        return;
      }
      const res = changeSortList(nodeMap, selectedId, 'up');

      if (res) {
        if (UNCONTROLLED) {
          setNodeMap(res.nodes);
          if (handleChange) {
            handleChange();
          }
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
        return;
      }
      const res = changeSortList(nodeMap, selectedId, 'down');
      if (res) {
        if (UNCONTROLLED) {
          setNodeMap(res.nodes);
          if (handleChange) {
            handleChange();
          }
        } else {
          if (handleShiftUpDown) {
            handleShiftUpDown(selectedId, res.brotherKeys, 'down');
          }
        }
      }
    }

    // 删除节点
    function deletenode() {
      if (!selectedId && !selectedNodes.length) {
        return;
      }
      if (UNCONTROLLED) {
        // 删除单个节点
        if (!selectedNodes.length && selectedId) {
          const node = nodeMap[selectedId];
          if (node.disabled) {
            return;
          }
          if (selectedId === startId) {
            return alert('根节点不允许删除！');
          }
          const nextSelectId = getNextSelect(node, nodeMap);
          if (nextSelectId) {
            setselectedId(nextSelectId);
          } else {
            setselectedId(null);
          }
          let nodes = deleteNode(nodeMap, selectedId);
          setSelectedNodes([]);
          setNodeMap(nodes);
          if (handleChange) {
            handleChange();
          }
        } else {
          // 批量删除
          let nodes = nodeMap;
          for (let index = 0; index < selectedNodes.length; index++) {
            const element = selectedNodes[index];
            if (element._key !== startId) {
              nodes = deleteNode(nodes, element._key);
            }
          }
          setSelectedNodes([]);
          setNodeMap(nodes);
          if (handleChange) {
            handleChange();
          }
        }

        if (handleDeleteNode) {
          handleDeleteNode(selectedId, selectedNodes);
        }
      } else {
        if (handleDeleteNode) {
          handleDeleteNode(selectedId, selectedNodes);
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
        case 'Backspace': {
          if (showDeleteConform) {
            const node = selectedId ? nodeMap[selectedId] : null;
            if ((node && node.sortList.length) || selectedNodes.length > 1) {
              showDeleteConform();
            } else {
              deletenode();
            }
          } else {
            deletenode();
          }
          break;
        }
        case 'ArrowUp':
          if (event.shiftKey) {
            shiftUp();
          } else if (selectedId) {
            const res = changeSelect(selectedId, cnodes, event.key);
            if (res) {
              handleSelectedNodeChanged(res);
            }
          }
          break;
        case 'ArrowDown':
          if (event.shiftKey) {
            shiftDown();
          } else if (selectedId) {
            const res = changeSelect(selectedId, cnodes, event.key);
            if (res) {
              handleSelectedNodeChanged(res);
            }
          }
          break;
        case 'ArrowRight':
        case 'ArrowLeft': {
          if (selectedId) {
            const res = changeSelect(selectedId, cnodes, event.key);
            if (res) {
              handleSelectedNodeChanged(res);
            }
          }
          break;
        }
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
                if (handleChange) {
                  handleChange();
                }
              }
            } else if (handlePaste) {
              handlePaste(pasteNodeKey, pasteType, selectedId);
            }
            setPasteNodeKey(null);
            setPasteType(null);
          }
          break;
        default: {
          if (
            selectedId &&
            !showInput &&
            event.key.length === 1 &&
            /[a-zA-Z]+/.test(event.key)
          ) {
            if (UNCONTROLLED) {
              let nodes = changeNodeText(nodeMap, selectedId, '');
              setNodeMap(nodes);
              if (handleChange) {
                handleChange();
              }
            }
            if (handleChangeNodeText) {
              handleChangeNodeText(selectedId, '');
            }
            setshowInput(true);
          }
          break;
        }
      }
    }

    // function clickOptionsButton(node: CNode) {
    //   clickNode(node);
    //   setShowOptionsNode(node);
    // }

    function clickMore(
      node: CNode,
      event: React.MouseEvent<HTMLButtonElement>
    ) {
      if (handleClickMoreButton) {
        const selectedKeys = selectedNodes.map(item => item._key);
        if (selectedKeys.length && selectedKeys.includes(node._key)) {
          event.stopPropagation();
        }
        handleClickMoreButton(node, event.currentTarget);
      }
    }

    function clickPreview(node: CNode) {
      if (handleClickPreviewButton) {
        handleClickPreviewButton(node);
      }
    }

    function clickAdd(node: CNode, event: React.MouseEvent<HTMLButtonElement>) {
      if (handleClickAddButton) {
        handleClickAddButton(node, event.currentTarget);
      }
    }

    function clickDot(node: CNode) {
      if (handleClickDot) {
        handleClickDot(node);
      }
    }

    function handleFrameSelectionStart(e: React.MouseEvent) {
      if (e.nativeEvent.which === 1) {
        e.stopPropagation();
        setFrameSelectionStarted(true);
        setClickX(e.nativeEvent.offsetX);
        setClickY(e.nativeEvent.offsetY);
        setselectionX(e.nativeEvent.offsetX);
        setselectionY(e.nativeEvent.offsetY);
      }
    }

    function handleFrameSelectionEnd() {
      if (frameSelectionStarted) {
        const selectionNodes = getNodesInSelection(
          selectionX,
          selectionY,
          selectionWidth,
          selectionHeight,
          BLOCK_HEIGHT,
          cnodes
        );
        setselectedId(null);
        if (handleClickNode) {
          handleClickNode(null);
        }
        setSelectedNodes(selectionNodes);
        setFrameSelectionStarted(false);
        setselectionWidth(0);
        setselectionHeight(0);
      }
    }

    function handleDragStart(
      node: CNode,
      dragStartX: number,
      dragStartY: number
    ) {
      if (disabled || node.disabled) {
        return;
      }

      // 如果框选了多个节点，而拖拽的节点不在其中的话，则取消框选
      if (selectedNodes.length) {
        const index = selectedNodes.findIndex(
          element => node._key === element._key
        );
        if (index === -1) {
          setSelectedNodes([]);
        }
      }

      sessionStorage.setItem('cross-comp-drag', node._key);
      sessionStorage.setItem('cross-drag-compId', compId);

      setDragStarted(true);
      setShowDragNode(true);
      setDragInfo({
        dragNodeId: node._key,
        dropNodeId: node._key,
        placement: 'in',
      });
      setClickX(dragStartX);
      setClickY(dragStartY);
      setMovedNodeX(0);
      setMovedNodeY(0);
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
      if (frameSelectionStarted) {
        e.stopPropagation();
        let movedX = 0;
        let movedY = 0;
        movedX = e.nativeEvent.offsetX - clickX;
        movedY = e.nativeEvent.offsetY - clickY;
        setselectionWidth(Math.abs(movedX));
        setselectionHeight(Math.abs(movedY));
        if (movedX >= 0 && movedY >= 0) {
          setselectionX(clickX);
          setselectionY(clickY);
        } else if (movedX < 0 || movedY < 0) {
          setselectionX(clickX + (movedX < 0 ? movedX : 0));
          setselectionY(clickY + (movedY < 0 ? movedY : 0));
        }
        const selectionNodes = getNodesInSelection(
          selectionX,
          selectionY,
          selectionWidth,
          selectionHeight,
          BLOCK_HEIGHT,
          cnodes
        );
        setselectedId(null);
        setSelectedNodes(selectionNodes);
      }
    }

    function handleDragEnd(e: React.MouseEvent) {
      if (
        dragStarted &&
        dragInfo &&
        dragInfo.dragNodeId &&
        dragInfo.dropNodeId
      ) {
        e.stopPropagation();
        setDragStarted(false);
        const selectedNode = nodeMap[dragInfo.dragNodeId];

        const dragValid = isDragValid(
          dragInfo.dragNodeId,
          dragInfo.dropNodeId,
          nodeMap
        );

        let dragValid2 = true;
        let validSelectedNodes: MutilSelectedNodeKey[] = [];
        if (selectedNodes.length > 1) {
          validSelectedNodes = getValidSelectedNodes(selectedNodes, nodeMap);
          dragValid2 = isMutilDragValid(
            validSelectedNodes,
            dragInfo.dropNodeId,
            nodeMap
          );
        }

        // 判斷拖拽是否無效
        if (!dragValid || !dragValid2) {
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
            if (validSelectedNodes.length > 1) {
              for (let index = 0; index < validSelectedNodes.length; index++) {
                const dragId = validSelectedNodes[index].nodeKey;
                const res = dragSort(
                  nodeMap,
                  dragId,
                  dragInfo.dropNodeId,
                  dragInfo.placement
                );
                if (res) {
                  setNodeMap(res);
                  if (handleChange) {
                    handleChange();
                  }
                }
              }
            } else {
              const res = dragSort(
                nodeMap,
                dragInfo.dragNodeId,
                dragInfo.dropNodeId,
                dragInfo.placement
              );
              if (res) {
                setNodeMap(res);
                if (handleChange) {
                  handleChange();
                }
              }
            }
          } else if (handleDrag) {
            handleDrag(dragInfo, validSelectedNodes);
          }

          // 跨组件拖拽
          if (validSelectedNodes.length <= 1) {
            const crossCompDragId = sessionStorage.getItem('cross-comp-drag');
            const crossCompDropId = sessionStorage.getItem('cross-comp-drop');
            const crossDragCompId = sessionStorage.getItem('cross-drag-compId');
            if (
              crossCompDragId &&
              handleCrossCompDrag &&
              crossDragCompId !== compId
            ) {
              handleCrossCompDrag(crossCompDragId, crossCompDropId);
            }
          }
        }
        sessionStorage.removeItem('cross-comp-drag');
        sessionStorage.removeItem('cross-comp-drop');
        sessionStorage.removeItem('cross-drag-compId');
      }
      handleFrameSelectionEnd();
    }

    function handleDragLeave() {
      setDragStarted(false);
      setDragInfo(null);
      setShowDragNode(false);
      handleFrameSelectionEnd();
    }

    function updateDragInfo(param: DragInfo) {
      if (dragInfo) {
        setDragInfo({ ...dragInfo, ...param });
      } else {
        setDragInfo(param);
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
        onMouseDown={handleFrameSelectionStart}
        onMouseMove={handleMoveNode}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragLeave}
      >
        <svg
          className="tree-svg"
          viewBox={`0 0 ${maxEnd + 100} ${maxY + ITEM_HEIGHT}`}
          width={maxEnd + 100}
          height={maxY + ITEM_HEIGHT}
          style={{ backgroundColor: BACKGROUND_COLOR }}
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
              <path d="M0 0 L 22 22 H 0 Z" fill="rgb(85, 85, 85)" />
              <path d="M 0 0 H 22 V 22 Z" fill="rgb(53, 166, 248)" />
            </g>
            <g
              id="status-overdue"
              width="22"
              height="22"
              viewBox="0,0,22,22"
              preserveAspectRatio="xMinYMin meet"
            >
              <path d="M0 0 L 22 22 H 0 Z" fill="rgb(221, 53, 53)" />
              <path d="M 0 0 H 22 V 22 Z" fill="rgb(53, 166, 248)" />
            </g>
            <g
              id="status-complete"
              width="22"
              height="22"
              viewBox="0,0,22,22"
              preserveAspectRatio="xMinYMin meet"
            >
              <path d="M0 0 L 22 22 H 0 Z" fill="#b6b7b7" />
              <path d="M 0 0 H 22 V 22 Z" fill="rgb(53, 166, 248)" />
            </g>

            <g
              id="status-onlyday"
              width="22"
              height="22"
              viewBox="0,0,22,22"
              preserveAspectRatio="xMinYMin meet"
            >
              <rect
                x="0"
                y="0"
                width="22"
                height="22"
                fill="rgb(85, 85, 85)"
              ></rect>
            </g>
            <g
              id="status-onlyday-overdue"
              width="22"
              height="22"
              viewBox="0,0,22,22"
              preserveAspectRatio="xMinYMin meet"
            >
              <rect
                x="0"
                y="0"
                width="22"
                height="22"
                fill="rgb(221, 53, 53)"
              ></rect>
            </g>
            <g
              id="status-onlyday-complete"
              width="22"
              height="22"
              viewBox="0,0,22,22"
              preserveAspectRatio="xMinYMin meet"
            >
              <rect x="0" y="0" width="22" height="22" fill="#417505"></rect>
            </g>
            <symbol
              id="favorite"
              width="200"
              height="200"
              viewBox="0,0,1024,1024"
              preserveAspectRatio="xMinYMin meet"
            >
              <path
                d="M512 909.994667l-61.994667-56.021333q-105.984-96-153.984-141.994667t-107.008-114.005333-80.981333-123.008-22.016-112.981333q0-98.005333 66.986667-166.016t166.997333-68.010667q116.010667 0 192 89.984 75.989333-89.984 192-89.984 100.010667 0 166.997333 68.010667t66.986667 166.016q0 77.994667-52.010667 162.005333t-112.981333 146.005333-198.997333 185.984z"
                fill="#FF4500"
              ></path>
            </symbol>
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
          {cnodes.map((node, index) => (
            <g
              key={`${index}_${node._key}`}
              className={`node-group-${node._key}`}
            >
              {isSingle ? (
                node.x && node.y ? (
                  <g className="multi-column">
                    {node._key !== startId ? (
                      <path
                        d={fatherPath(node)}
                        fill="none"
                        stroke={PATH_COLOR}
                        strokeWidth={PATH_WIDTH}
                      />
                    ) : null}
                    {node.sortList && node.sortList.length && !node.contract ? (
                      <path
                        d={childPath(node)}
                        fill="none"
                        stroke={PATH_COLOR}
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
                      stroke={PATH_COLOR}
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
                      stroke={PATH_COLOR}
                      strokeWidth={PATH_WIDTH}
                    />
                  ) : null}

                  {/* 根节点底部线条 */}
                  {node._key === startId &&
                  node.sortList &&
                  node.sortList.length &&
                  !node.contract ? (
                    <path
                      d={rootHpaht(node.y)}
                      fill="none"
                      stroke={PATH_COLOR}
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
                      stroke={PATH_COLOR}
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
                      stroke={PATH_COLOR}
                      strokeWidth={PATH_WIDTH}
                    />
                  ) : null}
                </g>
              )}
              <TreeNode
                node={node}
                BLOCK_HEIGHT={
                  node._key === startId
                    ? BLOCK_HEIGHT * rootZoomRatio
                    : node.father === startId
                    ? BLOCK_HEIGHT * secondZoomRatio
                    : BLOCK_HEIGHT
                }
                FONT_SIZE={
                  node._key === startId
                    ? FONT_SIZE * rootZoomRatio
                    : node.father === startId
                    ? FONT_SIZE * secondZoomRatio
                    : FONT_SIZE
                }
                avatarRadius={avatarRadius}
                color={COLOR}
                startId={startId}
                alias={new Date().getTime()}
                selected={selectedId}
                selectedNodes={selectedNodes}
                singleColumn={singleColumn}
                pasteNodeKey={pasteType === 'cut' ? pasteNodeKey : null}
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
                handleExpand={handleExpand}
                handleCheck={check}
                handleClickAvatar={clickAvatar}
                handleClickStatus={clickStatus}
                handleClickNode={clickNode}
                handleDbClickNode={dbClickNode}
                clickPreview={clickPreview}
                clickAdd={clickAdd}
                clickMore={clickMore}
                updateDragInfo={updateDragInfo}
                dragStarted={dragStarted}
                handleDragStart={handleDragStart}
                dragEndFromOutside={dragEndFromOutside}
                mouseEnterAvatar={(node: CNode) => {
                  if (handleMouseEnterAvatar) handleMouseEnterAvatar(node);
                }}
                mouseLeaveAvatar={(node: CNode) => {
                  if (handleMouseLeaveAvatar) handleMouseLeaveAvatar(node);
                }}
                hideHour={hideHour}
                fontWeight={fontWeight}
                dotColor={PATH_COLOR}
                hoverBorderColor={HOVER_BORDER_COLOR}
                selectedBorderColor={SELECTED_BORDER_COLOR}
                selectedBackgroundColor={SELECTED_BACKGROUND_COLOR}
              />
            </g>
          ))}
          {/* 拖拽用節點 */}
          {showDragNode &&
          (Math.abs(movedNodeX) > 5 || Math.abs(movedNodeY) > 5) ? (
            <DragNode
              nodeList={cnodes}
              BLOCK_HEIGHT={BLOCK_HEIGHT}
              FONT_SIZE={FONT_SIZE}
              alias={new Date().getTime()}
              showIcon={SHOW_ICON}
              showAvatar={SHOW_AVATAR}
              avatarRadius={avatarRadius}
              movedNodeX={movedNodeX}
              movedNodeY={movedNodeY}
              dragInfo={dragInfo}
              mutilMode={selectedNodes.length > 1 ? true : false}
            />
          ) : null}
          {frameSelectionStarted ? (
            <rect
              x={selectionX}
              y={selectionY}
              width={selectionWidth}
              height={selectionHeight}
              fill="#35a6f8"
              fillOpacity={0.2}
              stroke="#35a6f8"
            ></rect>
          ) : null}
        </svg>

        {/* 節點名輸入框 */}
        {showInput || showNewInput ? (
          <NodeInput
            selectedId={selectedId}
            nodeList={cnodes}
            handleChangeNodeText={changeText}
            BLOCK_HEIGHT={
              selectedId === startId
                ? BLOCK_HEIGHT * rootZoomRatio
                : nodeMap &&
                  selectedId &&
                  nodeMap[selectedId].father === startId
                ? BLOCK_HEIGHT * secondZoomRatio
                : BLOCK_HEIGHT
            }
            FONT_SIZE={
              selectedId === startId
                ? FONT_SIZE * rootZoomRatio
                : nodeMap &&
                  selectedId &&
                  nodeMap[selectedId].father === startId
                ? FONT_SIZE * secondZoomRatio
                : FONT_SIZE
            }
            avatarRadius={avatarRadius}
            showIcon={SHOW_ICON}
            showAvatar={SHOW_AVATAR}
            startId={startId}
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
