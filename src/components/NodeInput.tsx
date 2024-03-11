import React, { useState, useEffect, useRef } from 'react';
import CNode from '../interfaces/CNode';
import { getTextWidth, nodeLocation, textWidthAll } from '../services/util';
import { HandleFileChange } from '../Tree';
import { ClickOutside } from './common/ClickOutside';

let composing = false;

interface HandleQuickCommandOpen {
  (nodeEl: HTMLElement): void;
}

interface Props {
  selectedId: string | null;
  nodeList: CNode[];
  topBottomMargin: number;
  lineHeight: number;
  FONT_SIZE?: number;
  showIcon: boolean;
  showAvatar: boolean;
  avatarRadius: number;
  startId: string;
  textMaxWidth: number;
  startNodeBg:string;
  selectedBorderColor: string;
  quickCommandKey?: string;
  nodeColor?: string;
  inputEmpty?: boolean;
  handleChangeNodeText: Function;
  handleFileChange?: HandleFileChange;
  handleQuickCommandOpen?: HandleQuickCommandOpen;
}

const NodeInput = ({
  selectedId,
  nodeList,
  topBottomMargin,
  lineHeight,
  FONT_SIZE,
  showIcon,
  showAvatar,
  avatarRadius,
  startId,
  startNodeBg,
  textMaxWidth,
  selectedBorderColor,
  quickCommandKey,
  nodeColor,
  inputEmpty,
  handleChangeNodeText,
  handleFileChange,
  handleQuickCommandOpen,
}: Props) => {
  const inputRef = useRef<any>(null);
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState<CNode | null>(null);
  const [rows, setRows] = useState(1);
  const [inputWidth, setInputWidth] = useState(50);

  useEffect(() => {
    if (selected) {
      setRows(selected.texts?.length || 1);
      setInputWidth(
        selected.texts
          ? textMaxWidth
          : textWidthAll(FONT_SIZE || 14, selected.name || 'untitled')
      );
      inputRef.current.value = '';
      if (!inputEmpty) {
        inputRef.current.value = selected.name;
      }
    } else {
      setInputWidth(50);
    }
  }, [selected]);

  function handleCommit(e: React.KeyboardEvent) {
    if (composing) {
      return;
    }
    if ((e.key === 'Enter' || e.key === 'Tab') && e.shiftKey) {
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

  const handleChange = (val: string) => {
    const res = getTextWidth(
      val || 'untitled',
      textMaxWidth,
      FONT_SIZE || 14,
      selected?.bold
    );
    setInputWidth(res.width + 12);
    setRows(res.texts.length || 1);
    // const width = textWidthAll(FONT_SIZE || 14, val);
    // if (width > textMaxWidth) {
    //   setInputWidth(textMaxWidth);
    //   const texts = splitTextIntoParagraphs(val, textMaxWidth, FONT_SIZE || 14);
    //   setRows(texts.length);
    // } else {
    //   setInputWidth(width + 8);
    // }

    setValue(val);
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
  if (selected) {
    top = selected.y;
    const textX = nodeLocation(
      selected,
      'text',
      topBottomMargin * 2 + lineHeight,
      showIcon,
      showAvatar,
      avatarRadius,
      true
    );
    if (selected.toLeft && !selected.name) {
      // left = textX ? textX.x + 85 : selected.x + 85;
      left = textX ? textX.x : selected.x;
    } else {
      left = textX ? textX.x : selected.x;
      top = top;
    }
  }

  return (
    <ClickOutside onClickOutside={handleClickoutside}>
      {selected ? (
        <div
          style={{
            position: 'absolute',
            top: `${top - 1}px`,
            left: `${selected.x - 1}px`,
            minWidth: `${selected.width + 2}px`,
            backgroundColor:
              // selected._key === startId
              //   ? '#CB1B45'
              //   : nodeColor || selected.backgroundColor || '#f0f0f0',

              selected.backgroundColor
                ? selected.backgroundColor
                : selected._key === startId
                ? startNodeBg
                : nodeColor || '#f0f0f0',

            paddingLeft: `${left - selected.x}px`,
            borderRadius: '4px',
            border: `2px solid ${selectedBorderColor}`,
            boxSizing: 'border-box',
          }}
        >
          <textarea
            className="node-input"
            style={{
              boxSizing: 'border-box',
              // border: '1px solid #000000',
              border: 'unset',
              // borderRadius: '4px',
              // padding: '0 5px',
              padding: 'unset',
              outline: 'none',
              width: `${inputWidth < 50 ? 50 : inputWidth}px`,
              // height: `${BLOCK_HEIGHT ? BLOCK_HEIGHT + 2 : 30}px`,
              fontSize: `${FONT_SIZE || 14}px`,
              fontFamily: 'inherit',
              fontWeight: 'inherit',
              color: selected._key === startId ? '#FFF' : selected.color,
              resize: 'none',
              lineHeight: `${lineHeight}px`,
              backgroundColor: 'inherit',
              wordBreak: 'break-all',
              overflow: 'hidden',
              marginTop: `${topBottomMargin}px`,
            }}
            ref={inputRef}
            autoFocus={true}
            placeholder="untitled"
            rows={rows}
            value={value}
            onChange={(e: any) => handleChange(e.target.value)}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={handleCommit}
            onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
            onMouseMove={(e: React.MouseEvent) => e.stopPropagation()}
            onContextMenu={(e: React.MouseEvent) => e.stopPropagation()}
            onPaste={handlePaste}
          />
        </div>
      ) : null}
    </ClickOutside>
  );
};

export default NodeInput;
