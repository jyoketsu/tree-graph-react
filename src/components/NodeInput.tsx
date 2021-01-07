import React, { useState, useEffect, useRef } from 'react';
import CNode from '../interfaces/CNode';
import { ClickOutside } from '@jyoketsu/click-outside-react';

interface Props {
  selectedId: string | null;
  nodeList: CNode[];
  BLOCK_HEIGHT?: number;
  FONT_SIZE?: number;
  handleChangeNodeText: Function;
}

const NodeInput = ({
  selectedId,
  nodeList,
  BLOCK_HEIGHT,
  FONT_SIZE,
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
  if (selected) {
    if (selected.toLeft && !selected.name) {
      left = selected.x - 85;
    } else {
      left = selected.x - 1;
    }
  }

  return (
    <ClickOutside onClickOutside={handleClickoutside}>
      {selected ? (
        <input
          className="node-input"
          style={{
            boxSizing: 'border-box',
            border: '1px solid #000000',
            borderRadius: '4px',
            padding: '0 5px',
            outline: 'none',
            position: 'absolute',
            width: `${selected && selected.name ? selected.width + 2 : 100}px`,
            height: `${BLOCK_HEIGHT ? BLOCK_HEIGHT + 2 : 30}px`,
            fontSize: `${FONT_SIZE || 14}px`,
            top: `${selected && selected.y ? selected.y - 1 : 0}px`,
            left: `${left}px`,
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
