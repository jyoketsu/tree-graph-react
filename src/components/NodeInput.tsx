import React, { useState, useEffect, useRef } from 'react';
import CNode from '../interfaces/CNode';
import { ClickOutside } from '@jyoketsu/click-outside-react';

interface Props {
  selected: CNode | null;
  BLOCK_HEIGHT?: number;
  FONT_SIZE?: number;
  handleChangeNodeText: Function;
}

const NodeInput = ({
  selected,
  BLOCK_HEIGHT,
  FONT_SIZE,
  handleChangeNodeText,
}: Props) => {
  const inputRef = useRef<any>(null);
  const [value, setValue] = useState(selected?.name);

  function handleCommit(event: KeyboardEvent) {
    if (event.key === 'Enter' && selected) {
      handleChangeNodeText(selected._key, value);
    }
  }

  const handleClickoutside = () => {
    if (selected && inputRef && inputRef.current) {
      handleChangeNodeText(selected._key, inputRef.current.value);
    }
  };

  useEffect(() => {
    setValue(selected?.name);
  }, [selected]);

  return (
    <ClickOutside onClickOutside={handleClickoutside}>
      <input
        className="node-input"
        style={{
          boxSizing: 'border-box',
          border: '1px solid #000000',
          borderRadius: '4px',
          padding: '0 5px',
          outline: 'none',
          position: 'absolute',
          width: `${selected?.width}px`,
          height: `${BLOCK_HEIGHT || 30}px`,
          fontSize: `${FONT_SIZE || 14}px`,
          top: `${selected?.y}px`,
          left: `${selected?.x}px`,
        }}
        ref={inputRef}
        autoFocus={true}
        placeholder="请输入名称"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={(e: any) => handleCommit(e)}
        onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
        onContextMenu={(e: React.MouseEvent) => e.stopPropagation()}
      />
    </ClickOutside>
  );
};

export default NodeInput;
