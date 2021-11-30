import React from 'react';

interface Props {
  linkType: string;
  url: string;
}

export default function LinkViewer({ linkType, url }: Props) {
  return (
    <div
      style={{
        width: '100%',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <iframe
        src={url}
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        width="100%"
        height={linkType === 'wangyiyun' ? '85px' : '500px'}
      ></iframe>
    </div>
  );
}
