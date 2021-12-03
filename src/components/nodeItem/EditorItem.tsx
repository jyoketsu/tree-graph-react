import React, { useState, useRef, useEffect } from 'react';
import { HandleClickMore, HandleClickUpload, HandleDeleteAttach } from '../..';
import CNode from '../../interfaces/CNode';
import {
  getTextAfterCursor,
  isCursorHead,
  isCursorTail,
  mouseDirection,
  moveCursorToEnd,
  textWidthAll,
} from '../../services/util';
import { HandleChangeNote, HandlePasteFile } from '../../TreeEditor';
import Icon from '../icon';
import AttachItem from './AttachItem';
import ClickToUpload from './ClickToUpload';
import FileViewer from './FileViewer';
import LinkViewer from './LinkViewer';

const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

// 为了在删除节点后失去焦点不触发更改节点名
let deletable = false;
let composing = false;

interface ActionCommand {
  (command: string, nodeKey: string, value?: string): void;
}

interface HandleClickAttachFunc {
  (attachId: string): void;
}

interface HandleSetSelectionStart {
  (node: CNode | null): void;
}

interface HandleSetSelectionNodes {
  (nodes: string[]): void;
}

interface CheckFunc {
  (node: CNode, event: MouseEvent): void;
}

interface Props {
  node: CNode;
  frameSelectionStartedNode: CNode | null;
  selectionNodeKeys: string[];
  themeColor: string;
  backgroundColor: string;
  showIcon: boolean;
  showPreviewButton: boolean;
  selectedAttachId: string;
  handleClickNode: Function;
  handleClickExpand: Function;
  clickMore: HandleClickMore;
  clickPreview: Function;
  handleClickIcon: Function;
  handleClickDot: Function;
  handleChangeNodeText: Function;
  handleDrop: Function;
  actionCommand: ActionCommand;
  handleClickAttach: HandleClickAttachFunc;
  handlePasteFiles: HandlePasteFile;
  handleChangeNote: HandleChangeNote;
  handleDeleteAttach: HandleDeleteAttach;
  handleClickUpload: HandleClickUpload;
  handleSetSelectionStart: HandleSetSelectionStart;
  handleSetSelectionNodes: HandleSetSelectionNodes;
  handleCheck: CheckFunc;
  handleClickAvatar: Function;
  handleClickStatus: Function;
  compId: string;
  isRoot: boolean;
  isMobile: boolean;
  focusedKey?: string;
  noteFocusedKey?: string;
  collapseMode?: boolean;
  collapseModeCollapsed?: boolean;
  readonly?: boolean;
}
const EditorItem = ({
  node,
  frameSelectionStartedNode,
  selectionNodeKeys,
  themeColor,
  backgroundColor,
  showIcon,
  showPreviewButton,
  selectedAttachId,
  handleClickNode,
  handleClickExpand,
  clickMore,
  clickPreview,
  handleClickIcon,
  handleClickDot,
  handleChangeNodeText,
  handleDrop,
  actionCommand,
  handleClickAttach,
  handlePasteFiles,
  handleChangeNote,
  handleDeleteAttach,
  handleClickUpload,
  handleSetSelectionStart,
  handleSetSelectionNodes,
  handleCheck,
  handleClickAvatar,
  handleClickStatus,
  compId,
  isRoot,
  isMobile,
  focusedKey,
  noteFocusedKey,
  readonly,
}: // collapseMode,
// collapseModeCollapsed,
Props) => {
  const inSelection = selectionNodeKeys.includes(node._key);
  const isDragging = sessionStorage.getItem('isDragging');
  const editorRef = useRef<HTMLDivElement>(null);
  const noteEditorRef = useRef<HTMLDivElement>(null);
  const [dragStarted, setDragStarted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hover, sethover] = useState(false);
  const indentCount = node.x / 30;
  let fontSize = 16;
  if (isRoot) {
    fontSize = 34;
  } else if (readonly) {
    if (indentCount === 0) {
      fontSize = 24;
    } else if (indentCount === 1) {
      fontSize = 18;
    }
  }

  useEffect(() => {
    if (focusedKey === node._key && editorRef && editorRef.current) {
      handleClickNode(node);
      moveCursorToEnd(editorRef.current);
    }
  }, [focusedKey]);

  useEffect(() => {
    if (
      noteFocusedKey === node._key &&
      noteEditorRef &&
      noteEditorRef.current
    ) {
      moveCursorToEnd(noteEditorRef.current);
    }
  }, [noteFocusedKey, noteEditorRef.current]);

  function saveText(e: React.FocusEvent<HTMLDivElement>) {
    if (deletable) return;
    // 值（去除了换行符）
    const value = e.target.innerText.replace(/[\r\n]/g, '');
    if (value !== node.name) {
      handleChangeNodeText(node._key, value);
    }
  }

  function saveNote(e: React.FocusEvent<HTMLDivElement>) {
    if (deletable) return;
    const value = e.target.innerText;
    if (value !== node.note) {
      handleChangeNote(node._key, value);
    }
  }

  function keyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (composing) {
      return;
    }
    const commandKey = isMac ? event.metaKey : event.ctrlKey;
    if (commandKey && event.key === 'a' && selectionNodeKeys.length) {
      event.preventDefault();
      actionCommand('selectAll', node._key);
    } else if (event.shiftKey && event.key === 'Enter') {
      // shift+enter 添加节点备注
      event.preventDefault();
      if (node.note !== undefined) {
        if (!noteEditorRef || !noteEditorRef.current) return;
        noteEditorRef.current.focus();
        moveCursorToEnd(noteEditorRef.current);
      } else {
        actionCommand('AddNote', node._key);
      }
    } else if (event.shiftKey && event.key === 'Tab') {
      event.preventDefault();
      if (isRoot) return;
      actionCommand('ShiftTab', node._key);
    } else if (event.shiftKey && event.key === 'ArrowUp') {
      event.preventDefault();
      actionCommand('shiftUp', node._key);
    } else if (event.shiftKey && event.key === 'ArrowDown') {
      event.preventDefault();
      actionCommand('shiftDown', node._key);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (isRoot) {
        // 根节点按Enter，相当于添加子节点
        actionCommand('AddChild', node._key);
      } else if (editorRef && editorRef.current) {
        const valuePart2 = getTextAfterCursor(editorRef.current);
        if (valuePart2) {
          // 如果光标后有文字，则分割成两段文字同时生成2条节点
          const value = editorRef.current.innerText.replace(/[\r\n]/g, '');
          const valuePart1 = value.replace(valuePart2, '');
          editorRef.current.innerText = valuePart1;
          handleChangeNodeText(node._key, valuePart1);
          actionCommand('AddNext', node._key, valuePart2);
        } else {
          actionCommand('AddNext', node._key);
        }
      } else {
        actionCommand('AddNext', node._key);
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      actionCommand('ToBrotherChild', node._key);
    } else if (event.key === 'Backspace') {
      const value = event.currentTarget.innerText.replace(/[\r\n]/g, '');
      if (!value) {
        // 按后退删除文字，当没有文字时，触发删除节点
        deletable = true;
        actionCommand('DeleteNode', node._key);
      } else {
        // 有文字
        const head = isCursorHead();
        if (head) {
          // 在头部按后退
          deletable = true;
          actionCommand('BackspaceInHead', node._key);
        } else {
          deletable = false;
        }
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      actionCommand('up', node._key);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      actionCommand('down', node._key);
    } else if (event.key === 'ArrowLeft') {
      sessionStorage.removeItem('cursorInTail');
      const isHead = isCursorHead();
      if (isHead) {
        actionCommand('up', node._key);
      }
    } else if (event.key === 'ArrowRight') {
      if (editorRef && editorRef.current) {
        const isTail = isCursorTail(editorRef.current);
        if (isTail) {
          actionCommand('down', node._key);
        }
      }
      sessionStorage.removeItem('cursorInTail');
    } else {
      deletable = false;
    }
  }

  function keyUp(event: React.KeyboardEvent<HTMLDivElement>) {
    if (composing) {
      return;
    }
    if (editorRef && editorRef.current) {
      const value = editorRef.current.innerText.replace(/[\r\n]/g, '');
      actionCommand(event.key, node._key, value);
    }
  }

  function noteKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Backspace') {
      const value = event.currentTarget.innerText;
      if (!value) {
        deletable = true;
        actionCommand('DeleteNote', node._key);
      } else {
        deletable = false;
      }
    } else {
      deletable = false;
    }
  }

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.dropEffect = 'move';
    setDragStarted(true);
    sessionStorage.setItem('isDragging', 'true');
    sessionStorage.setItem('dragNodeId', node._key);
    sessionStorage.setItem('cross-comp-drag', node._key);
    sessionStorage.setItem('cross-drag-compId', compId);
  }

  function handleDropNode(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    sessionStorage.removeItem('isDragging');
    const files = e.dataTransfer.files;
    if (files.length) {
      handlePasteFiles(node._key, files);
    } else {
      sessionStorage.setItem('dropNodeId', node._key);
      handleDrop();
      sessionStorage.removeItem('cross-comp-drag');
      sessionStorage.removeItem('cross-drag-compId');
    }
  }

  function handleDragOver(e: React.MouseEvent) {
    if (!node.disabled) {
      e.preventDefault();
    }

    if (!isDragOver) {
      setIsDragOver(true);
    }
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }
  function handleDragEnd() {
    setDragStarted(false);
    sessionStorage.removeItem('isDragging');
  }
  function handleClickLink(type: string, url: string) {
    if (type === 'link') {
      if (url.includes('http')) {
        window.open(url, '_blank');
      } else {
        window.open(`http://${url}`, '_blank');
      }
    }
  }

  function handlePaste(event: React.ClipboardEvent) {
    if (event.clipboardData.files.length) {
      event.preventDefault();
      let files = event.clipboardData.files;
      handlePasteFiles(node._key, files);
    }
  }

  function handleCopy(event: React.ClipboardEvent) {
    if (selectionNodeKeys.length) {
      event.preventDefault();
      actionCommand('copy-selection', node._key);
    }
  }

  function handleClickMore(event: React.MouseEvent<HTMLDivElement>) {
    clickMore(node, event.currentTarget);
    // if (editorRef && editorRef.current) {
    //   clickMore(node, editorRef.current);
    // }
  }

  function handleMouseEnter(e: React.MouseEvent) {
    sethover(true);
    if (frameSelectionStartedNode) {
      const res = mouseDirection(e.currentTarget, e.nativeEvent);
      const nodes = [...selectionNodeKeys];
      if (!nodes.includes(frameSelectionStartedNode._key)) {
        nodes.unshift(frameSelectionStartedNode._key);
      }
      if (
        (node.y < frameSelectionStartedNode.y && res === 'bottom') ||
        (node.y > frameSelectionStartedNode.y && res === 'top')
      ) {
        handleSetSelectionNodes([...nodes, node._key]);
      }
    }
  }

  function handleMouseLeave(e: React.MouseEvent) {
    sethover(false);
    if (frameSelectionStartedNode) {
      const res = mouseDirection(e.currentTarget, e.nativeEvent);
      if (
        (node.y < frameSelectionStartedNode.y && res === 'bottom') ||
        (node.y > frameSelectionStartedNode.y && res === 'top')
      ) {
        const nodes = [...selectionNodeKeys];
        const index = nodes.findIndex(item => item === node._key);
        nodes.splice(index, 1);
        handleSetSelectionNodes(nodes);
      }
    }
  }

  function handleMouseDown() {
    handleSetSelectionNodes([]);
    handleSetSelectionStart(node);
  }

  function handleMouseUp() {
    handleSetSelectionStart(null);
  }

  const urlReg = /((\w{1,}\.+)+(com|cn|org|net|info)\/*[\w\/\?=&%]*)|(http:\/\/(\w{1,}\.+)+(com|cn|org|net|info)\/*[\w\/\?=&%]*)|(https:\/\/(\w{1,}\.+)+(com|cn|org|net|info)\/*[\w\/\?=&%]*)/g;
  let nameLinkArr = [];
  if (urlReg.test(node.name)) {
    let arr1: string[] = [];
    const matchList = node.name.match(urlReg);
    if (matchList) {
      let tempText = node.name;
      let textList = [];
      for (let index = 0; index < matchList.length; index++) {
        const element = matchList[index];
        tempText = tempText.replace(element, '!@#');
      }
      textList = tempText.split('!@#');
      for (let index = 0; index < textList.length; index++) {
        const text = textList[index];
        arr1.push(text);
        if (matchList[index]) {
          arr1.push(matchList[index]);
        }
      }
    }

    let marginLeft = 0;
    let count = 0;
    if (arr1 && arr1.length) {
      for (let index = 0; index < arr1.length; index++) {
        let name = arr1[index];
        if (index !== 0) {
          marginLeft += textWidthAll(16, arr1[index - 1]);
        }
        let type = urlReg.test(name) ? 'link' : 'text';

        let shortedName = '';
        if (node.shorted) {
          for (let index = 0; index < name.length; index++) {
            if (count < 28) {
              const char = name[index];
              // 全角
              if (char.match(/[^\x00-\xff]/g)) {
                count++;
              } else {
                count += 0.5;
              }
              shortedName += char;
            } else {
              break;
            }
          }
          if (count >= 28) {
            shortedName = `${shortedName}...`;
          }
        }
        if (count >= 28) {
          nameLinkArr.push({
            text: name,
            shortedName,
            type,
            marginLeft,
          });
          break;
        } else {
          nameLinkArr.push({
            text: name,
            type,
            marginLeft,
          });
        }
      }
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        paddingLeft: isMobile ? '35px' : '55px',
        paddingRight: '35px',
        boxSizing: 'border-box',
        borderStyle: 'solid',
        borderColor: themeColor,
        borderWidth:
          isDragging && isDragOver ? '0 0 2px 0' : isDragOver ? '2px' : '0',
        opacity: dragStarted ? 0.8 : 1,
        overflow: 'hidden',
      }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        sessionStorage.removeItem('cursorInTail');
        handleClickNode(node);
      }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropNode}
      onDragEnd={handleDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {Array.from(new Array(indentCount).keys()).map(item => (
        <div
          key={item}
          style={{
            marginLeft: '9px',
            width: '27px',
            flexShrink: 0,
            borderLeft: !readonly ? '1px solid #DEDEE1' : 'unset',
          }}
        ></div>
      ))}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          flexShrink: 0,
          backgroundColor: inSelection ? '#B1D3FA' : 'unset',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            fontSize: `${fontSize}px`,
            lineHeight: `${fontSize * 2}px`,
            color: isRoot ? '#16181a' : '#1d1d1f',
            fontWeight: isRoot ? 600 : 'normal',
          }}
        >
          <div
            style={{
              position: 'relative',
              height: `${fontSize * 2}px`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* 左侧操作按钮 */}
            <div
              style={{
                position: 'absolute',
                width: '54px',
                left: '-54px',
                top: 0,
                height: `${fontSize * 2}px`,
                display: 'flex',
                flexDirection: 'row-reverse',
                alignItems: 'center',
              }}
            >
              {!readonly && !isRoot ? (
                <div
                  onClick={handleClickMore}
                  style={{ backgroundColor, opacity: hover ? 1 : 0 }}
                >
                  <Icon
                    width="18px"
                    height="18px"
                    name="more"
                    fill="#b2b3b4"
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ) : null}
              {showPreviewButton && !isRoot ? (
                <div
                  style={{ backgroundColor, opacity: hover ? 1 : 0 }}
                  onClick={() => clickPreview(node)}
                >
                  <Icon
                    width="18px"
                    height="18px"
                    name="preview"
                    fill="#b2b3b4"
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ) : null}
              {/* 折叠按钮 */}
              {node.sortList.length && !isMobile ? (
                <div
                  onClick={e => {
                    e.stopPropagation();
                    handleClickExpand(node);
                  }}
                  style={{ backgroundColor, opacity: hover ? 1 : 0 }}
                >
                  <Icon
                    width={isRoot ? '28px' : '18px'}
                    height={isRoot ? '28px' : '18px'}
                    name={node.contract ? 'collapsed' : 'collapse'}
                    fill="#b2b3b4"
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ) : null}
            </div>
            {/* 小圆点 */}
            {!isRoot && !readonly ? (
              <div
                draggable
                style={{
                  position: 'relative',
                  height: `${fontSize * 2}px`,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '8px',
                }}
                onClick={e => {
                  e.stopPropagation();
                  handleClickDot(node);
                }}
              >
                <svg width={18} height={18} viewBox={`0,0,${18},${18}`}>
                  {node.contract ? (
                    <circle
                      id="dot-hover"
                      cx={9}
                      cy={9}
                      r={9}
                      fill="#dddfe2"
                      cursor="pointer"
                      fillOpacity={1}
                    />
                  ) : null}
                  <circle
                    id="dot"
                    cx={9}
                    cy={9}
                    r={4}
                    fill="#66666D"
                    fillOpacity={1}
                    cursor="pointer"
                  />
                </svg>
              </div>
            ) : null}

            {/* 圖標 */}
            {showIcon && node.icon && !isRoot ? (
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  backgroundImage: `url("${node.icon}")`,
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  flexShrink: 0,
                  marginRight: '5px',
                }}
                onClick={() => handleClickIcon(node)}
              ></div>
            ) : null}
            {/* 头像 */}
            {node.avatarUri ? (
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '11px',
                  backgroundImage: `url("${node.avatarUri}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  marginRight: '2px',
                }}
                onClick={(event: React.MouseEvent) =>
                  handleClickAvatar(node, event)
                }
              ></div>
            ) : null}
            {/* checkbox */}
            {node.showCheckbox ? (
              <CheckBox
                checked={node.checked}
                onClick={(event: any) => handleCheck(node, event)}
              />
            ) : null}
            {node.showStatus ? (
              <Status
                task={node}
                onClick={(event: React.MouseEvent) =>
                  handleClickStatus(node, event)
                }
              />
            ) : null}
          </div>

          {/* 文字 */}
          <div
            id={`node-${node._key}`}
            className="t-editor node-editor"
            contentEditable={readonly ? false : true}
            spellCheck="true"
            autoCapitalize="off"
            suppressContentEditableWarning={true}
            ref={editorRef}
            onBlur={saveText}
            onKeyDown={keyDown}
            onKeyUp={keyUp}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onCompositionStart={() => (composing = true)}
            onCompositionEnd={() => (composing = false)}
          >
            {nameLinkArr.length ? (
              <span>
                {nameLinkArr.map((name, index) => (
                  <span
                    key={index}
                    style={{
                      textDecoration:
                        name.type === 'link' ? 'underline' : 'unset',
                      cursor: name.type === 'link' ? 'pointer' : 'text',
                      color: name.type === 'link' ? themeColor : 'inherit',
                    }}
                    onClick={() => handleClickLink(name.type, name.text)}
                  >
                    {name.text || ''}
                  </span>
                ))}
              </span>
            ) : (
              node.name
            )}
          </div>
        </div>
        {/* 如果是文件类型的节点且url未设定 */}
        {(node.type === 'file' || node.type === 'link') && !node.url ? (
          <div
            style={{
              marginLeft: '9px',
              paddingLeft: '16px',
            }}
          >
            <ClickToUpload
              nodeKey={node._key}
              type={node.type}
              handleClickUpload={handleClickUpload}
            />
          </div>
        ) : null}
        {/* 文件类节点预览 */}
        {node.type === 'file' && node.fileType && node.url ? (
          <div
            style={{
              marginLeft: '9px',
              paddingLeft: '16px',
            }}
          >
            <FileViewer fileType={node.fileType} url={node.url} />
          </div>
        ) : null}
        {/* 链接类型节点预览 */}
        {node.type === 'link' && node.linkType && node.url ? (
          <div
            style={{
              marginLeft: '9px',
              paddingLeft: '16px',
            }}
          >
            <LinkViewer linkType={node.linkType} url={node.url} />
          </div>
        ) : null}
        {/* 附件 */}
        <div
          style={{
            marginLeft: '9px',
            paddingLeft: '16px',
            borderLeft: '1px solid #DEDEE1',
          }}
        >
          {(node.attach || []).map((attach, index) => (
            <AttachItem
              key={`${node._key}-${index}-${attach.name}`}
              id={`${node._key}-${index}-${attach.name}`}
              attachIndex={index}
              nodeKey={node._key}
              attach={attach}
              selectedAttachId={selectedAttachId}
              themeColor={themeColor}
              handleClick={handleClickAttach}
              handleDeleteAttach={handleDeleteAttach}
            />
          ))}
          <div
            className={`t-editor item-note ${readonly ? 'readonly' : ''}`}
            contentEditable={readonly ? false : true}
            spellCheck="true"
            autoCapitalize="off"
            suppressContentEditableWarning={true}
            style={{
              fontSize: '14px',
              color: '#797B7C',
              lineHeight: node.note !== undefined ? '22px' : 0,
            }}
            ref={noteEditorRef}
            onBlur={saveNote}
            onKeyDown={noteKeyDown}
            onPaste={handlePaste}
          >
            {node.note}
          </div>
        </div>
      </div>
      {/* 右侧操作按钮 */}
      {isMobile ? (
        <div
          style={{
            position: 'absolute',
            width: '54px',
            right: '-18px',
            top: 0,
            height: isRoot ? '68px' : '30px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* 折叠按钮 */}
          {node.sortList.length ? (
            <div
              onClick={e => {
                e.stopPropagation();
                handleClickExpand(node);
              }}
            >
              <Icon
                width="26px"
                height="26px"
                name={node.contract ? 'collapsed' : 'collapse'}
                fill="#b2b3b4"
                style={{ cursor: 'pointer' }}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

interface CheckBoxProps {
  checked?: boolean;
  onClick: React.MouseEventHandler;
}

function CheckBox({ checked, onClick }: CheckBoxProps) {
  return checked ? (
    <svg
      width="18"
      height="18"
      viewBox="0,0,18,18"
      preserveAspectRatio="xMinYMin meet"
      style={{ marginRight: '2px' }}
      onClick={onClick}
    >
      <circle cx="9" cy="9" r="9" fill="rgb(85, 85, 85)" />
      <path d="M 4 9 L 8 13 L 14 5" stroke="#fff" strokeWidth="1.6" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0,0,18,18"
      preserveAspectRatio="xMinYMin meet"
      style={{ marginRight: '5px' }}
      onClick={onClick}
    >
      <circle cx="9" cy="9" r="9" fill="rgb(216, 216, 216)" stroke="#000000" />
    </svg>
  );
}

interface StatusProps {
  task: CNode;
  onClick: React.MouseEventHandler;
}
function Status({ task, onClick }: StatusProps) {
  const now = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  let limitDayNum: number | string = task.limitDay
    ? task.limitDay - now > 0
      ? Math.floor((task.limitDay - now) / 86400000)
      : Math.ceil((task.limitDay - now) / 86400000) - 1
    : 0;
  return (
    <div
      style={{
        width: '20px',
        height: '20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        userSelect: 'none',
        color: '#FFF',
        marginRight: '2px',
        backgroundColor: task.checked
          ? '#b6b7b7'
          : limitDayNum > 0
          ? limitDayNum === 1
            ? '#FFB11B'
            : '#505050'
          : limitDayNum < 0
          ? '#E16B8C'
          : '#505050',
      }}
      onClick={onClick}
    >
      <div
        style={{
          width: 0,
          height: 0,
          borderWidth: '18px',
          borderStyle: 'solid',
          position: 'absolute',
          top: '0px',
          right: '-18px',
          borderColor: '#35A6F8 transparent transparent',
        }}
      ></div>
      <span
        style={{
          width: '15px',
          display: 'inline-block',
          textSizeAdjust: 'none',
          fontSize: '12px',
          transform: 'scale(0.67)',
          lineHeight: '8px',
          position: 'absolute',
          right: 0,
          top: '1px',
        }}
      >
        {task.hour || '-'}
      </span>
      <span
        style={{
          display: 'inline-block',
          textSizeAdjust: 'none',
          fontSize: '12px',
          transform: 'scale(0.83,0.83)',
          width: '15px',
          lineHeight: '10px',
          position: 'absolute',
          left: '2px',
          bottom: '1px',
        }}
      >
        {limitDayNum
          ? Math.abs(limitDayNum) <= 99
            ? Math.abs(limitDayNum)
            : '99+'
          : '∞'}
      </span>
    </div>
  );
}
export default EditorItem;
