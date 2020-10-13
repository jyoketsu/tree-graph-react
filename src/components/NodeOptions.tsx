import React, { useState, useEffect } from 'react';
import CNode from '../interfaces/CNode';
import { ClickOutside } from '@jyoketsu/click-outside-react';

interface Props {
  selectedId: string | null;
  nodeList: CNode[];
  content?: any;
  BLOCK_HEIGHT?: number;
  handleClose: Function;
}

const NodeOptions = ({
  selectedId,
  nodeList,
  BLOCK_HEIGHT,
  content,
  handleClose,
}: Props) => {
  const [selected, setSelected] = useState<CNode | null>(null);

  useEffect(() => {
    for (let index = 0; index < nodeList.length; index++) {
      const node = nodeList[index];
      if (node._key === selectedId) {
        setSelected(node);
        break;
      }
    }
  }, [selectedId, nodeList]);

  const blockHeight = BLOCK_HEIGHT || 30;
  const top = selected ? selected.y + blockHeight + 5 : 0;
  const left = selected ? selected.x + selected.width + 5 : 0;

  return (
    <ClickOutside onClickOutside={() => handleClose()}>
      {selected ? (
        <div
          className="node-input"
          style={{
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
          }}
        >
          {content}
        </div>
      ) : null}
    </ClickOutside>
  );
};

export default NodeOptions;
