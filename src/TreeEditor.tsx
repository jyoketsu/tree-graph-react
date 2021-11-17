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
  changeSortList,
  // pasteNode,
  dragSort,
  guid,
  getAncestor,
  addNodeNote,
  changeNodeNote,
  deleteNodeNote,
  toBrotherChild,
  moveCursor,
  toFatherBrother,
  getCursorIndex,
  isMobile,
} from './services/util';
import DragInfo from './interfaces/DragInfo';
import EditorItem from './components/nodeItem/EditorItem';
import AddItem from './components/nodeItem/AddItem';

const indent = 30;
// const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
const mobile = isMobile();

let quickCommandIndex: undefined | number;

export interface HandlePasteFile {
  (nodeKey: string, files: FileList): void;
}

export interface HandleAddNote {
  (nodeKey: string): void;
}

export interface HandleChangeNote {
  (nodeKey: string, note: string): void;
}

export interface HandleDeleteNote {
  (nodeKey: string): void;
}

export interface HandleDeleteAttach {
  (nodeKey: string, attachIndex: number): void;
}

interface HandleAddNext {
  (nodeKey: string, addedNode?: Node, value?: string): void;
}

interface TabAction {
  (nodeKey: string, targetKey: string, targetPlaceIndex?: number): void;
}

export interface HandleClickMore {
  (node: CNode, targetEl: HTMLElement): void;
}

interface HandleCommandChange {
  (nodeKey: string, command: string, value: string, addMode?: boolean): void;
}

