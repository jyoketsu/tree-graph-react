import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import NodeMap from './interfaces/NodeMap';
import Node from './interfaces/Node';
import CNode from './interfaces/CNode';
import DragInfo from './interfaces/DragInfo';
import TreeNode from './components/TreeNode';
import NodeInput from './components/NodeInput';
// import NodeOptions from './components/NodeOptions';
import DragNode from './components/DragNode';
import calculate from './services/mindService';
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
  changeMindSelect,
  getNodesInSelection,
  isDragValid,
  getValidSelectedNodes,
  isMutilDragValid,
  getNextSelect,
  updateNodeByKey,
  countNodeDescendants,
  copyNode,
  getImgData,
  download,
  createObjectUrl,
  downloadSvgAsPng,
  downloadSvgAsPdf,
} from './services/util';
import MutilSelectedNodeKey from './interfaces/MutilSelectedNodeKey';
import { HandleFileChange } from './Tree';
import _ from 'lodash';

const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

let spaceKeyDown = false;

// 拖拽节流
let lastTime = 0;
const gapTime = 34;

let changed = false;

interface PasteFunc {
  (
    pasteNodeKey: string,
    pasteType: string | null,
    targetNodeKey: string,
    event: ClipboardEvent
  ): void;
}

interface MutiSelectFunc {
  (selectedNodes: Node[]): void;
}

interface NodeClickFunc {
  (node: CNode, targetEl: HTMLElement): void;
}
interface StatusClickFunc {
  (node: CNode, targetEl: HTMLElement, event: React.MouseEvent): void;
}

interface HandleQuickCommandOpen {
  (nodeEl: HTMLElement): void;
}

interface HandlePasteText {
  (text: string, event: ClipboardEvent): void;
}

