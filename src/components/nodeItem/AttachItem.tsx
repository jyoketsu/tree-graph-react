import React from 'react';
import Attach from '../../interfaces/Attach';
import Icon from '../icon';

interface ClickFunc {
  (id: string): void;
}

interface Props {
  id: string;
  attach: Attach;
  selectedAttachId: string;
  themeColor: string;
  handleClick: ClickFunc;
}
export default function AttachItem({
  id,
  attach,
  selectedAttachId,
  themeColor,
  handleClick,
}: Props) {
  const isImage = attach.type.includes('image/');

  function clickAttach() {
    if (selectedAttachId === id) {
      window.open(attach.url, '__blank');
    } else {
      handleClick(id);
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
      onClick={clickAttach}
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
