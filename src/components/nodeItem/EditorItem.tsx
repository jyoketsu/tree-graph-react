import React, { useState, useRef, useEffect } from 'react';
import CNode from '../../interfaces/CNode';
import { textWidthAll } from '../../services/util';

interface HandleKeyDown {
  (key: string, nodeKey: string): void;
}

interface Props {
  node: CNode;
  startId: string;
  indent: number;
  themeColor: string;
  showIcon: boolean;
  disabled: boolean;
  handleClickNode: Function;
  handleDbClickNode: Function;
  handleClickExpand: Function;
  handleClickIcon: Function;
  handleClickDot: Function;
  handleChangeNodeText: Function;
  handleDrop: Function;
  handleKeyDown: HandleKeyDown;
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
  handleClickNode,
  handleDbClickNode,
  // handleClickExpand,
  handleClickIcon,
  handleClickDot,
  handleChangeNodeText,
  handleDrop,
  handleKeyDown,
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
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        handleClickNode(node);
      }}
      onDoubleClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        handleDbClickNode(node);
      }}
      style={{
        width: '100%',
        display: 'flex',
        paddingLeft: `${node.x - (node._key === startId ? indent : 0)}px`,
        fontSize: isRoot ? '34px' : '16px',
        color: isRoot ? '#16181a' : '#1d1d1f',
        lineHeight: isRoot ? '48px' : '26px',
        fontWeight: isRoot ? 600 : 'normal',
        boxSizing: 'border-box',
        borderStyle: 'solid',
        borderColor: themeColor,
        borderWidth: isDragOver ? '0 0 2px 0' : 0,
        opacity: dragStarted ? 0.8 : 1,
      }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropNode}
      onDragEnd={handleDragEnd}
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
        onBlur={saveText}
        onKeyDown={keyDown}
        ref={editorRef}
      >
        {nameLinkArr.length ? (
          <span>
            {nameLinkArr.map((name, index) => (
              <span
                key={index}
                style={{
                  textDecoration: name.type === 'link' ? 'underline' : 'unset',
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
  );
};
export default EditorItem;
