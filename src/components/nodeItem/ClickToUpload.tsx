import React from 'react';
import { HandleClickUpload } from '../..';

interface Props {
  nodeKey: string;
  type: string;
  handleClickUpload: HandleClickUpload;
}
export default function ClickToUpload({
  nodeKey,
  type,
  handleClickUpload,
}: Props) {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#EEECEC',
        color: '#8c8282',
        padding: '13px 10px',
        cursor: 'pointer',
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
      onClick={(e) => handleClickUpload(nodeKey, e.currentTarget)}
    >
      {type === 'file' ? '点击添加文件' : '点击输入链接地址'}
    </div>
  );
}
