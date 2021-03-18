import React, { useState, useEffect, useRef } from 'react';
import CNode from '../interfaces/CNode';
import { ClickOutside } from '@jyoketsu/click-outside-react';
import { nodeLocation, textWidthAll } from '../services/util';

interface Props {
  selectedId: string | null;
  nodeList: CNode[];
  BLOCK_HEIGHT?: number;
  FONT_SIZE?: number;
  showIcon: boolean;
  showAvatar: boolean;
  handleChangeNodeText: Function;
}

const NodeInput = ({
  selectedId,
  nodeList,
  BLOCK_HEIGHT,
  FONT_SIZE,
  showIcon,
  showAvatar,
  handleChangeNodeText,
}: Props) => {
  const inputRef = useRef<any>(null);
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState<CNode | null>(null);

  function handleCommit(event: KeyboardEvent) {
    if (event.key === 'Enter' && selected) {
      handleChangeNodeText(selected._key, value);
    }
  }

  const handleClickoutside = () => {
    if (selectedId && inputRef && inputRef.current) {
      handleChangeNodeText(selectedId, inputRef.current.value);
    }
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
      showAvatar
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
          style={{
            boxSizing: 'border-box',
            // border: '1px solid #000000',
            border: 'unset',
            // borderRadius: '4px',
            // padding: '0 5px',
            padding: 'unset',
            outline: 'none',
            position: 'absolute',
            width: `${inputWidth || 100}px`,
            // height: `${BLOCK_HEIGHT ? BLOCK_HEIGHT + 2 : 30}px`,
            height: `${FONT_SIZE || 14}px`,
            fontSize: `${FONT_SIZE || 14}px`,
            top: `${top}px`,
            left: `${left}px`,
            backgroundColor: selected.backgroundColor || '#e8e8e8',
            color: selected.color,
          }}
          ref={inputRef}
          autoFocus={true}
          placeholder="请输入名称"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={(e: any) => handleCommit(e)}
          onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
          onMouseMove={(e: React.MouseEvent) => e.stopPropagation()}
          onContextMenu={(e: React.MouseEvent) => e.stopPropagation()}
        />
      ) : null}
    </ClickOutside>
  );
};

export default NodeInput;
