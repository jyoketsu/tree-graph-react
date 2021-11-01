import React, { useState, useRef, useEffect } from 'react';
import CNode from '../../interfaces/CNode';
import { textWidthAll } from '../../services/util';
import { HandlePasteFile } from '../../TreeEditor';
import AttachItem from './AttachItem';

interface HandleKeyDown {
  (key: string, nodeKey: string): void;
}

interface HandleClickAttachFunc {
  (attachId: string): void;
}

interface Props {
  node: CNode;
  startId: string;
  indent: number;
  themeColor: string;
  showIcon: boolean;
  disabled: boolean;
  selectedAttachId: string;
  handleClickNode: Function;
  handleClickExpand: Function;
  handleClickIcon: Function;
  handleClickDot: Function;
  handleChangeNodeText: Function;
  handleDrop: Function;
  handleKeyDown: HandleKeyDown;
  handleClickAttach: HandleClickAttachFunc;
  handlePasteFiles: HandlePasteFile;
  compId: string;
  isRoot: boolean;
  focusedKey?: string;
  collapseMode?: boolean;
  collapseModeCollapsed?: boolean;
}
const EditorItem = ({
  node,
  startId,
  indent,
  themeColor,
  showIcon,
  disabled,
  selectedAttachId,
  handleClickNode,
  // handleClickExpand,
  handleClickIcon,
  handleClickDot,
  handleChangeNodeText,
  handleDrop,
  handleKeyDown,
  handleClickAttach,
  handlePasteFiles,
  compId,
  isRoot,
  focusedKey,
}: // collapseMode,
// collapseModeCollapsed,
Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [dragStarted, setDragStarted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (focusedKey === node._key && editorRef && editorRef.current) {
      if (window.getSelection) {
        handleClickNode(node);
        editorRef.current.focus(); //解决ff不获取焦点无法定位问题
        const range = window.getSelection(); //创建range
        if (range) {
          range.selectAllChildren(editorRef.current); //range 选择obj下所有子内容
          range.collapseToEnd(); //光标移至最后
        }
      }
    }
  }, [focusedKey]);

  function saveText(e: React.FocusEvent<HTMLDivElement>) {
    // 值（去除了换行符）
    const value = e.target.innerText.replace(/[\r\n]/g, '');
    if (value !== node.name) {
      handleChangeNodeText(node._key, value);
    }
  }

  function keyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      handleKeyDown(event.key, node._key);
    }

    if (event.key === 'Backspace' && !node.sortList.length) {
      const value = event.currentTarget.innerText.replace(/[\r\n]/g, '');
      if (!value) {
        handleKeyDown(event.key, node._key);
      }
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
        paddingLeft: `${node.x - (node._key === startId ? indent : 0)}px`,
        boxSizing: 'border-box',
        borderStyle: 'solid',
        borderColor: themeColor,
        borderWidth: isDragOver ? '0 0 2px 0' : 0,
        opacity: dragStarted ? 0.8 : 1,
      }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        handleClickNode(node);
      }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropNode}
      onDragEnd={handleDragEnd}
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
            style={{ marginRight: '12px', flexShrink: 0 }}
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
          className="t-editor"
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
      {node.attach || node.note ? (
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
              attach={attach}
              selectedAttachId={selectedAttachId}
              themeColor={themeColor}
              handleClick={handleClickAttach}
            />
          ))}
          {node.note ? (
            <div
              className="t-editor item-note"
              contentEditable="true"
              spellCheck="true"
              autoCapitalize="off"
              suppressContentEditableWarning={true}
              style={{ fontSize: '14px', color: '#797B7C' }}
            >
              {node.note}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
export default EditorItem;