export interface TreeEditorProps {
  // 节点
  nodes: NodeMap;
  // 根节点id
  startId: string;
  disabled?: boolean;
  themeColor?: string;
  backgroundColor?: string;
  cutColor?: string;
  // 默认focused的节点
  defaultFocusedId?: string;
  // 默认备注focused的节点
  defaultNoteFocusedNodeId?: string;
  //  非受控模式
  uncontrolled?: boolean;
  showIcon?: boolean;
  showPreviewButton?: boolean;
  quickCommandKey?: string;
  quickCommands?: string[];
  handleCommandChanged?: HandleCommandChange;
  handlePasteFiles: HandlePasteFile;
  handleDeleteAttach: HandleDeleteAttach;
  handleAddNote?: HandleAddNote;
  handleChangeNote?: HandleChangeNote;
  handleDeleteNote?: HandleDeleteNote;
  handleTabAction?: TabAction;
  handleClickExpand?: Function;
  handleClickNode?: Function;
  handleClickIcon?: Function;
  handleClickDot?: Function;
  handleChangeNodeText?: Function;
  handleAddNext?: HandleAddNext;
  handleAddChild?: Function;
  handleDeleteNode?: Function;
  handleShiftUpDown?: Function;
  handlePaste?: Function;
  handleDrag?: Function;
  handleClickMoreButton?: HandleClickMore;
  handleClickAddButton?: HandleClickMore;
  handleClickPreviewButton?: Function;
  ref?: any;
  collapseMode?: boolean;
}
export const TreeEditor = React.forwardRef(
  (
    {
      nodes,
      startId,
      disabled,
      themeColor = '#1CA8B3',
      backgroundColor = '#F5F5F5',
      defaultFocusedId,
      defaultNoteFocusedNodeId,
      uncontrolled = true,
      showIcon = true,
      showPreviewButton = true,
      quickCommandKey,
      quickCommands = [],
      handleCommandChanged,
      handlePasteFiles,
      handleDeleteAttach,
      handleAddNote,
      handleChangeNote,
      handleDeleteNote,
      handleTabAction,
      handleClickExpand,
      handleClickNode,
      handleClickIcon,
      handleClickDot,
      handleChangeNodeText,
      handleAddNext,
      handleAddChild,
      handleDeleteNode,
      handleShiftUpDown,
      // handlePaste,
      handleDrag,
      handleClickMoreButton,
      handleClickAddButton,
      handleClickPreviewButton,
      collapseMode,
    }: TreeEditorProps,
    ref
  ) => {
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
    const [noteFocusedKey, setNoteFocusedKey] = useState(
      defaultNoteFocusedNodeId
    );
    const [selectedAttachId, setSelectedAttachId] = useState('');

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
        0,
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
      setFocusedKey(defaultFocusedId);
    }, [defaultFocusedId]);

    useEffect(() => {
      quickCommandIndex = undefined;
    }, [focusedKey]);

    useEffect(() => {
      setNoteFocusedKey(defaultNoteFocusedNodeId);
    }, [defaultNoteFocusedNodeId]);

    // 单击节点
    function clickNode(node: CNode) {
      if (disabled) {
        return;
      }
      if (handleClickNode) {
        handleClickNode(node);
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
      if (disabled) {
        return;
      }
      if (uncontrolled) {
        let nodes = changeNodeText(nodeMap, nodeId, text);
        setNodeMap(nodes);
      }
      if (handleChangeNodeText) {
        handleChangeNodeText(nodeId, text);
      }
    }

    // 更改节点备注
    function changeNote(nodeId: string, text: string) {
      if (uncontrolled) {
        let nodes = changeNodeNote(nodeMap, nodeId, text);
        setNodeMap(nodes);
      }
      if (handleChangeNote) {
        handleChangeNote(nodeId, text);
      }
    }

    // 添加平级节点
    function addNext(nodeKey: string, value?: string) {
      if (nodeKey === startId) {
        return alert('根节点无法添加兄弟节点！');
      }
      if (uncontrolled) {
        const res = addNextNode(nodeMap, nodeKey, value);
        if (handleAddNext) {
          handleAddNext(nodeKey, res.addedNode, value);
        }
        setFocusedKey(res.addedNode._key);
        setNodeMap(res.nodes);
      } else {
        if (handleAddNext) {
          handleAddNext(nodeKey, undefined, value);
        }
      }
    }

    // 添加节点备注
    function addNote(nodeKey: string) {
      if (nodeKey === startId) {
        return;
      }
      if (uncontrolled) {
        const res = addNodeNote(nodeMap, nodeKey);
        if (handleAddNote) {
          handleAddNote(nodeKey);
        }
        setNoteFocusedKey(nodeKey);
        setNodeMap(res.nodes);
      } else {
        if (handleAddNote) {
          handleAddNote(nodeKey);
        }
      }
    }

    function deleteNote(nodeKey: string) {
      if (uncontrolled) {
        const res = deleteNodeNote(nodeMap, nodeKey);
        if (handleDeleteNote) {
          handleDeleteNote(nodeKey);
        }
        setNoteFocusedKey('');
        setFocusedKey(nodeKey);
        setNodeMap(res.nodes);
      } else {
        if (handleDeleteNote) {
          handleDeleteNote(nodeKey);
        }
      }
    }

    // 添加子节点
    function addChild(nodeKey: string, value?: string) {
      if (uncontrolled) {
        const res = addChildNode(nodeMap, nodeKey, value);
        if (handleAddChild) {
          handleAddChild(nodeKey, res.addedNode, value);
        }
        setFocusedKey(res.addedNode._key);
        setExpandedNodeKey(nodeKey);
        setNodeMap(res.nodes);
      } else {
        if (handleAddChild) {
          handleAddChild(nodeKey, undefined, value);
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

    // 将儿子变为弟弟
    function convertChildToBrother(nodeKey: string) {
      const node = nodeMap[nodeKey];
      if (!node) return;
      const father = nodeMap[node.father];
      if (!father) return;
      const sortList = father.sortList;
      if (!sortList.length) return;
      if (father._key === startId) {
        return;
      }
      const grandFather = nodeMap[father.father];
      if (!grandFather.sortList.length) return;

      const fatherIndex = grandFather.sortList.findIndex(
        item => item === father._key
      );

      if (uncontrolled) {
        const res = toFatherBrother(nodeMap, nodeKey);
        if (handleTabAction) {
          handleTabAction(nodeKey, grandFather._key, fatherIndex + 1);
        }
        setNodeMap(res.nodes);
      } else {
        if (handleTabAction) {
          handleTabAction(nodeKey, grandFather._key, fatherIndex + 1);
        }
      }
    }

    function switchNodeToBrotherChild(
      nodeIndex: number,
      nodeKey: string,
      brotherKey: string
    ) {
      if (uncontrolled) {
        let res = toBrotherChild(nodeMap, nodeIndex, nodeKey, brotherKey);
        if (handleTabAction) {
          handleTabAction(nodeKey, brotherKey);
        }
        setNodeMap(res.nodes);
      } else {
        if (handleTabAction) {
          handleTabAction(nodeKey, brotherKey);
        }
      }
    }

    // 節點上移
    function shiftUp(nodeKey: string) {
      const res = changeSortList(nodeMap, nodeKey, 'up');

      if (res) {
        if (uncontrolled) {
          setNodeMap(res.nodes);
          setFocusedKey(nodeKey);
        } else {
          if (handleShiftUpDown) {
            handleShiftUpDown(nodeKey, res.brotherKeys, 'up');
          }
        }
      }
    }

    // 節點下移
    function shiftDown(nodeKey: string) {
      const res = changeSortList(nodeMap, nodeKey, 'down');
      if (res) {
        if (uncontrolled) {
          setNodeMap(res.nodes);
          setFocusedKey(nodeKey);
        } else {
          if (handleShiftUpDown) {
            handleShiftUpDown(nodeKey, res.brotherKeys, 'down');
          }
        }
      }
    }

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
    /**
     * 动作指令
     * @param command
     * @param nodeKey
     * @param value
     * @param addMode 是否是最后一行的新增
     * @returns
     */
    function actionCommand(
      command: string,
      nodeKey: string,
      value?: string,
      addMode?: boolean
    ) {
      if (disabled) {
        return;
      }
      if (command === 'AddNext') {
        // 添加弟弟节点
        addNext(nodeKey, value);
      } else if (command === 'AddChild') {
        // 添加子节点
        addChild(nodeKey, value);
      } else if (command === 'DeleteNode') {
        // 删除节点
        deletenode(nodeKey);
      } else if (command === 'AddNote') {
        // 添加节点备注
        addNote(nodeKey);
      } else if (command === 'DeleteNote') {
        // 删除节点备注
        deleteNote(nodeKey);
      } else if (command === 'up' || command === 'down') {
        const nextNode = moveCursor(command, cnodes, nodeKey);
        if (!nextNode) return;
        setFocusedKey(nextNode._key);
        if (handleClickNode) {
          handleClickNode(nextNode);
        }
      } else if (command === 'ShiftTab') {
        convertChildToBrother(nodeKey);
      } else if (command === 'shiftUp') {
        shiftUp(nodeKey);
      } else if (command === 'shiftDown') {
        shiftDown(nodeKey);
      } else if (command === 'BackspaceInHead') {
        const node = nodeMap[nodeKey];
        if (!node) return;
        const father = nodeMap[node.father];
        if (!father) return;
        const sortList = father.sortList;
        if (!sortList.length) return;
        const currentNodeIndex = sortList.findIndex(id => id === nodeKey);
        if (currentNodeIndex === -1 || currentNodeIndex === 0) return;
        const brother = nodeMap[sortList[currentNodeIndex - 1]];
        if (!brother) return;
        // 删除当前节点
        deletenode(nodeKey);
        // 更改哥哥节点名称
        changeText(brother._key, brother.name + node.name);
      } else if (command === 'ToBrotherChild') {
        const node = nodeMap[nodeKey];
        if (!node) return;
        const father = nodeMap[node.father];
        if (!father) return;
        const sortList = father.sortList;
        if (!sortList.length) return;
        const currentNodeIndex = sortList.findIndex(id => id === nodeKey);
        if (currentNodeIndex === -1 || currentNodeIndex === 0) return;
        const brother = nodeMap[sortList[currentNodeIndex - 1]];
        if (!brother) return;
        switchNodeToBrotherChild(currentNodeIndex, nodeKey, brother._key);
      } else if (command === quickCommandKey && handleCommandChanged) {
        quickCommandIndex = getCursorIndex();
        handleCommandChanged(nodeKey, 'open', value || '', addMode);
      } else if (
        quickCommandIndex !== undefined &&
        value &&
        handleCommandChanged
      ) {
        const cusorIndex = getCursorIndex();
        if (!cusorIndex) return;
        const command = value.substring(quickCommandIndex, cusorIndex);
        if (typeof cusorIndex === 'number' && cusorIndex < quickCommandIndex) {
          quickCommandIndex = undefined;
          handleCommandChanged(nodeKey, 'close', value, addMode);
        } else if (isCommandAvaliable(command)) {
          handleCommandChanged(nodeKey, command, value, addMode);
        } else {
          quickCommandIndex = undefined;
          handleCommandChanged(nodeKey, 'close', value, addMode);
        }
      }
    }

    function isCommandAvaliable(command: string) {
      for (let index = 0; index < quickCommands.length; index++) {
        const quickCommand = quickCommands[index];
        if (quickCommand.includes(command)) {
          return true;
        }
      }
      return false;
    }

    function handleClickMore(node: CNode, el: HTMLElement) {
      if (handleClickMoreButton) {
        handleClickMoreButton(node, el);
      }
    }

    function handleClickAdd(node: CNode, el: HTMLElement) {
      if (handleClickAddButton) {
        handleClickAddButton(node, el);
      }
    }

    function handleClickPreview(node: CNode) {
      if (handleClickPreviewButton) {
        handleClickPreviewButton(node);
      }
    }

    return (
      <div
        className="menu-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
          padding: '15px 0',
          backgroundColor: backgroundColor,
        }}
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
            node={node}
            themeColor={themeColor}
            backgroundColor={backgroundColor}
            showIcon={showIcon}
            showPreviewButton={showPreviewButton}
            focusedKey={focusedKey}
            noteFocusedKey={noteFocusedKey}
            selectedAttachId={selectedAttachId}
            handleClickNode={clickNode}
            handleClickExpand={handleExpand}
            handleChangeNodeText={changeText}
            handleClickIcon={clickIcon}
            handleDrop={handleDrop}
            handleClickDot={clickDot}
            actionCommand={actionCommand}
            handleClickAttach={attachId => setSelectedAttachId(attachId)}
            handlePasteFiles={handlePasteFiles}
            handleChangeNote={changeNote}
            handleDeleteAttach={handleDeleteAttach}
            clickMore={handleClickMore}
            clickPreview={handleClickPreview}
            compId={compId}
            isRoot={index === 0 ? true : false}
            isMobile={mobile}
            collapseMode={collapseMode}
            collapseModeCollapsed={
              collapseMode
                ? expandedNodeKey
                  ? !ancestorList.includes(node._key)
                  : true
                : undefined
            }
            disabled={disabled}
          />
        ))}
        {!disabled && cnodes[cnodes.length - 1] ? (
          <AddItem
            lastNode={cnodes[cnodes.length - 1]}
            isRoot={cnodes.length === 1 ? true : false}
            clickAdd={handleClickAdd}
            actionCommand={actionCommand}
          />
        ) : null}
      </div>
    );
  }
);
