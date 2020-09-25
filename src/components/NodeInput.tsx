import React, { useState, useEffect } from 'react';
import './NodeInput.css';
import CNode from '../interfaces/CNode';
import ClickOutside from './ClickOutside';

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
  const [value, setValue] = useState(selected?.name);

  function handleCommit(event: KeyboardEvent) {
    if (event.key === 'Enter' && selected) {
      handleChangeNodeText(selected._key, value);
    }
  }

  useEffect(() => {
    setValue(selected?.name);
  }, [selected]);

  return (
    <ClickOutside
      onClickOutside={() => handleChangeNodeText(selected?._key, value)}
    >
      <input
        className="node-input"
        style={{
          width: `${selected?.width}px`,
          height: `${BLOCK_HEIGHT || 30}px`,
          fontSize: `${FONT_SIZE || 14}px`,
          top: `${selected?.y}px`,
          left: `${selected?.x}px`,
        }}
        autoFocus={true}
        placeholder="请输入节点名"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={(e: any) => handleCommit(e)}
      />
    </ClickOutside>
  );
};

export default NodeInput;
