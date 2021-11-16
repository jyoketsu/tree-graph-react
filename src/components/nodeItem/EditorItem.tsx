import React, { useState, useRef, useEffect } from 'react';
import { HandleClickMore, HandleDeleteAttach } from '../..';
import CNode from '../../interfaces/CNode';
import {
  getTextAfterCursor,
  isCursorHead,
  isCursorTail,
  moveCursorToEnd,
  textWidthAll,
} from '../../services/util';
import { HandleChangeNote, HandlePasteFile } from '../../TreeEditor';
import Icon from '../icon';
import AttachItem from './AttachItem';

// 为了在删除节点后失去焦点不触发更改节点名
let deletable = false;
let composing = false;

interface ActionCommand {
  (command: string, nodeKey: string, value?: string): void;
}

interface HandleClickAttachFunc {
  (attachId: string): void;
}

interface Props {
  node: CNode;
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
  compId: string;
  isRoot: boolean;
  focusedKey?: string;
  noteFocusedKey?: string;
  collapseMode?: boolean;
  collapseModeCollapsed?: boolean;
}
const EditorItem = ({
  node,
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
  compId,
  isRoot,
  focusedKey,
  noteFocusedKey,
}: // collapseMode,
// collapseModeCollapsed,
Props) => {
  const isDragging = sessionStorage.getItem('isDragging');
  const editorRef = useRef<HTMLDivElement>(null);
  const noteEditorRef = useRef<HTMLDivElement>(null);
  const [dragStarted, setDragStarted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hover, sethover] = useState(false);
  const indentCount = node.x / 30;

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
    if (event.shiftKey && event.key === 'Enter') {
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
    } else if (event.key === 'Backspace' && !node.sortList.length) {
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

  function handleClickMore(event: React.MouseEvent<HTMLDivElement>) {
    clickMore(node, event.currentTarget);
    // if (editorRef && editorRef.current) {
    //   clickMore(node, editorRef.current);
    // }
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

  // let collapsed;
  // if (collapseMode) {
  //   collapsed = collapseModeCollapsed;
  // } else {
  //   collapsed = node.contract;
  // }

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        // paddingLeft: `${node.x - (node._key === startId ? indent : 0)}px`,
        // paddingLeft: `${node.x + 35}px`,
        paddingLeft: '35px',
        paddingRight: '35px',
        boxSizing: 'border-box',
        borderStyle: 'solid',
        borderColor: themeColor,
        borderWidth:
          isDragging && isDragOver ? '0 0 2px 0' : isDragOver ? '2px' : '0',
        opacity: dragStarted ? 0.8 : 1,
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
      onMouseEnter={() => sethover(true)}
      onMouseLeave={() => sethover(false)}
    >
      {Array.from(new Array(indentCount).keys()).map(item => (
        <div
          key={item}
          style={{
            marginLeft: '9px',
            width: '27px',
            flexShrink: 0,
            borderLeft: '1px solid #DEDEE1',
          }}
        ></div>
      ))}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            fontSize: isRoot ? '34px' : '16px',
            color: isRoot ? '#16181a' : '#1d1d1f',
            lineHeight: isRoot ? '48px' : '30px',
            fontWeight: isRoot ? 600 : 'normal',
          }}
        >
          <div
            style={{
              position: 'relative',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {!isRoot ? (
              <div
                style={{
                  position: 'absolute',
                  width: '54px',
                  left: '-54px',
                  top: 0,
                  height: '30px',
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                }}
              >
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
                {showPreviewButton ? (
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
                {node.sortList.length ? (
                  <div
                    onClick={e => {
                      e.stopPropagation();
                      handleClickExpand(node);
                    }}
                    style={{ backgroundColor, opacity: hover ? 1 : 0 }}
                  >
                    <Icon
                      width="18px"
                      height="18px"
                      name={node.contract ? 'collapsed' : 'collapse'}
                      fill="#b2b3b4"
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
            {/* 小圆点 */}
            {!isRoot ? (
              <div
                draggable
                style={{
                  position: 'relative',
                  height: '30px',
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
          </div>

          {/* 文字 */}
          <div
            className="t-editor node-editor"
            contentEditable="true"
            spellCheck="true"
            autoCapitalize="off"
            suppressContentEditableWarning={true}
            ref={editorRef}
            onBlur={saveText}
            onKeyDown={keyDown}
            onKeyUp={keyUp}
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
            className="t-editor item-note"
            contentEditable="true"
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
    </div>
  );
};
export default EditorItem;
