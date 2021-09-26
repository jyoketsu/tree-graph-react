import React from 'react';

export default function Loading() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
      }}
    >
      <span style={{ fontSize: '18px' }}>加载中……</span>
    </div>
  );
}
