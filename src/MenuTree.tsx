import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import NodeMap from './interfaces/NodeMap';
import CNode from './interfaces/CNode';
import MenuItem from './components/nodeItem/MenuItem';
import calculate from './services/treeService';
import {
  dot,
  changeNodeText,
  addNextNode,
  addChildNode,
  deleteNode,
  changeSortList,
  pasteNode,
  dragSort,
  guid,
  getAncestor,
} from './services/util';
import DragInfo from './interfaces/DragInfo';

const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

interface NodeClickFunc {
  (node: CNode, targetEl: HTMLElement): void;
}

export interface MenuProps {
  // 节点
  nodes: NodeMap;
  // 根节点id
  startId: string;
  // 菜单背景色
  backgroundColor?: string;
  // 选中菜单背景色
  selectedBackgroundColor?: string;
  dragLineColor?: string;
  // 字体颜色
  color?: string;
  collapseButtonColor?: string;
  // 选中的字体颜色
  selectedColor?: string;
  hoverColor?: string;
  hoverCollapseButtonColor?: string;
  hoverBackgroundColor?: string;
  cutColor?: string;
  // 选中节点id
  defaultSelectedId?: string;
  //  非受控模式
  uncontrolled?: boolean;
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
  disableShortcut?: boolean;
  disabled?: boolean;
  showMoreButton?: boolean;
  showIcon?: boolean;
  showChildNum?: boolean;
  handleClickExpand?: Function;
  handleClickNode?: Function;
  handleClickIcon?: Function;
  handleDbClickNode?: Function;
  handleChangeNodeText?: Function;
  handleAddNext?: Function;
  handleAddChild?: Function;
  handleDeleteNode?: Function;
  handleClickMoreButton?: NodeClickFunc;
  handleShiftUpDown?: Function;
  handlePaste?: Function;
  handleDrag?: (
    dragId: string,
    dragInfo: DragInfo,
    event: React.DragEvent
  ) => void;
  ref?: any;
  collapseMode?: boolean;
  draggable?: boolean;
  // data-detail
  storageData?: string[];
  hideRoot?: boolean;
  paddingLeft?: number;
  tools?: (nodeKey: string) => React.ReactNode;
}
export const MenuTree = React.forwardRef(
  (
    {
      nodes,
      startId,
      backgroundColor,
      selectedBackgroundColor,
      dragLineColor,
      color,
      collapseButtonColor,
      selectedColor,
      hoverColor,
      hoverCollapseButtonColor,
      hoverBackgroundColor = '#4d4d4d',
      cutColor,
      defaultSelectedId,
      uncontrolled,
      itemHeight,
      blockHeight,
      fontSize,
      indent = 18,
      disableShortcut,
      disabled,
      showMoreButton,
      showIcon,
      showChildNum = false,
      handleClickExpand,
      handleClickNode,
      handleDbClickNode,
      handleClickIcon,
      handleChangeNodeText,
      handleAddNext,
      handleAddChild,
      handleDeleteNode,
      handleClickMoreButton,
      handleShiftUpDown,
      handlePaste,
      handleDrag,
      collapseMode,
      draggable = true,
      storageData,
      hideRoot,
      paddingLeft = 0,
      tools,
    }: MenuProps,
    ref
  ) => {
    let clickTimeId: NodeJS.Timeout;

    const ITEM_HEIGHT = itemHeight || 32;
    const BLOCK_HEIGHT = blockHeight || 30;
    const FONT_SIZE = fontSize || 14;
    // const AVATAR_WIDTH = avatarWidth || 22;
    // const CHECK_BOX_WIDTH = checkBoxWidth || 18;
    const UNCONTROLLED = uncontrolled === undefined ? true : uncontrolled;
    const SHOW_ICON = showIcon === undefined ? true : showIcon;

    const [nodeMap, setNodeMap] = useState(nodes);
    const [cnodes, setcnodes] = useState<CNode[]>([]);
    // const [maxX, setmaxX] = useState(0);
    const [selectedId, setselectedId] = useState<string | null>(null);
    const [showInput, setshowInput] = useState(false);
    const [showNewInput, setshowNewInput] = useState(false);

    // 粘貼的節點key
    const [pasteNodeKey, setPasteNodeKey] = useState<string | null>(null);
    // 粘貼方式
    const [pasteType, setPasteType] = useState<'copy' | 'cut' | null>(null);

    const [compId, setCompId] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);

    const [expandedNodeKey, setExpandedNodeKey] = useState<string | null>(
      startId
    );
    const [ancestorList, setAncestorList] = useState<string[]>([]);

    // 暴露方法
    useImperativeHandle(ref, () => ({
      deleteNode: deletenode,
      saveNodes,
      addNext,
      addChild,
      rename: function () {
        if (selectedId) {
          setshowInput(true);
        }
      },
      clearSelect: function () {
        setselectedId(null);
      },
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
      if (!nodeMap[startId]) {
        return;
      }
      const cal = calculate(
        nodeMap,
        startId,
        true,
        ITEM_HEIGHT,
        BLOCK_HEIGHT,
        indent,
        FONT_SIZE,
        SHOW_ICON,
        false,
        11,
        1,
        1,
        paddingLeft + indent,
        undefined,
        undefined,
        collapseMode,
        expandedNodeKey,
        undefined,
        hideRoot
      );

      if (cal) {
        cal.nodes.sort((a, b) => a.y - b.y);
        setcnodes(cal.nodes);
      }
    }, [nodeMap, startId, expandedNodeKey]);

    useEffect(() => {
      if (collapseMode && expandedNodeKey && nodeMap[expandedNodeKey]) {
        const ancestorList = getAncestor(nodes[expandedNodeKey], nodes, true);
        setAncestorList(ancestorList);
      }
    }, [nodeMap, expandedNodeKey]);

    useEffect(() => {
      if (defaultSelectedId) {
        setselectedId(defaultSelectedId);
        if (nodeMap && nodeMap[defaultSelectedId]) {
          setExpandedNodeKey(defaultSelectedId);
        }
      }
    }, [defaultSelectedId]);

    // 单击节点
    function clickNode(node: CNode) {
      clearTimeout(clickTimeId);
      clickTimeId = setTimeout(function () {
        setselectedId(node._key);
        if (handleClickNode) {
          handleClickNode(node);
        }
      }, 250);
    }

    // 双击节点
    function dbClickNode(node: CNode) {
      if (disabled || node.disabled) {
        return;
      }
      clearTimeout(clickTimeId);
      setselectedId(node._key);
      setshowInput(true);
      if (handleDbClickNode) {
        handleDbClickNode(node);
      }
    }

    // 展开/收起节点
    function handleExpand(node: CNode) {
      if (collapseMode) {
        if (expandedNodeKey === node._key) {
          setExpandedNodeKey(node.father || null);
        } else {
          setExpandedNodeKey(node._key);
          if (handleClickExpand && node.contract) {
            handleClickExpand(node);
          }
        }
      } else {
        if (UNCONTROLLED) {
          let nodes = dot(nodeMap, node._key);
          setNodeMap(nodes);
        }
        if (handleClickExpand) {
          handleClickExpand(node);
        }
      }
    }

    function clickIcon(node: CNode) {
      if (handleClickIcon) {
        handleClickIcon(node);
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
        return;
      }
      if (selectedId === startId) {
        return alert('根节点无法添加兄弟节点！');
      }
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
        return;
      }

      if (UNCONTROLLED) {
        const res = addChildNode(nodeMap, selectedId);

        if (handleAddChild) {
          handleAddChild(selectedId, res.addedNode);
        }

        setExpandedNodeKey(selectedId);
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
        return;
      }
      if (selectedId === startId) {
        return alert('根节点不允许删除！');
      }

      if (UNCONTROLLED) {
        let res = deleteNode(nodeMap, selectedId);

        if (handleDeleteNode) {
          handleDeleteNode(selectedId);
        }

        setselectedId(null);
        setNodeMap(res.nodes);
      } else {
        if (handleDeleteNode) {
          handleDeleteNode(selectedId);
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
        } else {
          if (handleShiftUpDown) {
            handleShiftUpDown(selectedId, res.brotherKeys, 'down');
          }
        }
      }
    }

    function saveNodes() {
      return nodeMap;
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

    function handleClickMore(
      node: CNode,
      event: React.MouseEvent<HTMLButtonElement>
    ) {
      if (handleClickMoreButton) {
        handleClickMoreButton(node, event.currentTarget);
      }
    }

    function handleDrop(event: React.DragEvent) {
      const dragNodeId = sessionStorage.getItem('dragNodeId');
      const dropNodeId = sessionStorage.getItem('dropNodeId');
      const placement = sessionStorage.getItem('placement');
      if (!dropNodeId) {
        return;
      }
      const dragInfo: DragInfo = {
        dragNodeId: dragNodeId || '',
        dropNodeId: dropNodeId,
        placement: placement as 'up' | 'down' | 'in',
      };

      if (UNCONTROLLED) {
        const res = dragSort(
          nodeMap,
          dragNodeId || '',
          dropNodeId,
          dragInfo.placement
        );
        if (res) {
          setNodeMap(res);
        }
      } else if (handleDrag) {
        handleDrag(dragNodeId || '', dragInfo, event);
      }
    }

    return (
      <div
        className="menu-wrapper"
        style={{
          position: 'relative',
          outline: 'none',
          width: '100%',
          backgroundColor: backgroundColor || '#333333',
        }}
        tabIndex={-1}
        ref={containerRef}
        onKeyDown={(e: any) => handleKeyDown(e)}
      >
        {cnodes.map((node, index) => (
          <MenuItem
            key={`${index}_${node._key}`}
            startId={startId}
            indent={indent}
            node={node}
            BLOCK_HEIGHT={BLOCK_HEIGHT}
            FONT_SIZE={FONT_SIZE}
            selectedBackgroundColor={selectedBackgroundColor || '#00CDD3'}
            dragLineColor={dragLineColor || '#00CDD3'}
            color={color || '#CDD0D2'}
            collapseButtonColor={collapseButtonColor}
            selectedColor={selectedColor || '#FFF'}
            hoverColor={hoverColor || '#FFF'}
            hoverCollapseButtonColor={hoverCollapseButtonColor}
            hoverBackgroundColor={hoverBackgroundColor}
            selected={selectedId}
            showIcon={SHOW_ICON}
            disabled={disabled || false}
            showChildNum={showChildNum}
            cutColor={cutColor || 'rgba(255,255,255,0.5)'}
            pasteNodeKey={pasteType === 'cut' ? pasteNodeKey : null}
            showMoreButton={showMoreButton && !disabled ? true : false}
            handleClickNode={clickNode}
            handleDbClickNode={dbClickNode}
            clickMore={handleClickMore}
            handleClickExpand={handleExpand}
            showInput={(showInput || showNewInput) && selectedId === node._key}
            handleChangeNodeText={changeText}
            handleClickIcon={clickIcon}
            handleDrop={handleDrop}
            compId={compId}
            collapseMode={collapseMode}
            collapseModeCollapsed={
              collapseMode
                ? expandedNodeKey
                  ? !ancestorList.includes(node._key)
                  : true
                : undefined
            }
            draggable={draggable}
            storageData={storageData}
            tools={tools}
          />
        ))}
      </div>
    );
  }
);
