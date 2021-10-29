import React, { useState, useEffect, useImperativeHandle } from 'react';
import './treeEditor.css';
import NodeMap from './interfaces/NodeMap';
import Node from './interfaces/Node';
import CNode from './interfaces/CNode';
import calculate from './services/singleColumnService';
import {
  dot,
  changeNodeText,
  addNextNode,
  addChildNode,
  deleteNode,
  // changeSortList,
  // pasteNode,
  dragSort,
  guid,
  getAncestor,
} from './services/util';
import DragInfo from './interfaces/DragInfo';
import EditorItem from './components/nodeItem/EditorItem';

// const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

export interface TreeEditorProps {
  // 节点
  nodes: NodeMap;
  // 根节点id
  startId: string;
  themeColor?: string;
  cutColor?: string;
  defaultFocusedId?: string;
  //  非受控模式
  uncontrolled?: boolean;
  // 缩进
  indent?: number;
  // 头像宽度
  avatarWidth?: number;
  checkBoxWidth?: number;
  disabled?: boolean;
  showIcon?: boolean;
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
export const TreeEditor = React.forwardRef(
  (
    {
      nodes,
      startId,
      themeColor = '#1CA8B3',
      defaultFocusedId,
      uncontrolled = true,
      indent = 30,
      disabled,
      showIcon = true,
      handleClickExpand,
      handleClickNode,
      handleDbClickNode,
      handleClickIcon,
      handleClickDot,
      handleChangeNodeText,
      handleAddNext,
      handleAddChild,
      handleDeleteNode,
      // handleShiftUpDown,
      // handlePaste,
      handleDrag,
      collapseMode,
    }: TreeEditorProps,
    ref
  ) => {
    let clickTimeId: NodeJS.Timeout;
    const [nodeMap, setNodeMap] = useState(nodes);
    const [cnodes, setcnodes] = useState<CNode[]>([]);

    // 粘貼的節點key
    // const [pasteNodeKey, setPasteNodeKey] = useState<string | null>(null);
    // 粘貼方式
    // const [pasteType, setPasteType] = useState<'copy' | 'cut' | null>(null);

    const [compId, setCompId] = useState('');

    const [expandedNodeKey, setExpandedNodeKey] = useState<string | null>(
      startId
    );
    const [ancestorList, setAncestorList] = useState<string[]>([]);
    const [focusedKey, setFocusedKey] = useState(defaultFocusedId);

    // 暴露方法
    useImperativeHandle(ref, () => ({
      deleteNode: deletenode,
      saveNodes,
      addNext,
      addChild,
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
      const nodes = calculate(
        nodeMap,
        startId,
        indent,
        1,
        collapseMode,
        expandedNodeKey,
        true
      );

      if (nodes) {
        nodes.sort((a, b) => a.y - b.y);
        setcnodes(nodes);
      }
    }, [nodeMap, startId, expandedNodeKey]);

    useEffect(() => {
      if (collapseMode && expandedNodeKey && nodeMap[expandedNodeKey]) {
        const ancestorList = getAncestor(nodes[expandedNodeKey], nodes, true);
        setAncestorList(ancestorList);
      }
    }, [nodeMap, expandedNodeKey]);

    useEffect(() => {
      if (defaultFocusedId) {
        if (nodeMap && nodeMap[defaultFocusedId]) {
          setExpandedNodeKey(nodeMap[defaultFocusedId].father);
        }
      }
    }, [defaultFocusedId]);

    // 单击节点
    function clickNode(node: CNode) {
      clearTimeout(clickTimeId);
      clickTimeId = setTimeout(function() {
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
      if (uncontrolled) {
        let nodes = changeNodeText(nodeMap, nodeId, text);
        setNodeMap(nodes);
      }
      if (handleChangeNodeText) {
        handleChangeNodeText(nodeId, text);
      }
    }

    // 添加平级节点
    function addNext(nodeKey: string) {
      if (nodeKey === startId) {
        return alert('根节点无法添加兄弟节点！');
      }
      if (uncontrolled) {
        const res = addNextNode(nodeMap, nodeKey);
        if (handleAddNext) {
          handleAddNext(nodeKey, res.addedNode);
        }
        setFocusedKey(res.addedNode._key);
        setNodeMap(res.nodes);
      } else {
        if (handleAddNext) {
          handleAddNext(nodeKey);
        }
      }
    }

    // 添加子节点
    function addChild(nodeKey: string) {
      if (uncontrolled) {
        const res = addChildNode(nodeMap, nodeKey);
        if (handleAddChild) {
          handleAddChild(nodeKey, res.addedNode);
        }
        setFocusedKey(res.addedNode._key);
        setExpandedNodeKey(nodeKey);
        setNodeMap(res.nodes);
      } else {
        if (handleAddChild) {
          handleAddChild(nodeKey);
        }
      }
    }

    // 删除节点
    function deletenode(nodeKey: string) {
      if (nodeKey === startId) {
        return alert('根节点不允许删除！');
      }

      if (uncontrolled) {
        let res = deleteNode(nodeMap, nodeKey);

        if (handleDeleteNode) {
          handleDeleteNode(nodeKey);
        }
        setFocusedKey(res.nextSelectNodeKey);
        setNodeMap(res.nodes);
      } else {
        if (handleDeleteNode) {
          handleDeleteNode(nodeKey);
        }
      }
    }

    // 節點上移
    // function shiftUp(nodeKey: string) {
    //   const res = changeSortList(nodeMap, nodeKey, 'up');

    //   if (res) {
    //     if (uncontrolled) {
    //       setNodeMap(res.nodes);
    //     } else {
    //       if (handleShiftUpDown) {
    //         handleShiftUpDown(nodeKey, res.brotherKeys, 'up');
    //       }
    //     }
    //   }
    // }

    // 節點下移
    // function shiftDown(nodeKey: string) {
    //   const res = changeSortList(nodeMap, nodeKey, 'down');
    //   if (res) {
    //     if (uncontrolled) {
    //       setNodeMap(res.nodes);
    //     } else {
    //       if (handleShiftUpDown) {
    //         handleShiftUpDown(nodeKey, res.brotherKeys, 'down');
    //       }
    //     }
    //   }
    // }

    function saveNodes() {
      return nodeMap;
    }

    function handleDrop() {
      const dragNodeId = sessionStorage.getItem('dragNodeId');
      const dropNodeId = sessionStorage.getItem('dropNodeId');
      if (!dragNodeId || !dropNodeId) {
        return;
      }
      const dragInfo: DragInfo = {
        dragNodeId: dragNodeId,
        dropNodeId: dropNodeId,
        placement: 'down',
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

    function handleKeyDown(key: string, nodeKey: string) {
      if (key === 'Enter') {
        addNext(nodeKey);
      } else if (key === 'Tab') {
        addChild(nodeKey);
      } else if (key === 'Backspace') {
        deletenode(nodeKey);
      }
    }

    return (
      <div
        className="menu-wrapper"
        style={{
          position: 'relative',
          width: '100%',
        }}
        // onKeyDown={(e: any) => handleKeyDown(e)}
      >
        {/* <Title
          node={
            nodeMap && startId && nodeMap[startId] ? nodeMap[startId] : null
          }
          handleChangeNodeText={changeText}
        /> */}
        {cnodes.map((node, index) => (
          <EditorItem
            key={`${index}_${node._key}`}
            startId={startId}
            indent={indent}
            node={node}
            themeColor={themeColor}
            showIcon={showIcon}
            disabled={disabled || false}
            focusedKey={focusedKey}
            handleClickNode={clickNode}
            handleDbClickNode={dbClickNode}
            handleClickExpand={handleExpand}
            handleChangeNodeText={changeText}
            handleClickIcon={clickIcon}
            handleDrop={handleDrop}
            handleClickDot={clickDot}
            handleKeyDown={handleKeyDown}
            compId={compId}
            isRoot={index === 0 ? true : false}
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

interface TitleProps {
  node: Node | null;
  handleChangeNodeText: Function;
}
function Title({ node, handleChangeNodeText }: TitleProps) {
  function saveText(e: React.FocusEvent<HTMLDivElement>) {
    if (!node) return;
    const value = e.target.innerText;
    if (value !== node.name) {
      handleChangeNodeText(node._key, value);
    }
  }

  return (
    <div
      className="t-editor"
      contentEditable="true"
      spellCheck="true"
      autoCapitalize="off"
      suppressContentEditableWarning={true}
      style={{
        color: '#16181a',
        fontSize: '34px',
        fontWeight: 600,
        lineHeight: '48px',
      }}
      onBlur={saveText}
    >
      {node?.name}
    </div>
  );
}
