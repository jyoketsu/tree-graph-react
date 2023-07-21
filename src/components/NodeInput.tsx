import React, { useState, useEffect, useRef } from 'react';
import CNode from '../interfaces/CNode';
import { nodeLocation, textWidthAll } from '../services/util';
import { HandleFileChange } from '../Tree';
import { ClickOutside } from './common/ClickOutside';

let composing = false;

interface HandleQuickCommandOpen {
  (nodeEl: HTMLElement): void;
}

interface Props {
  selectedId: string | null;
  nodeList: CNode[];
  showChildNum: boolean;
  BLOCK_HEIGHT?: number;
  FONT_SIZE?: number;
  showIcon: boolean;
  showAvatar: boolean;
  avatarRadius: number;
  startId: string;
  quickCommandKey?: string;
  handleChangeNodeText: Function;
  handleFileChange?: HandleFileChange;
  handleQuickCommandOpen?: HandleQuickCommandOpen;
}

const NodeInput = ({
  selectedId,
  nodeList,
  showChildNum,
  BLOCK_HEIGHT,
  FONT_SIZE,
  showIcon,
  showAvatar,
  avatarRadius,
  startId,
  quickCommandKey,
  handleChangeNodeText,
  handleFileChange,
  handleQuickCommandOpen,
}: Props) => {
  const inputRef = useRef<any>(null);
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState<CNode | null>(null);

  function handleCommit(e: React.KeyboardEvent) {
    if (composing) {
      return;
    }
    if (quickCommandKey && e.key === quickCommandKey) {
      if (handleQuickCommandOpen && selectedId && !value) {
        const el = document.getElementById(`tree-node-${selectedId}`);
        if (el) {
          return handleQuickCommandOpen(el);
        }
      }
    }

    if ((e.key === 'Enter' || e.key === 'Tab') && selected) {
      handleChangeNodeText(selected._key, value.replaceAll("'", ''));
    }
  }

  const handleClickoutside = () => {
    if (selectedId && inputRef && inputRef.current) {
      handleChangeNodeText(selectedId, inputRef.current.value);
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    if (event.clipboardData.files.length && handleFileChange && selectedId) {
      event.preventDefault();
      let files = event.clipboardData.files;
      handleFileChange(selectedId, value, files);
    }
  };

  const handleCompositionStart = () => {
    composing = true;
  };

  const handleCompositionEnd = () => {
    composing = false;
  };

  useEffect(() => {
    for (let index = 0; index < nodeList.length; index++) {
      const node = nodeList[index];
      if (node._key === selectedId) {
        setSelected(node);
        setValue(node.name);
        break;
      }
    }
  }, [selectedId, nodeList]);

  let left = 0;
  let top = 0;
  let inputWidth = 100;
  if (selected) {
    const height = FONT_SIZE || 14;
    const wrapperHeight = BLOCK_HEIGHT || 30;
    top = selected.y + (wrapperHeight - height) / 2;
    const textX = nodeLocation(
      selected,
      'text',
      BLOCK_HEIGHT || 30,
      showIcon,
      showAvatar,
      avatarRadius,
      showChildNum
    );
    if (selected.toLeft && !selected.name) {
      // left = textX ? textX.x + 85 : selected.x + 85;
      left = textX ? textX.x : selected.x;
    } else {
      left = textX ? textX.x : selected.x;
      top = top;
    }
    inputWidth = textWidthAll(
      FONT_SIZE || 14,
      selected.shorted || selected.name
    );
  }

  return (
    <ClickOutside onClickOutside={handleClickoutside}>
      {selected ? (
        <input
          className="node-input"
          type="text"
          style={{
            boxSizing: 'border-box',
            // border: '1px solid #000000',
            border: 'unset',
            // borderRadius: '4px',
            // padding: '0 5px',
            padding: 'unset',
            outline: 'none',
            position: 'absolute',
            width: `${inputWidth < 100 ? 100 : inputWidth}px`,
            // height: `${BLOCK_HEIGHT ? BLOCK_HEIGHT + 2 : 30}px`,
            height: `${FONT_SIZE || 14}px`,
            fontSize: `${FONT_SIZE || 14}px`,
            top: `${top}px`,
            left: `${left}px`,
            backgroundColor:
              selected._key === startId
                ? '#CB1B45'
                : selected.backgroundColor || '#e8e8e8',
            color: selected._key === startId ? '#FFF' : selected.color,
          }}
          ref={inputRef}
          autoFocus={true}
          placeholder="未命名"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleCommit}
          onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
          onMouseMove={(e: React.MouseEvent) => e.stopPropagation()}
          onContextMenu={(e: React.MouseEvent) => e.stopPropagation()}
          onPaste={handlePaste}
        />
      ) : null}
    </ClickOutside>
  );
};

export default NodeInput;
