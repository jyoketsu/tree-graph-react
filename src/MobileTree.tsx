import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import NodeMap from './interfaces/NodeMap';
import CNode from './interfaces/CNode';
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
import MobileItem from './components/nodeItem/MobileItem';

const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

export interface MobileTreeProps {
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
  // 选中的字体颜色
  selectedColor?: string;
  hoverColor?: string;
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
  handleClickDot?: Function;
  handleDbClickNode?: Function;
  handleChangeNodeText?: Function;
  handleAddNext?: Function;
  handleAddChild?: Function;
  handleDeleteNode?: Function;
  handleShiftUpDown?: Function;
  handlePaste?: Function;
  handleDrag?: Function;
  ref?: any;
  collapseMode?: boolean;
}
export const MobileTree = React.forwardRef(
  (
    {
      nodes,
      startId,
      backgroundColor = '#FFF',
      selectedBackgroundColor = '#ededed',
      dragLineColor = '#00CDD3',
      color = '#595959',
      selectedColor = '#1CA8B3',
      hoverColor = '#595959',
      hoverBackgroundColor = '#f0f0f0',
      cutColor,
      defaultSelectedId,
      uncontrolled = true,
      itemHeight = 30,
      blockHeight = 30,
      fontSize = 14,
      indent = 18,
      disableShortcut,
      disabled,
      showMoreButton,
      showIcon = true,
      showChildNum = false,
      handleClickExpand,
      handleClickNode,
      handleDbClickNode,
      handleClickIcon,
      handleClickDot,
      handleChangeNodeText,
      handleAddNext,
      handleAddChild,
      handleDeleteNode,
      handleShiftUpDown,
      handlePaste,
      handleDrag,
      collapseMode,
    }: MobileTreeProps,
    ref
  ) => {
    let clickTimeId: NodeJS.Timeout;
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
      rename: function() {
        if (selectedId) {
          setshowInput(true);
        }
      },
      clearSelect: function() {
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
        itemHeight,
        blockHeight,
        indent,
        fontSize,
        showIcon,
        false,
        11,
        1,
        1,
        undefined,
        undefined,
        undefined,
        collapseMode,
        expandedNodeKey
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
          setExpandedNodeKey(nodeMap[defaultSelectedId].father);
        }
      }
    }, [defaultSelectedId]);

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
        if (uncontrolled) {
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

      if (uncontrolled) {
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
      if (uncontrolled) {
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

      if (uncontrolled) {
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

      if (uncontrolled) {
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
        if (uncontrolled) {
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
        if (uncontrolled) {
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
            if (uncontrolled) {
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

    function handleDrop() {
      const dragNodeId = sessionStorage.getItem('dragNodeId');
      const dropNodeId = sessionStorage.getItem('dropNodeId');
      const placement = sessionStorage.getItem('placement');
      if (!dragNodeId || !dropNodeId) {
        return;
      }
      const dragInfo: DragInfo = {
        dragNodeId: dragNodeId,
        dropNodeId: dropNodeId,
        placement: placement as 'up' | 'down' | 'in',
      };

      if (uncontrolled) {
        const res = dragSort(
          nodeMap,
          dragNodeId,
          dropNodeId,
          dragInfo.placement
        );
        if (res) {
          setNodeMap(res);
        }
      } else if (handleDrag) {
        handleDrag(dragNodeId, dragInfo);
      }
    }

    function clickDot(node: CNode) {
      if (handleClickDot) {
        handleClickDot(node);
      }
    }

    return (
      <div
        className="menu-wrapper"
        style={{
          position: 'relative',
          outline: 'none',
          width: '100%',
          backgroundColor: backgroundColor,
        }}
        tabIndex={-1}
        ref={containerRef}
        onKeyDown={(e: any) => handleKeyDown(e)}
      >
        {cnodes.map((node, index) => (
          <MobileItem
            key={`${index}_${node._key}`}
            startId={startId}
            indent={indent}
            node={node}
            BLOCK_HEIGHT={blockHeight}
            FONT_SIZE={fontSize}
            selectedBackgroundColor={selectedBackgroundColor}
            dragLineColor={dragLineColor}
            color={color}
            selectedColor={selectedColor}
            hoverColor={hoverColor}
            hoverBackgroundColor={hoverBackgroundColor}
            selected={selectedId}
            showIcon={showIcon}
            disabled={disabled || false}
            showChildNum={showChildNum}
            cutColor={cutColor || 'rgba(255,255,255,0.5)'}
            pasteNodeKey={pasteType === 'cut' ? pasteNodeKey : null}
            showMoreButton={showMoreButton && !disabled ? true : false}
            handleClickNode={clickNode}
            handleDbClickNode={dbClickNode}
            handleClickExpand={handleExpand}
            showInput={(showInput || showNewInput) && selectedId === node._key}
            handleChangeNodeText={changeText}
            handleClickIcon={clickIcon}
            handleDrop={handleDrop}
            handleClickDot={clickDot}
            compId={compId}
            collapseMode={collapseMode}
            collapseModeCollapsed={
              collapseMode
                ? expandedNodeKey
                  ? !ancestorList.includes(node._key)
                  : true
                : undefined
            }
          />
        ))}
      </div>
    );
  }
);