export interface MindProps {
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
  rowGap?: number;
  // 节点文字上下边距
  topBottomMargin?: number;
  // 节点文字行高
  lineHeight?: number;
  textMaxWidth?: number;
  // 节点字体大小
  fontSize?: number;
  // 缩进
  indent?: number;
  // 头像宽度
  avatarWidth?: number;
  checkBoxWidth?: number;
  pathWidth?: number;
  pathColor?: string;
  nodeColor?: string;
  // 头像半径
  avatarRadius?: number;
  disableShortcut?: boolean;
  disabled?: boolean;
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
  quickCommandKey?: string;
  paddingLeft?: number;
  paddingTop?: number;
  rainbowColor?: boolean;
  startNodeBg?: string;
  customAdornment?: React.FC<{
    x: number;
    y: number;
    height: number;
    nodeKey: string;
  }>;
  handleClickExpand?: Function;
  handleCheck?: Function;
  handleClickAvatar?: NodeClickFunc;
  handleClickStatus?: StatusClickFunc;
  handleClickNode?: Function;
  handleDbClickNode?: Function;
  handleChangeNodeText?: Function;
  handleAddNext?: Function;
  handleAddChild?: Function;
  handleDeleteNode?: Function;
  handleClickPreviewButton?: Function;
  handleClickDot?: Function;
  handleShiftUpDown?: Function;
  handleDrag?: Function;
  handlePaste?: PasteFunc;
  dragEndFromOutside?: (node: CNode, dataTransferText: string) => void;
  handleMouseEnterAvatar?: Function;
  handleMouseLeaveAvatar?: Function;
  handleCrossCompDrag?: Function;
  handleChange?: Function;
  showDeleteConform?: Function;
  handleMutiSelect?: MutiSelectFunc;
  handleFileChange?: HandleFileChange;
  handleQuickCommandOpen?: HandleQuickCommandOpen;
  handlePasteText?: HandlePasteText;
  handleContextMenu?: (nodeKey: string, event: React.MouseEvent) => void;
  handleClickNodeImage?: (url?: string) => void;
  handleResizeNodeImage?: (nodeKey: string, nodeWidth: number) => void;
  ref?: any;
}

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
export const Mind = React.forwardRef(
  (
    {
      nodes,
      startId,
      defaultSelectedId,
      uncontrolled,
      singleColumn,
      rowGap = 12,
      topBottomMargin = 5,
      lineHeight = 20,
      textMaxWidth = 300,
      fontSize,
      indent,
      pathWidth,
      pathColor,
      nodeColor = '#f0f0f0',
      avatarRadius = 11,
      disableShortcut,
      disabled,
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
      quickCommandKey,
      paddingLeft = 50,
      paddingTop = 50,
      rainbowColor,
      startNodeBg = '#CB1B45',
      customAdornment,
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
      handleFileChange,
      handleQuickCommandOpen,
      handlePasteText,
      handleContextMenu,
      handleClickNodeImage,
      handleResizeNodeImage,
    }: MindProps,
    ref
  ) => {
    let clickTimeId: NodeJS.Timeout;
    const radius = 8;
    const rootZoomRatio = root_zoom_ratio || 1.8;
    const secondZoomRatio = second_zoom_ratio || 1.4;
    const FONT_SIZE = fontSize || 14;
    const INDENT = indent || 35;
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
    const [cnodes, setcnodes] = useState<CNode[]>([]);
    // const [maxX, setmaxX] = useState(0);
    const [maxY, setmaxY] = useState(0);
    const [maxEnd, setmaxEnd] = useState(0);
    const [selectedId, setselectedId] = useState<string | null>(null);
    const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
    const [showInput, setshowInput] = useState(false);
    const [showNewInput, setshowNewInput] = useState(false);
    const [inputEmpty, setInputEmpty] = useState(false);

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
    const [compId, setCompId] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const block_height = topBottomMargin * 2 + lineHeight;

    const [startExport, setStartExport] = useState<'' | 'svg' | 'png' | 'pdf'>(
      ''
    );

    // 暴露方法
    useImperativeHandle(ref, () => ({
      deleteNode: deletenode,
      saveNodes,
      addNext,
      addChild,
      updateNodeById,
      updateNodesByIds,
      rename: function () {
        if (selectedId) {
          setshowInput(true);
        }
      },
      renameById: function (id: string, text: string) {
        changeText(id, text);
      },
      getSelectedId: function () {
        return selectedId;
      },
      getSelectedIds: function () {
        let ids = [];
        for (let index = 0; index < selectedNodes.length; index++) {
          const node = selectedNodes[index];
          ids.push(node._key);
        }
        return ids;
      },
      setselectedId: (id: string) => setselectedId(id),
      setSelectedNodes: (nodes: Node[]) => setSelectedNodes(nodes),
      exportImage: (type: 'svg' | 'png' | 'pdf') => {
        window.postMessage({ name: 'export-status', message: 'start' }, '/');
        setStartExport(type);
      },
    }));

    const downloadImage = useCallback(async () => {
      if (startExport) {
        const name = nodeMap[startId].name;
        let svg = document.getElementsByClassName('tree-svg')[0].outerHTML;
        const imageHrefRegex = /<image\s[^>]*href="([^"]*)"/g;
        const imageMatches = svg.match(imageHrefRegex);
        if (imageMatches) {
          const hrefRegex = /href="([^"]+)"/;
          for (let index = 0; index < imageMatches.length; index++) {
            const match = imageMatches[index].toString();
            const matches = match.match(hrefRegex);
            if (matches) {
              const href = matches[1];
              const base64 = await getImgData(href);
              if (base64) {
                svg = svg.replace(href, base64 as string);
              }
            }
          }
        }

        if (startExport === 'svg') {
          download(createObjectUrl([svg], 'image/svg'), `${name}.svg`);
        }
        if (startExport === 'png') {
          await downloadSvgAsPng(svg, maxEnd + 100, maxY, name);
        }
        if (startExport === 'pdf') {
          await downloadSvgAsPdf(svg, maxEnd + 100, maxY, name);
        }
        setStartExport('');
        window.postMessage({ name: 'export-status', message: 'end' }, '/');
      }
    }, [cnodes]);

    useEffect(() => {
      downloadImage();
    }, [cnodes]);

    useEffect(() => {
      setCompId(guid(8, 16));
    }, []);

    useEffect(() => {
      if (changed) {
        if (handleChange) {
          changed = false;
          handleChange();
        }
      }
    }, [nodeMap]);

    useEffect(() => {
      document.addEventListener('paste', onPaste);

      return () => {
        document.removeEventListener('paste', onPaste);
      };
    }, [showInput, showNewInput, selectedId]);

    // 参数nodes发生改变，重设nodeMap
    useEffect(() => {
      setNodeMap(nodes);
    }, [nodes]);

    // nodeMap发生改变，根据nodeMap计算渲染所需数据
    useEffect(() => {
      console.log('根据nodeMap计算渲染所需数据');
      if (!nodeMap[startId]) {
        return;
      }
      const cal = calculate(
        nodeMap,
        startId,
        singleColumn,
        rowGap,
        topBottomMargin,
        lineHeight,
        INDENT,
        FONT_SIZE,
        textMaxWidth,
        SHOW_ICON,
        SHOW_AVATAR,
        avatarRadius,
        rootZoomRatio,
        secondZoomRatio,
        startExport ? 50 : paddingLeft,
        startExport ? 50 : paddingTop,
        undefined,
        rainbowColor
      );

      if (cal) {
        setcnodes(cal.nodes);
        setmaxY(cal.max_y);
        setmaxEnd(cal.max_end);
      }
    }, [nodeMap, startId, singleColumn, showInput, rainbowColor, startExport]);

    useEffect(() => {
      if (defaultSelectedId) {
        setselectedId(defaultSelectedId);
        setSelectedNodes([]);
      }
    }, [defaultSelectedId]);

    useEffect(() => {
      if (handleMutiSelect) {
        handleMutiSelect(selectedNodes);
      }
    }, [selectedNodes]);

    function handleSelectedNodeChanged(node: Node) {
      setselectedId(node._key);
      setSelectedNodes([]);
      if (handleClickNode) {
        handleClickNode(node);
      }
    }

    // 单击节点
    function clickNode(node: CNode) {
      clearTimeout(clickTimeId);
      clickTimeId = setTimeout(function () {
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
        if (!node.contract) {
          const count = countNodeDescendants(nodeMap, node._key);
          nodes[node._key].childNum = count;
        } else {
          delete nodes[node._key].childNum;
        }
        setNodeMap(nodes);
        if (handleChange) {
          changed = true;
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
          changed = true;
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
        handleClickStatus(node, event.currentTarget, event);
      }
    }

    // 节点改名
    function changeText(nodeId: string, text: string) {
      setshowInput(false);
      setshowNewInput(false);
      setInputEmpty(false);

      if (UNCONTROLLED) {
        let nodes = changeNodeText(nodeMap, nodeId, text);
        setNodeMap(nodes);
        if (handleChange) {
          changed = true;
        }
      }
      if (handleChangeNodeText) {
        handleChangeNodeText(nodeId, text);
      }
      if (containerRef && containerRef.current) {
        containerRef.current.focus();
      }
    }

    function updateNodeById(nodeMap: NodeMap, id: string, data: any) {
      setshowInput(false);
      setshowNewInput(false);
      setInputEmpty(false);

      const nodes = updateNodeByKey(nodeMap, id, data);
      setNodeMap(nodes);
      if (containerRef && containerRef.current) {
        containerRef.current.focus();
      }
      if (handleChange) {
        changed = true;
      }
    }

    function updateNodesByIds(nodeMap: NodeMap, ids: string[], data: any) {
      setshowInput(false);
      setshowNewInput(false);
      setInputEmpty(false);

      let nodes = _.cloneDeep(nodeMap);
      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];
        nodes = updateNodeByKey(nodes, id, data);
      }
      setNodeMap(nodes);
      if (containerRef && containerRef.current) {
        containerRef.current.focus();
      }
      if (handleChange) {
        changed = true;
      }
    }

    // 添加平级节点
    function addNext(nodeKey?: string) {
      const targetKey = nodeKey || selectedId;
      if (!targetKey) {
        return;
      }
      if (targetKey === startId) {
        return alert('根节点无法添加兄弟节点！');
      }
      // setShowOptionsNode(null);
      if (UNCONTROLLED) {
        const res = addNextNode(nodeMap, targetKey);

        if (handleAddNext) {
          handleAddNext(targetKey, res.addedNode);
        }

        setselectedId(res.addedNode._key);
        setSelectedNodes([]);
        setNodeMap(res.nodes);
        setshowInput(true);
        if (handleChange) {
          changed = true;
        }
      } else {
        if (handleAddNext) {
          handleAddNext(targetKey);
        }
      }
    }

    // 添加子节点
    function addChild(nodeKey?: string) {
      const targetKey = nodeKey || selectedId;
      if (!targetKey) {
        return;
      }
      // setShowOptionsNode(null);
      if (UNCONTROLLED) {
        const res = addChildNode(nodeMap, targetKey);
        if (handleAddChild) {
          handleAddChild(targetKey, res.addedNode);
        }
        setselectedId(res.addedNode._key);
        setSelectedNodes([]);
        setNodeMap(res.nodes);
        setshowInput(true);
        if (handleChange) {
          changed = true;
        }
      } else {
        if (handleAddChild) {
          handleAddChild(targetKey);
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
            changed = true;
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
            changed = true;
          }
        } else {
          if (handleShiftUpDown) {
            handleShiftUpDown(selectedId, res.brotherKeys, 'down');
          }
        }
      }
    }

    // 删除节点
    function deletenode(nodeKey?: string) {
      const targetKey = nodeKey || selectedId;
      if (!targetKey && !selectedNodes.length) {
        return;
      }
      if (UNCONTROLLED) {
        // 删除单个节点
        if (!selectedNodes.length && targetKey) {
          const node = nodeMap[targetKey];
          if (node.disabled) {
            return;
          }
          if (targetKey === startId) {
            return alert('根节点不允许删除！');
          }
          const nextSelectId = getNextSelect(node, nodeMap);
          if (nextSelectId) {
            setselectedId(nextSelectId);
          } else {
            setselectedId(null);
          }
          let res = deleteNode(nodeMap, targetKey);
          setSelectedNodes([]);
          setNodeMap(res.nodes);
          if (handleChange) {
            changed = true;
          }
        } else {
          // 批量删除
          let nodes = nodeMap;
          for (let index = 0; index < selectedNodes.length; index++) {
            const element = selectedNodes[index];
            if (element._key !== startId) {
              const res = deleteNode(nodes, element._key);
              nodes = res.nodes;
            }
          }
          setSelectedNodes([]);
          setNodeMap(nodes);
          if (handleChange) {
            changed = true;
          }
        }

        if (handleDeleteNode) {
          handleDeleteNode(targetKey, selectedNodes);
        }
      } else {
        if (handleDeleteNode) {
          handleDeleteNode(targetKey, selectedNodes);
        }
      }
    }

    function saveNodes() {
      return { rootKey: startId, data: _.cloneDeep(nodeMap) };
    }

    const handleKeyUp = (event: React.KeyboardEvent) => {
      if (event.key === ' ') {
        spaceKeyDown = false;
      }
    };

    function onPaste(event: ClipboardEvent) {
      if (showInput || showNewInput) {
        return;
      }
      event.preventDefault();
      const pasteType = localStorage.getItem('pasteType');
      const pasteNodeKey = localStorage.getItem('pasteNodeKey');

      if (pasteType && pasteNodeKey && selectedId) {
        if (UNCONTROLLED) {
          const res = pasteNode(nodeMap, pasteNodeKey, pasteType, selectedId);
          if (res) {
            setNodeMap(res);
            if (handleChange) {
              changed = true;
            }
          }
        } else if (handlePaste) {
          handlePaste(pasteNodeKey, pasteType, selectedId, event);
        }
        localStorage.removeItem('pasteNodeKey');
        localStorage.removeItem('pasteType');
      } else {
        const files = event.clipboardData?.files;
        const node = selectedId ? nodeMap[selectedId] : null;
        if (files && files.length && node) {
          handleTreePaste(node._key, node.name, files);
        } else {
          const text = event.clipboardData?.getData('text');
          // 如果用户复制了文字，则将文字黏贴为节点
          if (text && handlePasteText) {
            handlePasteText(text, event);
          }
        }
      }
    }

    async function handleKeyDown(event: KeyboardEvent) {
      if (event.key === ' ' && !spaceKeyDown) {
        spaceKeyDown = true;
      }

      if (disabled || disableShortcut || showInput || showNewInput) {
        return;
      }
      const commandKey = isMac ? event.metaKey : event.ctrlKey;

      if (quickCommandKey && event.key === quickCommandKey) {
        event.preventDefault();
        if (handleQuickCommandOpen && selectedId) {
          const el = document.getElementById(`tree-node-${selectedId}`);
          if (el) {
            handleQuickCommandOpen(el);
          }
        }
      } else if (commandKey) {
        switch (event.key) {
          // 複製
          case 'c': {
            event.preventDefault();
            if (selectedId) {
              localStorage.setItem('pasteNodeKey', selectedId);
              localStorage.setItem('pasteType', 'copy');
              copyNode(nodeMap, selectedId);
            }
            break;
          }
          // 剪切
          case 'x': {
            event.preventDefault();
            if (selectedId) {
              // 根節點不允許剪切
              if (selectedId === startId) {
                localStorage.removeItem('pasteNodeKey');
                localStorage.removeItem('pasteType');
                return;
              }
              localStorage.setItem('pasteNodeKey', selectedId);
              localStorage.setItem('pasteType', 'cut');
            }
            break;
          }
          default:
            break;
        }
      } else {
        switch (event.key) {
          case 'Enter': {
            event.preventDefault();
            addNext();
            break;
          }
          case 'Tab': {
            event.preventDefault();
            addChild();
            break;
          }
          case 'Delete':
          case 'Backspace': {
            event.preventDefault();
            if (showDeleteConform) {
              const node = selectedId ? nodeMap[selectedId] : null;
              if (node && node.sortList.length) {
                showDeleteConform();
              } else {
                deletenode();
              }
            } else {
              deletenode();
            }
            break;
          }
          case 'ArrowUp': {
            event.preventDefault();
            if (event.shiftKey) {
              shiftUp();
            } else if (selectedId) {
              const res = changeMindSelect(selectedId, cnodes, event.key);
              if (res) {
                handleSelectedNodeChanged(res);
              }
            }
            break;
          }
          case 'ArrowDown': {
            event.preventDefault();
            if (event.shiftKey) {
              shiftDown();
            } else if (selectedId) {
              const res = changeMindSelect(selectedId, cnodes, event.key);
              if (res) {
                handleSelectedNodeChanged(res);
              }
            }
            break;
          }
          case 'ArrowRight':
          case 'ArrowLeft': {
            event.preventDefault();
            if (selectedId) {
              const res = changeMindSelect(selectedId, cnodes, event.key);
              if (res) {
                handleSelectedNodeChanged(res);
              }
            }
            break;
          }
          default: {
            // if (
            //   selectedId &&
            //   !showInput &&
            //   event.key.length === 1 &&
            //   /[a-zA-Z]+/.test(event.key)
            // ) {
            //   if (UNCONTROLLED) {
            //     let nodes = changeNodeText(nodeMap, selectedId, '');
            //     setNodeMap(nodes);
            //     if (handleChange) {
            //       changed = true;
            //     }
            //   }
            //   if (handleChangeNodeText) {
            //     handleChangeNodeText(selectedId, '');
            //   }
            //   setshowInput(true);
            // }
            if (
              selectedId &&
              !showInput &&
              event.key.length === 1 &&
              /[a-zA-Z]+/.test(event.key)
            ) {
              setInputEmpty(true);
              setshowInput(true);
            }
            break;
          }
        }
      }
    }

    // function clickOptionsButton(node: CNode) {
    //   clickNode(node);
    //   setShowOptionsNode(node);
    // }

    function clickPreview(node: CNode) {
      if (handleClickPreviewButton) {
        handleClickPreviewButton(node);
      }
    }

    function clickDot(node: CNode) {
      if (handleClickDot) {
        handleClickDot(node);
      }
    }

    function handleFrameSelectionStart(e: React.MouseEvent) {
      if (e.nativeEvent.which === 1 && !spaceKeyDown) {
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
          block_height,
          cnodes
        );
        setselectedId(null);
        if (handleClickNode) {
          handleClickNode(selectionNodes.length ? selectionNodes : null);
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
          (element) => node._key === element._key
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
        let time = new Date().getTime();
        if (time - lastTime > gapTime || !lastTime) {
          e.stopPropagation();
          let movedX = 0;
          let movedY = 0;
          movedX = e.clientX - clickX;
          movedY = e.clientY - clickY;

          setMovedNodeX(movedNodeX + movedX);
          setMovedNodeY(movedNodeY + movedY);

          setClickX(e.clientX);
          setClickY(e.clientY);

          lastTime = time;
        }
      }
      if (frameSelectionStarted) {
        let time = new Date().getTime();
        if (time - lastTime > gapTime || !lastTime) {
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
            block_height,
            cnodes
          );
          setselectedId(null);
          setSelectedNodes(selectionNodes);

          lastTime = time;
        }
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
            setMovedNodeX((movedNodeX) => movedNodeX - stepX);
            setMovedNodeY((movedNodeY) => movedNodeY - stepY);
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
                    changed = true;
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
                  changed = true;
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

    // 有子节点的节点后的纵线
    function childVPath(node: CNode, y1: number, y2: number) {
      const diff = INDENT - 8;
      const HlineWidth = diff - radius;

      let startBlockHeight = block_height;
      if (node._key === startId) {
        startBlockHeight = block_height * rootZoomRatio;
      } else if (node.father === startId) {
        startBlockHeight = block_height * secondZoomRatio;
      }

      let endBlockHeight = block_height;
      if (node._key === startId) {
        endBlockHeight = block_height * secondZoomRatio;
      }

      const startX = !node.toLeft ? node.x + node.width : node.x;
      const startY = node.y + startBlockHeight / 2;
      const M = `M ${startX} ${startY}`;
      const H = !node.toLeft
        ? `H ${startX + HlineWidth}`
        : `H ${startX - HlineWidth}`;
      const M2 = `M ${
        !node.toLeft ? startX + HlineWidth : startX - HlineWidth
      } ${y1 + endBlockHeight / 2 + radius}`;
      const V = `V ${y2 + endBlockHeight / 2 - radius}`;

      if (y1 === y2) {
        return `${M} ${H}`;
      } else {
        return `${M} ${H} ${M2} ${V}`;
      }
    }

    // 每个子节点前的横线
    function path(node: CNode, dotY: any) {
      let startBlockHeight = block_height;
      if (node._key === startId) {
        startBlockHeight = block_height * rootZoomRatio;
      } else if (node.father === startId) {
        startBlockHeight = block_height * secondZoomRatio;
      }

      let endBlockHeight = block_height;
      if (node._key === startId) {
        endBlockHeight = block_height * secondZoomRatio;
      }

      const nodeMiddleY = node.y + startBlockHeight / 2;

      const endX = !node.toLeft
        ? node.x + node.width + INDENT - radius
        : node.x - INDENT + radius;
      const endY = dotY + endBlockHeight / 2;
      const startX = !node.toLeft ? endX - radius : endX + radius;

      let startY;
      if (nodeMiddleY === endY) {
        startY = endY;
      } else if (nodeMiddleY > endY) {
        startY = endY + radius;
      } else {
        startY = endY - radius;
      }

      const x1 = startX;
      const y1 = endY;

      const M = `M ${startX} ${startY}`;
      const Q = `Q ${x1} ${y1},${endX} ${endY}`;
      let H = '';
      // 根节点与其子节点的间隔为2INDENT，所以再加一段横线
      if (node._key === startId) {
        H = `H ${endX + INDENT}`;
      }
      return `${M} ${Q} ${H}`;
    }

    function rootPath(node: CNode, dotY: any, isLeft?: boolean) {
      const startBlockHeight = node.height || block_height * rootZoomRatio;
      const endBlockHeight = block_height * secondZoomRatio;
      const startX = node.x + node.width / 2;
      // const middleY = node.y + startBlockHeight / 2;
      const startY = node.y + startBlockHeight / 2;

      const endX = !isLeft
        ? node.x + node.width + INDENT * 4 - 8
        : node.x - INDENT * 4 + 8;
      const endY = dotY + endBlockHeight / 2;

      // const x1 = (startX + endX) / 2;
      const x1 = startX;
      const y1 = endY;

      const M = `M ${startX} ${startY}`;
      const Q = `Q ${x1} ${y1}, ${endX} ${endY}`;
      return `${M} ${Q}`;
    }

    function handleTreePaste(
      nodeId: string,
      nodeName: string,
      files: FileList
    ) {
      if (handleFileChange) {
        handleFileChange(nodeId, nodeName, files);
      } else if (UNCONTROLLED) {
        if (files.length) {
          const file = files[0];
          if (file.type.startsWith('image/')) {
            if (nodeId !== startId) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const base64String = event.target?.result;
                if (base64String) {
                  let img = new Image(); //手动创建一个Image对象
                  img.src = base64String as string;
                  img.onload = async () => {
                    const height = 200 / (img.width / img.height);
                    updateNodeById(nodeMap, nodeId, {
                      name: nodeName,
                      imageUrl: base64String as string,
                      imageWidth: 200,
                      imageHeight: height,
                    });
                  };
                }
              };
              reader.readAsDataURL(file);
            }
          }
        }
      }
    }

    function handleResizeImage(nodeId: string, width: number) {
      if (UNCONTROLLED) {
        let nodes = { ...nodeMap };
        let node = nodes[nodeId];
        if (!node || !node.imageWidth || !node.imageHeight) return;
        const height = width / (node.imageWidth / node.imageHeight);
        node.imageWidth = width;
        node.imageHeight = height;
        setNodeMap(nodes);
        if (handleChange) {
          changed = true;
        }
      }
      if (handleResizeNodeImage) {
        handleResizeNodeImage(nodeId, width);
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
        suppressContentEditableWarning={true}
        ref={containerRef}
        // onPaste={onPaste}
        onKeyDown={(e: any) => handleKeyDown(e)}
        onMouseDown={handleFrameSelectionStart}
        onKeyUp={handleKeyUp}
        onMouseMove={handleMoveNode}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragLeave}
      >
        <svg
          className="tree-svg"
          viewBox={`0 0 ${maxEnd + 100} ${maxY}`}
          width={startExport ? (maxEnd + 100) * 2 : maxEnd + 100}
          height={startExport ? maxY * 2 : maxY}
          style={{ backgroundColor: BACKGROUND_COLOR }}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
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

            <symbol
              id="contract-up"
              width="20"
              height="20"
              viewBox="0,0,1024,1024"
              preserveAspectRatio="xMinYMin meet"
            >
              <circle cx="512" cy="512" r="400" fill={nodeColor} />
              <path
                d="M512 39.367111c259.982222 0 472.632889 212.707556 472.632889 472.632889 0 259.982222-212.707556 472.632889-472.632889 472.632889C252.017778 984.632889 39.367111 771.925333 39.367111 512 39.367111 252.017778 252.074667 39.367111 512 39.367111z m0 68.266667C289.792 107.633778 107.633778 289.792 107.633778 512c0 222.208 182.158222 404.366222 404.366222 404.366222 222.208 0 404.366222-182.158222 404.366222-404.366222 0-222.208-182.158222-404.366222-404.366222-404.366222z"
                fill={COLOR}
              ></path>
              <path
                d="M256 589.255111a40.163556 40.163556 0 0 1 13.141333-29.184l219.704889-203.036444a34.133333 34.133333 0 0 1 46.307556 0l219.875555 203.150222c17.009778 15.701333 17.351111 42.211556 0.739556 58.424889l-5.006222 4.152889a41.870222 41.870222 0 0 1-52.224-3.299556L519.68 454.883556a11.377778 11.377778 0 0 0-15.36 0l-178.801778 164.522666a41.756444 41.756444 0 0 1-57.173333-0.682666 40.049778 40.049778 0 0 1-11.889778-22.812445l-0.455111-6.656z"
                fill={COLOR}
              ></path>
            </symbol>

            <symbol
              id="contract-left"
              width="20"
              height="20"
              viewBox="0,0,1024,1024"
              preserveAspectRatio="xMinYMin meet"
            >
              <circle cx="512" cy="512" r="400" fill={nodeColor} />
              <path
                d="M512 39.367111c259.982222 0 472.632889 212.707556 472.632889 472.632889 0 259.982222-212.707556 472.632889-472.632889 472.632889C252.017778 984.632889 39.367111 771.925333 39.367111 512 39.367111 252.017778 252.074667 39.367111 512 39.367111z m0 68.266667C289.792 107.633778 107.633778 289.792 107.633778 512c0 222.208 182.158222 404.366222 404.366222 404.366222 222.208 0 404.366222-182.158222 404.366222-404.366222 0-222.208-182.158222-404.366222-404.366222-404.366222z"
                fill={COLOR}
              ></path>
              <path
                d="M594.944 261.688889a40.163556 40.163556 0 0 0-29.184 13.141333L362.723556 494.535111a34.133333 34.133333 0 0 0 0 46.307556l203.150222 219.875555c15.701333 17.009778 42.211556 17.351111 58.424889 0.739556l4.152889-5.006222a41.870222 41.870222 0 0 0-3.299556-52.224L460.572444 525.368889a11.377778 11.377778 0 0 1 0-15.36l164.522667-178.801778a41.756444 41.756444 0 0 0-0.682667-57.173333 40.049778 40.049778 0 0 0-22.812444-11.889778l-6.656-0.455111z"
                fill={COLOR}
              ></path>
            </symbol>
            <symbol
              id="contract-right"
              width="20"
              height="20"
              viewBox="0,0,1024,1024"
              preserveAspectRatio="xMinYMin meet"
            >
              <circle cx="512" cy="512" r="400" fill={nodeColor} />
              <path
                d="M512 39.367111c259.982222 0 472.632889 212.707556 472.632889 472.632889 0 259.982222-212.707556 472.632889-472.632889 472.632889C252.017778 984.632889 39.367111 771.925333 39.367111 512 39.367111 252.017778 252.074667 39.367111 512 39.367111z m0 68.266667C289.792 107.633778 107.633778 289.792 107.633778 512c0 222.208 182.158222 404.366222 404.366222 404.366222 222.208 0 404.366222-182.158222 404.366222-404.366222 0-222.208-182.158222-404.366222-404.366222-404.366222z"
                fill={COLOR}
              ></path>
              <path
                d="M462.108444 261.688889a40.163556 40.163556 0 0 1 29.184 13.141333l202.979556 219.704889a34.133333 34.133333 0 0 1 0 46.307556l-203.093333 219.875555a40.106667 40.106667 0 0 1-58.424889 0.739556l-4.152889-5.006222a41.870222 41.870222 0 0 1 3.299555-52.224l164.522667-178.858667a11.377778 11.377778 0 0 0 0-15.36L431.957333 331.207111a41.756444 41.756444 0 0 1 0.682667-57.173333 40.049778 40.049778 0 0 1 22.812444-11.889778l6.656-0.455111z"
                fill={COLOR}
              ></path>
            </symbol>
            <symbol
              id="add"
              width="20"
              height="20"
              viewBox="0,0,1024,1024"
              preserveAspectRatio="xMinYMin meet"
            >
              <circle cx="512" cy="512" r="400" fill={COLOR} />
              <path
                d="M244.622222 467.228444m44.544 0l445.155556 0q44.544 0 44.544 44.544l0-0.056888q0 44.544-44.544 44.544l-445.155556 0q-44.544 0-44.544-44.544l0 0.056888q0-44.544 44.544-44.544Z"
                fill={nodeColor}
              ></path>
              <path
                d="M556.259556 289.166222v445.212445a44.544 44.544 0 1 1-89.031112 0V289.166222a44.544 44.544 0 0 1 89.031112 0z"
                fill={nodeColor}
              ></path>
            </symbol>
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
              id="pack"
              width="18"
              height="16"
              viewBox="0,0,18,16"
              preserveAspectRatio="xMinYMin meet"
            >
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g transform="translate(0.000000, 0.000007)">
                  <path
                    d="M15.8396584,2.58289418 L8.61752011,2.58289418 L6.1696488,0.130509602 C6.08473826,0.0462875302 5.96976481,-0.000681000602 5.85012509,-4.4408921e-15 L2.25037734,-4.4408921e-15 C1.00777667,-4.4408921e-15 0.000477621947,1.007383 0.000477621947,2.24990718 L0.000477621947,13.0493034 C-0.024613059,14.2668134 0.941990125,15.2741125 2.15942362,15.2992032 L2.16034157,15.2992032 L15.8396584,15.2992032 C17.0570919,15.2746479 18.0240776,14.2677314 17.9995224,13.0502979 L17.9995224,13.0493034 L17.9995224,4.83279389 C18.0246131,3.6152839 17.0580099,2.60798486 15.8405764,2.58289418 L15.8396584,2.58289418 Z"
                    fill="#7264C7"
                  ></path>
                  <path
                    d="M5.02500122,3.90995406 C5.51319856,3.90995406 5.90898875,4.30566776 5.90898875,4.79386509 C5.90898875,5.13142591 5.71976385,5.42480743 5.44160487,5.57371884 L5.44109019,7.78495406 L12.4856515,7.78458737 C12.6301575,7.49311204 12.9307285,7.29272862 13.2780452,7.29272862 C13.7662426,7.29272862 14.1620328,7.68851881 14.1620328,8.17671615 C14.1620328,8.66491348 13.7662426,9.06070368 13.2780452,9.06070368 C12.9236883,9.06070368 12.6179914,8.85211427 12.4770572,8.5510087 L5.44109019,8.54995406 L5.44149123,10.9547212 C5.44149123,11.2319426 5.66707787,11.4575292 5.94429929,11.4575292 L12.4266114,11.4572917 C12.5306129,11.0848093 12.8724551,10.8115436 13.2780452,10.8115436 C13.7662426,10.8115436 14.1620328,11.2073338 14.1620328,11.6955312 C14.1620328,12.1837285 13.7662426,12.5795187 13.2780452,12.5795187 C12.987737,12.5795187 12.7300882,12.4395183 12.5689396,12.2233421 L5.94429929,12.222489 C5.24527904,12.222489 4.67653144,11.6537414 4.67653144,10.9547212 L4.67588826,5.60621629 C4.36134998,5.47082409 4.14109019,5.15805717 4.14109019,4.79386509 C4.14109019,4.30566776 4.53688038,3.90995406 5.02500122,3.90995406 Z"
                    fill="#FFFFFF"
                  ></path>
                </g>
              </g>
            </symbol>
          </defs>
          {cnodes.map((node, index) => (
            <g
              key={`${index}_${node._key}`}
              className={`node-group-${node._key}`}
            >
              <g>
                {node.dots &&
                node.x &&
                node.y &&
                (node._key !== startId || singleColumn)
                  ? node.dots.map((dotY, index) => (
                      <path
                        key={index}
                        d={path(node, dotY)}
                        stroke={
                          rainbowColor ? node.backgroundColor : PATH_COLOR
                        }
                        strokeWidth={PATH_WIDTH}
                        fill="transparent"
                      />
                    ))
                  : null}
              </g>
              {node._key === startId && !singleColumn ? (
                <g>
                  {node.leftDots
                    ? node.leftDots.map((dot, index) => (
                        <path
                          key={`leftDots-${index}`}
                          d={rootPath(node, dot.y, true)}
                          stroke={
                            rainbowColor ? dot.backgroundColor : PATH_COLOR
                          }
                          strokeWidth={PATH_WIDTH * 1.5}
                          fill="transparent"
                        />
                      ))
                    : null}
                  {node.rightDots
                    ? node.rightDots.map((dot, index) => (
                        <path
                          key={`rightDots-${index}`}
                          d={rootPath(node, dot.y, false)}
                          stroke={
                            rainbowColor ? dot.backgroundColor : PATH_COLOR
                          }
                          strokeWidth={PATH_WIDTH * 1.5}
                          fill="transparent"
                        />
                      ))
                    : null}
                  {node.dots
                    ? node.dots.map((dotY, index) => (
                        <path
                          key={index}
                          d={rootPath(node, dotY, false)}
                          stroke={PATH_COLOR}
                          strokeWidth={PATH_WIDTH * 1.5}
                          fill="transparent"
                        />
                      ))
                    : null}
                </g>
              ) : node.dots && node.dots.length ? (
                <path
                  key={`path-${index}`}
                  d={childVPath(
                    node,
                    node.dots[0],
                    node.dots[node.dots.length - 1]
                  )}
                  stroke={rainbowColor ? node.backgroundColor : PATH_COLOR}
                  strokeWidth={PATH_WIDTH}
                  fill="transparent"
                />
              ) : null}

              <TreeNode
                node={node}
                startId={startId}
                topBottomMargin={
                  node._key === startId
                    ? topBottomMargin * rootZoomRatio
                    : node.father === startId
                    ? topBottomMargin * secondZoomRatio
                    : topBottomMargin
                }
                lineHeight={
                  node._key === startId
                    ? lineHeight * rootZoomRatio
                    : node.father === startId
                    ? lineHeight * secondZoomRatio
                    : lineHeight
                }
                FONT_SIZE={
                  node._key === startId
                    ? FONT_SIZE * rootZoomRatio
                    : node.father === startId
                    ? FONT_SIZE * secondZoomRatio
                    : FONT_SIZE
                }
                avatarRadius={avatarRadius}
                color={rainbowColor && node.father === startId ? '#FFF' : COLOR}
                nodeColor={rainbowColor ? undefined : nodeColor}
                treeBackgroundColor={BACKGROUND_COLOR}
                alias={new Date().getTime()}
                selected={selectedId}
                selectedNodes={selectedNodes}
                showIcon={SHOW_ICON}
                showAvatar={SHOW_AVATAR}
                customAdornment={customAdornment}
                startNodeBg={startNodeBg}
                handleClickDot={clickDot}
                handleExpand={handleExpand}
                handleCheck={check}
                handleClickAvatar={clickAvatar}
                handleClickStatus={clickStatus}
                handleClickNode={clickNode}
                handleDbClickNode={dbClickNode}
                clickPreview={clickPreview}
                updateDragInfo={updateDragInfo}
                handleDragStart={handleDragStart}
                dragStarted={dragStarted}
                dragEndFromOutside={dragEndFromOutside}
                mouseEnterAvatar={(node: CNode) => {
                  if (handleMouseEnterAvatar) handleMouseEnterAvatar(node);
                }}
                mouseLeaveAvatar={(node: CNode) => {
                  if (handleMouseLeaveAvatar) handleMouseLeaveAvatar(node);
                }}
                bottomOptions={true}
                hideHour={hideHour}
                dotColor={PATH_COLOR}
                hoverBorderColor={HOVER_BORDER_COLOR}
                selectedBorderColor={SELECTED_BORDER_COLOR}
                selectedBackgroundColor={SELECTED_BACKGROUND_COLOR}
                handleFileChange={handleFileChange}
                onContextMenu={handleContextMenu}
                onClickNodeImage={handleClickNodeImage}
                onResizeImage={handleResizeImage}
                handleAddChild={addChild}
                handleAddNext={addNext}
              />
            </g>
          ))}
          {/* 拖拽用節點 */}
          {showDragNode &&
          (Math.abs(movedNodeX) > 5 || Math.abs(movedNodeY) > 5) ? (
            <DragNode
              nodeList={cnodes}
              BLOCK_HEIGHT={block_height}
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
            topBottomMargin={
              selectedId === startId
                ? topBottomMargin * rootZoomRatio
                : nodeMap &&
                  selectedId &&
                  nodeMap[selectedId].father === startId
                ? topBottomMargin * secondZoomRatio
                : topBottomMargin
            }
            lineHeight={
              selectedId === startId
                ? lineHeight * rootZoomRatio
                : nodeMap &&
                  selectedId &&
                  nodeMap[selectedId].father === startId
                ? lineHeight * secondZoomRatio
                : lineHeight
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
            showIcon={SHOW_ICON}
            showAvatar={SHOW_AVATAR}
            textMaxWidth={textMaxWidth}
            avatarRadius={avatarRadius}
            startId={startId}
            nodeColor={rainbowColor ? undefined : nodeColor}
            startNodeBg={startNodeBg}
            inputEmpty={inputEmpty}
            selectedBorderColor={SELECTED_BORDER_COLOR}
            handleFileChange={handleTreePaste}
          />
        ) : null}
      </div>
    );
  }
);
