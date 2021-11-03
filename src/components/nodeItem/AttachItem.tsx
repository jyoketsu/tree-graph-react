import React from 'react';
import Attach from '../../interfaces/Attach';
import { HandleDeleteAttach } from '../../TreeEditor';
import Icon from '../icon';

interface ClickFunc {
  (id: string): void;
}

interface Props {
  id: string;
  attachIndex: number;
  nodeKey: string;
  attach: Attach;
  selectedAttachId: string;
  themeColor: string;
  handleClick: ClickFunc;
  handleDeleteAttach: HandleDeleteAttach;
}
export default function AttachItem({
  id,
  attachIndex,
  nodeKey,
  attach,
  selectedAttachId,
  themeColor,
  handleClick,
  handleDeleteAttach,
}: Props) {
  const isImage = attach.type.includes('image/');

  function clickAttach() {
    if (selectedAttachId === id) {
      window.open(attach.url, '__blank');
    } else {
      handleClick(id);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Backspace' && selectedAttachId === id) {
      handleDeleteAttach(nodeKey, attachIndex);
    }
  }

  return (
    <div
      style={{
        width: isImage ? 'fit-content' : '120px',
        height: '120px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: `2px solid ${
          selectedAttachId === id ? themeColor : 'transparent'
        }`,
        cursor: selectedAttachId === id ? 'zoom-in' : 'pointer',
        marginBottom: '8px',
        boxSizing: 'border-box',
      }}
      tabIndex={-1}
      onClick={clickAttach}
      onKeyDown={handleKeyDown}
    >
      {isImage ? (
        <img
          draggable={false}
          alt={attach.name}
          src={attach.url}
          height="100%"
        />
      ) : (
        <Icon name="attach" width="100%" height="100%" />
      )}
    </div>
  );
}
