import React from 'react';

interface Props {
  uri: string;
  id?: string;
}

export default function Webview({ uri, id }: Props) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <iframe
        id={id || 'web-view'}
        name="frame-container"
        className="web-view"
        title={window.name}
        src={uri}
        frameBorder="0"
        width="100%"
        height="100%"
        allowFullScreen
      ></iframe>
    </div>
  );
}
