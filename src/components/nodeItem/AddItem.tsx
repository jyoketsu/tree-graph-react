import React, { useState, useRef, useEffect } from 'react';
import CNode from '../../interfaces/CNode';
import { HandleClickMore } from '../../TreeEditor';
import Icon from '../icon';

// 为了在删除节点后失去焦点不触发更改节点名
let composing = false;
let nodeAddable = true;

interface ActionCommand {
  (command: string, nodeKey: string, value?: string, addMode?: boolean): void;
}

interface Props {
  lastNode: CNode;
  isRoot: boolean;
  clickAdd: HandleClickMore;
  actionCommand: ActionCommand;
}
const AddItem = ({ lastNode, isRoot, clickAdd, actionCommand }: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [hover, sethover] = useState(false);
  const [value, setvalue] = useState('');
  const [focused, setFocused] = useState(false);
  const indentCount = lastNode.x / 30;

  useEffect(() => {
    nodeAddable = true;
    setvalue('');
    if (editorRef && editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  }, [lastNode]);

  function addNode(e: React.FocusEvent<HTMLDivElement>) {
    setFocused(false);
    if (!nodeAddable) return;
    // 值（去除了换行符）
    const value = e.target.innerText.replace(/[\r\n]/g, '');
    if (!value) return;
    if (isRoot) {
      actionCommand('AddChild', lastNode._key, value);
    } else {
      actionCommand('AddNext', lastNode._key, value);
    }
  }

  function keyDown(event: React.KeyboardEvent) {
    if (composing) {
      event.preventDefault();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!value) return;
      nodeAddable = false;
      if (isRoot) {
        actionCommand('AddChild', lastNode._key, value);
      } else {
        actionCommand('AddNext', lastNode._key, value);
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      if (!value) return;
      nodeAddable = false;
      actionCommand('AddChild', lastNode._key, value);
    }
  }

  function keyUp(event: React.KeyboardEvent<HTMLDivElement>) {
    if (composing) {
      return;
    }
    if (editorRef && editorRef.current) {
      const value = editorRef.current.innerText.replace(/[\r\n]/g, '');
      actionCommand(event.key, lastNode._key, value, true);
    }
  }

  function handleInput() {
    if (composing) {
      return;
    }
    if (editorRef && editorRef.current) {
      const value = editorRef.current.innerText.replace(/[\r\n]/g, '');
      setvalue(value);
    }
  }

  function handlePaste(event: React.ClipboardEvent) {
    if (event.clipboardData.files.length) {
      event.preventDefault();
      // let files = event.clipboardData.files;
      // handlePasteFiles(node._key, files);
      alert('请选转换为节点再执行粘贴附件！');
    }
  }

  function handleClickAdd() {
    if (value) {
      return;
    }
    if (editorRef && editorRef.current) {
      clickAdd(lastNode, editorRef.current);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        paddingLeft: '35px',
        paddingRight: '35px',
        boxSizing: 'border-box',
        opacity: focused || hover ? 1 : 0,
      }}
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
            fontSize: '16px',
            color: '#1d1d1f',
            lineHeight: '30px',
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
            <div
              style={{
                position: 'relative',
                height: '30px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                marginRight: '8px',
                cursor: value ? 'inherit' : 'pointer',
              }}
              onClick={handleClickAdd}
            >
              {value ? (
                <svg width={18} height={18} viewBox={`0,0,${18},${18}`}>
                  <circle
                    id="dot"
                    cx={9}
                    cy={9}
                    r={4}
                    fill="#66666D"
                    fillOpacity={1}
                  />
                </svg>
              ) : (
                <Icon name="plus" width="18px" height="18px" />
              )}
            </div>
          </div>

          {/* 文字 */}
          <div
            className="t-editor add-editor"
            contentEditable="true"
            spellCheck="true"
            autoCapitalize="off"
            suppressContentEditableWarning={true}
            ref={editorRef}
            onKeyDown={keyDown}
            onKeyUp={keyUp}
            onInput={handleInput}
            onPaste={handlePaste}
            onClick={() => setFocused(true)}
            onBlur={addNode}
            onCompositionStart={() => (composing = true)}
            onCompositionEnd={() => {
              composing = false;
              handleInput();
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
export default AddItem;
