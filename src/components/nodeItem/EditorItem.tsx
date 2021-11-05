import React, { useState, useRef, useEffect } from 'react';
import { HandleClickMore, HandleDeleteAttach } from '../..';
import CNode from '../../interfaces/CNode';
import {
  getTextAfterCursor,
  moveCursorToEnd,
  textWidthAll,
} from '../../services/util';
import { HandleChangeNote, HandlePasteFile } from '../../TreeEditor';
import Icon from '../icon';
import AttachItem from './AttachItem';

let deletable = false;

interface ActionCommand {
  (command: string, nodeKey: string, value?: string): void;
}

interface HandleClickAttachFunc {
  (attachId: string): void;
}

interface Props {
  node: CNode;
  themeColor: string;
  showIcon: boolean;
  disabled: boolean;
  selectedAttachId: string;
  handleClickNode: Function;
  handleClickExpand: Function;
  clickMore: HandleClickMore;
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
  showIcon,
  disabled,
  selectedAttachId,
  handleClickNode,
  handleClickExpand,
  clickMore,
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
  const editorRef = useRef<HTMLDivElement>(null);
  const noteEditorRef = useRef<HTMLDivElement>(null);
  const [dragStarted, setDragStarted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hover, sethover] = useState(false);

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
    if (event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      if (node.note !== undefined) {
        if (!noteEditorRef || !noteEditorRef.current) return;
        noteEditorRef.current.focus();
        moveCursorToEnd(noteEditorRef.current);
      } else {
        actionCommand('AddNote', node._key);
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (editorRef && editorRef.current) {
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
      const value = event.currentTarget.innerText.replace(/[\r\n]/g, '');
      if (value) {
        actionCommand('AddChild', node._key);
      } else {
        // 空白结点按Tab，将当前结点转换为哥哥结点的最后一个子结点。
        actionCommand('ToBrotherChild', node._key);
      }
    } else if (event.key === 'Backspace' && !node.sortList.length) {
      const value = event.currentTarget.innerText.replace(/[\r\n]/g, '');
      if (!value) {
        deletable = true;
        actionCommand(event.key, node._key);
      } else {
        deletable = false;
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      actionCommand('up', node._key);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      actionCommand('down', node._key);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      sessionStorage.removeItem('cursorInTail');
    } else {
      deletable = false;
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
    sessionStorage.setItem('dragNodeId', node._key);
    sessionStorage.setItem('cross-comp-drag', node._key);
    sessionStorage.setItem('cross-drag-compId', compId);
  }

  function handleDropNode() {
    setIsDragOver(false);
    sessionStorage.setItem('dropNodeId', node._key);
    handleDrop();
    sessionStorage.removeItem('cross-comp-drag');
    sessionStorage.removeItem('cross-drag-compId');
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
        position: 'relative',
        // paddingLeft: `${node.x - (node._key === startId ? indent : 0)}px`,
        paddingLeft: `${node.x + 35}px`,
        paddingRight: '35px',
        boxSizing: 'border-box',
        borderStyle: 'solid',
        borderColor: themeColor,
        borderWidth: isDragOver ? '0 0 2px 0' : 0,
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
      <div
        style={{
          width: '100%',
          display: 'flex',
          fontSize: isRoot ? '34px' : '16px',
          color: isRoot ? '#16181a' : '#1d1d1f',
          lineHeight: isRoot ? '48px' : '26px',
          fontWeight: isRoot ? 600 : 'normal',
        }}
      >
        {/* 小圆点 */}
        {!isRoot ? (
          <div
            draggable={disabled || node.disabled ? false : true}
            style={{
              height: '26px',
              marginRight: '12px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={e => {
              e.stopPropagation();
              handleClickDot(node);
            }}
          >
            <svg width={8} height={8} viewBox={`0,0,${8},${8}`}>
              <circle
                id="dot"
                cx={4}
                cy={4}
                r={4}
                fill="#D3D3D3"
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
              marginRight: '4px',
              flexShrink: 0,
            }}
            onClick={() => handleClickIcon(node)}
          ></div>
        ) : null}

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
          onPaste={handlePaste}
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
          marginLeft: '4px',
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
      {!isRoot && hover ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '26px',
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
                width="18px"
                height="18px"
                name={node.contract ? 'collapsed' : 'collapse'}
                fill="#b2b3b4"
                style={{ cursor: 'pointer' }}
              />
            </div>
          ) : null}
          <div onClick={handleClickMore}>
            <Icon
              width="18px"
              height="18px"
              name="more"
              fill="#b2b3b4"
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default EditorItem;
